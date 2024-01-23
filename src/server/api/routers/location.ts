import { createSecretKey } from "crypto";
import { z } from "zod";
import { USER_ROLES } from "~/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const locationRouter = createTRPCRouter({
  //checks if current user has admin role
  createLocation: protectedProcedure
    .input(
      z.object({
        province: z.string(),
        municipality: z.string(),
        district: z.string(),
        exactLocation: z.string(),
        locationLink: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.location.create({
        data: {
          province: input.province,
          municipality: input.municipality,
          district: input.district,
          exactLocation: input.exactLocation,
          locationLink: input.locationLink,
          userId: ctx.session.user.id,
        },
      });
    }),
  deleteLocation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.location.delete({ where: { id: input.id } });
    }),
});
