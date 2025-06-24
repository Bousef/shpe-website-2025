/*
Members:
getMember [ID]
createMember
updateMember [ID]
deleteMember [ID]

*/

import { publicProcedure, createTRPCRouter } from "src/server/api/trpc";
import { db } from "src/server/db";
import { members } from "src/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const memberRouter = createTRPCRouter({

  //create member -> looks longer than it actually is
  createMember: publicProcedure
  .input(
    z.object({
      ucf_id: z.number(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
    })
  )
  .mutation(async ({ input }) => {
    const existingMember = await db
    .select()
    .from(members)
    .where(eq(members.email, input.email));

    if (existingMember.length > 0) {

      // We return null to tell the user that there the member already exists
      return null;
    }
    
    //insert new member with the hashed password
    const [newMember] = await db
    .insert(members)
    .values({
      ...input,
    })
    .returning();

    // Wrapper around undefined to make it consistent with previous error handling
    // TODO: make this error handling better (report more info to the api user)
    if (newMember === undefined) {
      console.error("createMember procedure returned undefined. This should not happen.");
      return null
    }

    return newMember;

  }),


  //get member


  //delete member - debugging


  //update member


  //get all members - debugging purposes

 
});