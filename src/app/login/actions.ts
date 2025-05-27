'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '~/server/auth/server'

export async function login(prevState: unknown, formData: FormData): Promise<{error: string}> {
  const supabase = await createClient();

  if (!supabase) {
    return {error: 'Supabase client is not initialized.'};
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login error:', error);
    return {error: error.message};
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(prevState: unknown, formData: FormData): Promise<{error: string}> {
  const supabase = await createClient();

  if (!supabase) {
    return {error: 'Supabase client is not initialized.'};
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error);
    return {error: error.message};
  }

  revalidatePath('/', 'layout');
  redirect('/');
}