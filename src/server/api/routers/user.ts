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
        locationLink: true,
        exactLocation: true,
      },
    });
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
          exactLocation: input.exactLocation,
          locationLink: input.locationLink,
          phoneNumber: input.phoneNumber,
        },
      });
    }),
});
