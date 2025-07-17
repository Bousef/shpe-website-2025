// src/server/api/routers/sendEmail.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import nodemailer from "nodemailer";

export const sendEmailRouter = createTRPCRouter({
    send: publicProcedure
        .input(z.object({ email: z.string().email(), code: z.string() }))
        .mutation(async ({ input }) => {
            const { email, code } = input;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your Password Reset Code",
                text: `Your password reset code is: ${code}`,
                html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
            };

            try {
                await transporter.sendMail(mailOptions);
                return { success: true };
            } catch (error) {
                console.error("Failed to send email:", error);
                throw new Error("Failed to send email");
            }
        }),
});
