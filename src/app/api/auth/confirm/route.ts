import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from 'src/server/auth/server'
import { redirect } from 'next/navigation'
import { error } from 'console';

export async function GET(request: NextRequest) {
  console.log("test");
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
    console.log(error);
    console.log(type);
    console.log(token_hash);
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}