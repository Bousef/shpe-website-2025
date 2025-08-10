'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '~/server/auth/server'

export async function login(prevState: unknown, formData: FormData): Promise<{error: string, formData?: {email?: string}}> {
  const supabase = await createClient();

  if (!supabase) {
    return {
      error: 'Supabase client is not initialized.',
      formData: {
        email: formData.get('email') as string
      }
    };
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
    return {
      error: error.message,
      formData: {
        email: formData.get('email') as string
      }
    };
  }

  revalidatePath('/', 'layout');
  redirect('/?refetchUser=1');
}