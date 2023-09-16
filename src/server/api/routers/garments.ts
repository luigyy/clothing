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
        cursor: z.object({ id: z.string(), created_at: z.date() }).optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.prisma.garment.findMany({
        take: limit + 1,
        cursor: cursor ? { created_at_id: cursor } : undefined,
        orderBy: [{ created_at: "desc" }, { id: "desc" }],

        include: {
          pictures: true,
          likes:
            currentUserId == null
              ? false
              : { where: { userId: currentUserId } },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem != null) {
          nextCursor = { id: nextItem.id, created_at: nextItem.created_at };
        }
      }
      return {
        data: data.map((item) => {
          return { ...item, isFavorite: item.likes.length > 0 };
        }),
        nextCursor,
      };
    }),
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
