import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { memberRouter } from "./routers/member";
import { alumniRouter } from "./routers/alumni";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { clothingRouter } from "./routers/clothing";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  post: postRouter,
  member: memberRouter,
  alumni: alumniRouter,
  user: userRouter,
  product: productRouter,
  clothing: clothingRouter,
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
