'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const phone = formData.get('phone') as string
  const nickname = formData.get('nickname') as string

  const data = {
    email,
    password,
    options: {
      data: {
        phone: phone || null,
        nickname: nickname || email.split('@')[0],
        project: 'guide',
      },
    },
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
    return
  }

  if (signUpData.user) {
    try {
      await supabase.from('guide_profiles').insert({
        id: signUpData.user.id,
        phone: phone || null,
        nickname: nickname || email.split('@')[0],
        role: 'user',
      })
    } catch (profileError) {
      console.error('Failed to create profile:', profileError)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
    return
  }

  if (signInData.user) {
    const { data: profile } = await supabase
      .from('guide_profiles')
      .select('id')
      .eq('id', signInData.user.id)
      .single()

    if (!profile) {
      try {
        await supabase.from('guide_profiles').insert({
          id: signInData.user.id,
          nickname: email.split('@')[0],
          role: 'user',
        })
      } catch (profileError) {
        console.error('Failed to create profile:', profileError)
      }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
