import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ORDER_STATUS } from "~/constants";
import { calculateTotal } from "~/pages/cart/layout";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
        location: true,
        user: true,
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

  /**
   * links an existing location of id : @locationId, to an order, if location of id : @locationId does not exist, returns false, else true
   */
  setOrderLocation: protectedProcedure
    .input(z.object({ locationId: z.string(), orderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      //check if location obj exists
      const location = await ctx.prisma.location.findFirst({
        where: { id: input.locationId },
      });

      if (!location) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      //check if location already connected
      const order = await ctx.prisma.order.findFirst({
        where: { id: input.orderId },
      });

      //if already existing location, disconnect it
      if (order?.locationId) {
        await ctx.prisma.order.update({
          where: { id: input.orderId },
          data: { location: { disconnect: true } },
        });
      }

      await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: { location: { connect: { id: input.locationId } } },
      });
      return true;
    }),

  setOrderPrice: protectedProcedure
    .input(
      z.object({
        total: z.number(),
        orderId: z.string(),
        discountAmount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //general cleanse
      if (input.discountAmount < 0 || input.total < 0) {
        return false;
      }

      //check order total server side
      const myOrder = await ctx.prisma.order.findFirst({
        where: { id: input.orderId },
        include: { garments: true },
      });

      const serverSideTotal = calculateTotal(myOrder?.garments);

      const myUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      //validate if user has enough credits to apply the disccount,
      //which means, see if walletCredits < disccount, else the user is trying to apply a disccount greater than what he/she has.
      if (input.discountAmount !== 0) {
        if (
          !myUser?.walletCredits ||
          myUser.walletCredits < input.discountAmount
        ) {
          console.log(myUser?.walletCredits, input.discountAmount);
          return false;
        }
      }
      //if server-side calculated total doesnt match to client total, price coming from client has been modified
      if (
        serverSideTotal - input.discountAmount !==
        input.total - input.discountAmount
      ) {
        return false;
      }

      // total match. So update purchase total and credits used accordingly
      await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          purchaseTotal: input.total - input.discountAmount,
          creditsUsed: input.discountAmount,
        },
      });

      //success
      return true;
    }),

  //handles successfull payments
  setOrderToAlreadyPaid: protectedProcedure
    .input(z.object({ orderId: z.string(), creditsUsed: z.number() }))
    .mutation(async ({ ctx, input }) => {
      //check if order has already been paid
      const order = await ctx.prisma.order.findFirst({
        where: { id: input.orderId },
      });

      if (!order) return;

      if (order.isPaid === true) {
        return;
      }
      if (input.creditsUsed < 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User credits less than 0",
        });
      }

      //update user wallet to decrement credits used
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          walletCredits: { decrement: input.creditsUsed },
        },
      });

      // update order
      return await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          isPaid: true,
          orderStatus: ORDER_STATUS.PAID,
          purchaseDate: new Date(),

          //update garments inside order
          garments: {
            updateMany: {
              where: { orderId: input.orderId },
              data: {
                isAvailabe: false,
                purchaseDate: new Date(),
              },
            },
          },
        },
      });
    }),
});
