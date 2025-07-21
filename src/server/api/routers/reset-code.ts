import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reset_codes } from "~/server/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomInt } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const resetCodeRouter = createTRPCRouter({

    // create or update a reset code
    generateCode: publicProcedure
        .input(z.object({
            email: z.string().email(),
        }))
        .mutation(async ({ input, ctx }) => {
            const code = randomInt(100000, 1000000).toString(); // securely generate 6-digit code
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

            await ctx.db
                .insert(reset_codes)
                .values({
                    email: input.email,
                    code,
                    expires_at: expiresAt,
                })
                .onConflictDoUpdate({
                    target: reset_codes.email,
                    set: {
                        code,
                        expires_at: expiresAt,
                        used: false,
                        created_at: new Date(),
                    },
            });
        
            // send the email with the code
            try {
                await resend.emails.send({
                    from: "Acme <onboarding@resend.dev>",
                    to: [input.email],
                    subject: "Your Password Reset Code",
                    html: `
                        <h2>Password Reset</h2>
                        <p>Your password reset code is: <strong>${code}</strong></p>
                        <p>This code will expire in 10 minutes.</p>
                    `,
                });
            } catch (error) {
                console.error("Failed to send verification email:", error);
                throw new Error("Failed to send verification code. Please try again.");
            }

            return { success: true };
        }),

    // verify if reset code's correct and unexpired
    verifyCode: publicProcedure
        .input(z.object({
            email: z.string().email(),
            code: z.string().length(6),
        }))
        .mutation(async ({ input, ctx }) => {
            const now = new Date();

            const result = await ctx.db
                .select()
                .from(reset_codes)
                .where(
                    and(
                        eq(reset_codes.email, input.email),
                        eq(reset_codes.code, input.code),
                        eq(reset_codes.used, false),
                        gt(reset_codes.expires_at, now)
                    )
                );

            if (result.length === 0) {
                throw new Error("Invalid or expired verification code.");
            }

            return { verified: true };
        }),

    // mark code as used
    markUsed: publicProcedure
        .input(z.object({
            email: z.string().email(),
        }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db
                .update(reset_codes)
                .set({ used: true })
                .where(eq(reset_codes.email, input.email));

            return { success: true };
        }),
});
