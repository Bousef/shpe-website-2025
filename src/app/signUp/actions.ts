'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '~/server/auth/server'
import { api } from '~/trpc/server';


export async function signup(prevState: unknown, formData: FormData): Promise<{errors: string[], formData?: {first_name?: string, last_name?: string, email?: string, ucf_id?: string}}> {
  const supabase = await createClient();

  console.log("here")

  if (!supabase) {
    return {
      errors: ['Supabase client is not initialized.'],
      formData: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        ucf_id: formData.get('ucf_id') as string,
      }
    };
  }

  const email = formData.get('email') as string;
  const ucfId = formData.get('ucf_id') as string;
  const password = formData.get('password') as string;

  const inputErrors = [];

  if (!/^[\w.-]+@(ucf\.edu|shpeucf\.com)$/.test(email)) {
      inputErrors.push("Email must be a valid @ucf.edu or @shpeucf.com address.");
  }
  
  if (!/^\d{7}$/.test(ucfId)) {
    inputErrors.push("UCF ID must be exactly 7 digits.");
  }

  if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
    inputErrors.push("Password must be 8+ characters, 1 capital letter, 1 number.");
  }

  if (inputErrors.length > 0) {
    console.error('Signup input errors:', inputErrors);
    return {
      errors: inputErrors,
      formData: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        ucf_id: formData.get('ucf_id') as string,
      }
    };
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const signUpData = {
    email,
    password,
  }

  const {error, data} = await supabase.auth.signUp(signUpData)

  const uuid = data.user?.id;

  if((data.user?.identities?.length === 0 || !data.user?.identities) && data.user?.app_metadata.provider === 'email'){
    console.error('Signup error: E-mailaddress already in use');
    return {
      errors: ['Email address already in use.'],
      formData: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        ucf_id: formData.get('ucf_id') as string,
      }
    };
  }

  if (data.user?.identities?.length === 0 || !data.user?.identities) {
    console.error('Signup error: User already exists.');
    return {
      errors: ['User already exists.'],
      formData: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        ucf_id: formData.get('ucf_id') as string,
      }
    };
  }

  if (error) {
    console.error('Signup error:', error);
    return {
      errors: [error.message],
      formData: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        ucf_id: formData.get('ucf_id') as string,
      }
    };
  }

  console.log('Signup successful:', data);

  await api.member.createMember({
                uuid: uuid!,
                ucf_id: +formData.get('ucf_id')!,
                first_name: formData.get('first_name')! as string,
                last_name: formData.get('last_name')! as string,
                email: formData.get('email')! as string,
              })

  revalidatePath('/', 'layout');
  redirect('/');
}