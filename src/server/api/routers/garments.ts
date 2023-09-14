import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const garmentsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.garment.findMany({
      include: {
        pictures: true,
      },
    });
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const { id } = input;
      //
      return ctx.prisma.garment.findFirst({
        where: {
          id,
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
