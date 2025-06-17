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
import bcrypt from "bcryptjs";   //encrypting of password
import { idText } from "typescript";

export const memberRouter = createTRPCRouter({

  //create member ->looks longer than it actually is
  createMember: publicProcedure
  .input(
    z.object({
      ucf_id: z.number(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const existingMember = await db
    .select()
    .from(members)
    .where(eq(members.email, input.email));

    if (existingMember.length > 0) {
      throw new Error("Error: Account already exists.");
    }

    const hashedPassword = await bcrypt.hash(input.password.slice(0, 50), 10); //must hash password once a new member is created
    
    //insert new member with the hashed password
    const newMember = await db
    .insert(members)
    .values({
      ...input,
      password: hashedPassword, //only thing that changes is hashed password
    })
    .returning();

    return newMember[0];
  }),


  //get member
  getMember: publicProcedure
  .input(z.object({ucf_id : z.number()}))
  .query(async ({input}) => {
    const member = await db
      .select()
      .from(members)
      .where(eq(members.ucf_id, input.ucf_id));

      if (member.length == 0){
        throw new Error("No member found!");
      }
      return member[0];
  }),

  //delete member - debugging
  deleteMember: publicProcedure
  .input(z.object({id: z.number()}))
  .mutation(async ({input}) => {
    const delteMem = await db
      .select()
      .from(members)
      .where(eq(members.id, input.id));
    
    if (delteMem.length == 0){
      throw new Error("No member with that Id");
    }


    await db.delete(members).where(eq(members.id, input.id));


    return delteMem[0];
  }),



  //update member


  //get all members - debugging purposes
});

