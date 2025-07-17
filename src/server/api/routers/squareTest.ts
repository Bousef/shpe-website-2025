import { createTRPCRouter, publicProcedure } from "../trpc";
import { testSquareConnection } from "~/lib/square/testConnection"

export const squareTestRouter = createTRPCRouter({
  test: publicProcedure.query(async () => {
    return await testSquareConnection();
  }),
});