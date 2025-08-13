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
    NEXT_PUBLIC_SQUARE_APPLICATION_ID: z.string(),
    NEXT_PUBLIC_SHPE_MEMBERSHIP_ITEM_ID: z.string(),
    NEXT_PUBLIC_SQUARE_LOCATION_ID: z.string(),
  },

  /**
   * Manually assign env vars to avoid destructuring issues in some runtimes.
   */
  runtimeEnv: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SQUARE_APPLICATION_ID:
      process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    NEXT_PUBLIC_SQUARE_LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
    NEXT_PUBLIC_SHPE_MEMBERSHIP_ITEM_ID:
      process.env.NEXT_PUBLIC_SHPE_MEMBERSHIP_ITEM_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
