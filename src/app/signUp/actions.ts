'use server'

import { error } from 'console';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '~/server/auth/server'


export async function signup(prevState: unknown, formData: FormData): Promise<{error?: string}> {
  const supabase = await createClient();

  if (!supabase) {
    return {error: 'Supabase client is not initialized.'};
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data2 = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  


  const { error, data} = await supabase.auth.signUp(data2)

  if((data.user?.identities?.length === 0 || !data.user?.identities) && data.user?.app_metadata.provider === 'email'){
    console.error('Signup error: E-mailaddress already in use');
    return {error: 'email already exists.'};
  }

  if (data.user?.identities?.length === 0 || !data.user?.identities) {
    console.error('Signup error: User already exists.');
    return {error: 'User already exists.'};
  }



  if (error) {
    console.error('Signup error:', error);
    return {error: error.message};
  }


  revalidatePath('/', 'layout');
  redirect('/');
}