import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// For server-side use only (tRPC routers, server actions)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!  // ← no NEXT_PUBLIC_ prefix
);