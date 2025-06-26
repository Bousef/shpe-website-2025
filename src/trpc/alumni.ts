/*
Alumni:
getAlumni [ID]
getAlumnibyYear [Year]
getAlumnibyPosition [Position]
*/

import { publicProcedure, createTRPCRouter } from "src/server/api/trpc";
import { db } from "src/server/db";
import { alumni } from "src/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const alumniRouter = createTRPCRouter({
  //get alumni by id

  //get all alumni based on year

  //get all alumni based on position 
  
});