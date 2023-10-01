import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { garmentsRouter } from "./routers/garments";
import { ordersRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  garments: garmentsRouter,
  orders: ordersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
