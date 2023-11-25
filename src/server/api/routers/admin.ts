import { z } from "zod";
import { USER_ROLES } from "~/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  //checks if current user has admin role
  checkAdminRole: protectedProcedure.query(async ({ ctx }) => {
    const id = ctx.session?.user.id;
    if (!id) return null;

    const currentUser = await ctx.prisma.user.findFirst({
      where: { id },
    });

    if (!currentUser) return null;

    if (currentUser.role === USER_ROLES.ADMIN) return true;
    return false;
  }),
});
