import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Mobile client
export const supabaseMobile = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_MOBILE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_MOBILE_ANON_KEY!,
);