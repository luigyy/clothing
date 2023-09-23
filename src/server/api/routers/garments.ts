import { Prisma } from "@prisma/client";
import { z } from "zod";

type Garment = Prisma.GarmentGetPayload<{
  include: {
    pictures: true;
    _count: true;
    likes: true;
  };
}>;
type ExtendedGarment = Garment & { isFavorite: boolean };
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const garmentsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
        //filters
        id: z.string().nullish(),
        genre: z.string().nullish(),
        category: z.string().nullish(),
        size: z.string().nullish(),
        currentPage: z.object({
          favorites: z.boolean().optional(),
          garments: z.boolean().optional(),
          recommendations: z.boolean().optional(),
        }),
      }),
    )
    .query(
      async ({
        input: { limit = 9, cursor, genre, category, size, id, currentPage },
        ctx,
      }) => {
        const currentUserId = ctx.session?.user.id;

        let data;

        //get the data conditionally
        if (currentPage.favorites) {
          data = await ctx.prisma.garment.findMany({
            take: limit + 1,
            cursor: cursor ? { createdAt_id: cursor } : undefined,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],

            include: {
              pictures: true,
              likes:
                currentUserId == null
                  ? false
                  : { where: { userId: currentUserId } },
            },

            where: {
              likes: {
                some: {
                  userId: currentUserId,
                },
              },
            },
          });
        } else {
          data = await ctx.prisma.garment.findMany({
            take: limit + 1,
            cursor: cursor ? { createdAt_id: cursor } : undefined,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],

            where: {
              id: id ?? undefined,
              genre: genre ?? undefined,
              category: category ?? undefined,
              size: size ?? undefined,
            },

            include: {
              pictures: true,
              likes:
                currentUserId == null
                  ? false
                  : { where: { userId: currentUserId } },
            },
          });
        }

        // let nextCursor: typeof cursor | undefined;
        // if (data.length > limit) {
        //   const nextItem = data.pop();
        //   if (nextItem != null) {
        //     nextCursor = { id: nextItem.id, created_at: nextItem.created_at };
        //   }
        // }
        let nextCursor: typeof cursor | undefined;
        if (data.length > limit) {
          const nextItem = data.pop();
          if (nextItem != null) {
            nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
          }
        }

        return {
          garments: data.map((item) => {
            return { ...item, isFavorite: item.likes.length > 0 };
          }),
          nextCursor,
        };
      },
    ),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session?.user.id;
      const { id } = input;
      //
      const data = await ctx.prisma.garment.findFirst({
        where: {
          id,
        },
        include: {
          pictures: true,
          user: { select: { name: true } },
          _count: {
            select: {
              likes: true,
            },
          },
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
        },
      });
      // return data;
      const isFavorite = data?.likes && data?.likes.length > 0;
      return { garment: { ...data! }, isFavorite };
    }),
  getFavorites: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session?.user.id;
    //
    const data = await ctx.prisma.garment.findMany({
      where: {
        userId: currentUserId,
      },
      include: {
        pictures: true,
        user: { select: { name: true } },
        _count: {
          select: {
            likes: true,
          },
        },
        likes:
          currentUserId == null ? false : { where: { userId: currentUserId } },
      },
    });
    // return data;
    // const isFavorite = data?.likes && data?.likes.length > 0;
    return {
      garments: data.map((garment) => {
        return {
          ...garment,
          isFavorite: garment.likes.length > 0,
        };
      }),
    };
  }),

  toggleLike: protectedProcedure
    .input(z.object({ garmentId: z.string() }))
    .mutation(async ({ input: { garmentId }, ctx }) => {
      const data = { garmentId, userId: ctx.session.user.id };

      const existingLike = await ctx.prisma.garmentLikes.findUnique({
        where: { userId_garmentId: data },
      });

      if (existingLike == null) {
        await ctx.prisma.garmentLikes.create({ data });
        return { addedLike: true };
      }
      //exists
      await ctx.prisma.garmentLikes.delete({
        where: { userId_garmentId: data },
      });
      return { addedLike: false };
    }),

  getAllByFilter: publicProcedure
    .input(
      z.object({
        genre: z.string().nullish(),
        category: z.string().nullish(),
        size: z.string().nullish(),
      }),
    )
    .query(({ ctx, input }) => {
      const { genre, category, size } = input;
      return ctx.prisma.garment.findMany({
        where: {
          genre: genre ?? undefined,
          category: category ?? undefined,
          size: size ?? undefined,
        },
        include: {
          pictures: true,
        },
      });
    }),
  //   getSecretMessage: protectedProcedure.query(() => {
  //     return "you can now see this secret message!";
  //   }),
});
