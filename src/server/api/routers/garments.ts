import { z } from "zod";

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
        genre: z.string().nullish(),
        category: z.string().nullish(),
        size: z.string().nullish(),
      }),
    )
    .query(
      async ({ input: { limit = 2, cursor, genre, category, size }, ctx }) => {
        const currentUserId = ctx.session?.user.id;

        const data = await ctx.prisma.garment.findMany({
          take: limit + 1,
          cursor: cursor ? { createdAt_id: cursor } : undefined,
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],

          where: {
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
    .query(({ ctx, input }) => {
      const currentUserId = ctx.session?.user.id;
      const { id } = input;
      //
      return ctx.prisma.garment.findFirst({
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
