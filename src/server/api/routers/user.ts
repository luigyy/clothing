import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(({ ctx }) => {
    const id = ctx.session?.user.id;
    if (!id) return null;

    return ctx.prisma.user.findFirst({
      where: { id },
      select: {
        name: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        locationLink: true,
        exactLocation: true,
      },
    });
  }),
});
