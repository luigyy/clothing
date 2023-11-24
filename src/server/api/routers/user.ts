import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    const id = ctx.session?.user.id;
    if (!id) return null;

    return ctx.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        locationLink: true,
        exactLocation: true,
      },
    });
  }),

  //creating thiis route
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        newName: z.string(),
        newLastName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id, newName, newLastName } }) => {
      const user = await ctx.prisma.user.findFirst({ where: { id } });
      if (!user) return { message: "Could not find user" };

      await ctx.prisma.user.update({
        where: { id },
        data: { name: newName, lastName: newLastName },
      });
    }),
});
