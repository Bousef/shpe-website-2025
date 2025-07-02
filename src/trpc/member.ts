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
  getMember: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const member = await db.select().from(members).where(eq(members.id, input.id));

      if (member.length === 0) throw new Error("Error: Member Not Found");

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

  // get all members - debugging purposes
  getAllMembers: publicProcedure.query(async ({ ctx }) => {
    const allMembers = await ctx.db
      .select()
      .from(members);

    return allMembers;
  }),
});