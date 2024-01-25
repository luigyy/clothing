import { createSecretKey } from "crypto";
import { z } from "zod";
import { USER_ROLES } from "~/constants";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const locationRouter = createTRPCRouter({
  getUserLocations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      include: { userLocation: true },
    });
  }),
  //checks if current user has admin role
  createLocation: protectedProcedure
    .input(
      z.object({
        name: z.string(),
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
          name: input.name,
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
