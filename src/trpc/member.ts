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

  //create member -> looks longer than it actually is
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


  //delete member - debugging


  // update member
  // Retrieves member to update by `ucf_id`, meaning that the ucf id by itself can't be changed
  updateMember: publicProcedure.input(
    z.object({
      ucf_id: z.number(),
      first_name: z.string().min(1).optional(),
      last_name: z.string().min(1).optional(),
      email: z.string().optional(),
      image: z.string().optional(),
      bio: z.string().optional(),
      resume: z.string().optional(),
      is_member: z.boolean().optional(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { ucf_id, ...updateData } = input;

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(fieldsToUpdate).length === 0) {
      return null;
    }

    const updatedMember = await ctx.db
      .update(members)
      .set(fieldsToUpdate)
      .where(eq(members.ucf_id, ucf_id))
      .returning();

    // Member not found
    if (updatedMember.length === 0) {
      return null;
    }

    return updatedMember[0];
  }),

  //get all members - debugging purposes

 
});