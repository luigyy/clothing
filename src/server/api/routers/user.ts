import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { ProfileFormSchema } from "~/types";

const ExtendedProfileFormSchema = ProfileFormSchema.extend({
  id: z.string(),
});

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
        walletCredits: true,
        userLocation: {
          select: {
            id: true,
            province: true,
            municipality: true,
            district: true,
            exactLocation: true,
            locationLink: true,
          },
        },
      },
    });
  }),

  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input: { userId } }) => {
      return ctx.prisma.user.findFirst({ where: { id: userId } });
    }),

  //creating thiis route
  updateUser: protectedProcedure
    .input(ExtendedProfileFormSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({ where: { id: input.id } });
      if (!user) throw Error("Could not find user");

      await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
        },
      });
    }),
});
