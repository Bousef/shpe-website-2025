import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   */
  server: {
    SUPABASE_URL:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    SUPABASE_ANON_KEY:
      process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
    NEXT_PUBLIC_SUPABASE_MOBILE_URL:
      process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
    NEXT_PUBLIC_SUPABASE_MOBILE_ANON_KEY:
      process.env.NODE_ENV === "production"
      ? z.string()
      : z.string().optional(),
  },

  /**
   * Manually assign env vars to avoid destructuring issues in some runtimes.
   */
  runtimeEnv: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_MOBILE_URL: process.env.NEXT_PUBLIC_SUPABASE_MOBILE_URL,
    NEXT_PUBLIC_SUPABASE_MOBILE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_MOBILE_ANON_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
