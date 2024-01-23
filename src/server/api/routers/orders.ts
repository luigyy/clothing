import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ordersRouter = createTRPCRouter({
  getCurrentUserCart: protectedProcedure.query(async ({ ctx }) => {
    //get user
    const currentUserId = ctx.session?.user.id;
    const order = await ctx.prisma.order.findFirst({
      where: {
        userId: currentUserId,
        isPaid: false,
      },
      include: {
        garments: { include: { pictures: true } },
      },
    });

    return order;
  }),

  deleteGarmentFromCart: protectedProcedure
    .input(z.object({ garmentId: z.string() }))
    .mutation(async ({ ctx, input: { garmentId } }) => {
      //get user
      const currentUserId = ctx.session?.user.id;

      if (!currentUserId) return { message: "Not logged in" };

      //get order
      const myOrder = await ctx.prisma.order.findFirst({
        where: { userId: currentUserId, isPaid: false },
        include: { garments: true },
      });

      if (!myOrder) return { message: "Could not find cart" };

      await ctx.prisma.order.update({
        where: { id: myOrder.id },
        data: {
          garments: {
            disconnect: {
              id: garmentId,
            },
          },
        },
      });

      return { message: "Successfully deleted from cart" };
    }),

  addGarmentToCart: protectedProcedure
    .input(z.object({ garmentId: z.string() }))
    .mutation(async ({ ctx, input: { garmentId } }) => {
      //get user
      const currentUserId = ctx.session?.user.id;
      if (!currentUserId) return { message: "Not logged in" };

      //get order
      const myOrder = await ctx.prisma.order.findFirst({
        where: { userId: currentUserId, isPaid: false },
        include: { garments: true },
      });

      //check if user already has a cart, if user does have a cart, add the garment.
      // Else, create a cart with the garment in it
      if (!myOrder) {
        await ctx.prisma.order.create({
          data: {
            userId: currentUserId,
            isPaid: false,
            orderStatus: "cart",
            garments: { connect: [{ id: garmentId }] },
          },
        });
        return { error: false, message: "Created cart and added garment" };
      }

      //check if garment is already in cart
      const garmentIsAlreadyInCart = myOrder.garments.find(
        (garment) => garment.id === garmentId,
      );

      if (garmentIsAlreadyInCart) {
        return { error: true, message: "Garment already in cart" };
      }

      await ctx.prisma.order.update({
        where: { id: myOrder.id },
        data: {
          garments: {
            connect: [{ id: garmentId }],
          },
        },
      });

      return { error: false, message: "Garment added to cart successfully" };
      //
    }),
});
