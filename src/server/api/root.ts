import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { memberRouter } from "./routers/member";
import { alumniRouter } from "./routers/alumni";
import { cartRouter } from "./routers/cart";

import { squareTestRouter } from "./routers/squareTest";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

/// Represents the currently signed-in user.
export const userRouter = createTRPCRouter({
  cart: cartRouter,
});

export const appRouter = createTRPCRouter({
  post: postRouter,
  member: memberRouter,
  alumni: alumniRouter,
  user: userRouter,
  squareTest: squareTestRouter
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
