import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { garmentsRouter } from "./routers/garments";
import { ordersRouter } from "./routers/orders";
import { adminRouter } from "./routers/admin";
import { locationRouter } from "./routers/location";
import { paymentRouter } from "./routers/payment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  garments: garmentsRouter,
  orders: ordersRouter,
  users: userRouter,
  admin: adminRouter,
  location: locationRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
