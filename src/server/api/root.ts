import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { memberRouter } from "./routers/member";
import { alumniRouter } from "./routers/alumni";
import { catalogRouter } from "./routers/catalog";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { clothingRouter } from "./routers/clothing";
import { cartRouter } from "./routers/cart";
import { resetCodeRouter } from "./routers/reset-code";
import { ordersRouter } from "./routers/orders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

const squareRouter = createTRPCRouter({
  catalog: catalogRouter,
});

export const appRouter = createTRPCRouter({
  post: postRouter,
  member: memberRouter,
  alumni: alumniRouter, 
  square: squareRouter,
  user: userRouter,
  product: productRouter,
  clothing: clothingRouter,
  cart: cartRouter,
  resetCode: resetCodeRouter,
  orders: ordersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
