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
  const role = (formData.get('role') as 'user' | 'guide') || 'user'

  if (!email || !password) {
    redirect(`/register?error=${encodeURIComponent('邮箱和密码为必填项')}`)
    return
  }

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

  if (!signUpData.user) {
    redirect(`/register?error=${encodeURIComponent('注册失败，请重试')}`)
    return
  }

  try {
    const { error: profileError } = await supabase.from('guide_profiles').insert({
      id: signUpData.user.id,
      email: email,
      phone: phone || null,
      nickname: nickname || email.split('@')[0],
      role: role,
    })
    
    if (profileError) {
      console.error('Failed to create profile:', profileError)
      redirect(`/register?error=${encodeURIComponent(`注册成功，但创建用户资料失败: ${profileError.message}`)}`)
      return
    }
  } catch (profileError: any) {
    console.error('Failed to create profile:', profileError)
    redirect(`/register?error=${encodeURIComponent(`注册成功，但创建用户资料失败: ${profileError?.message || '未知错误'}`)}`)
    return
  }

  revalidatePath('/', 'layout')
  
  // 根据角色重定向
  if (role === 'admin') {
    redirect('/dashboard')
  } else if (role === 'guide') {
    redirect('/dashboard/guide')
  } else {
    redirect('/dashboard/user')
  }
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
    const { data: profile, error: profileError } = await supabase
      .from('guide_profiles')
      .select('id')
      .eq('id', signInData.user.id)
      .single()

    if (!profile && profileError?.code === 'PGRST116') {
      try {
        const { error: insertError } = await supabase.from('guide_profiles').insert({
          id: signInData.user.id,
          email: email,
          nickname: email.split('@')[0],
          role: 'user',
        })
        
        if (insertError) {
          console.error('Failed to create profile:', insertError)
          redirect(`/login?error=${encodeURIComponent('登录成功，但用户资料异常，请联系管理员')}`)
          return
        }
      } catch (insertError) {
        console.error('Failed to create profile:', insertError)
        redirect(`/login?error=${encodeURIComponent('登录成功，但用户资料异常，请联系管理员')}`)
        return
      }
    }
    
    // 获取用户角色并重定向
    const { data: userProfile } = await supabase
      .from('guide_profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single()
    
    const userRole = userProfile?.role || 'user'
    
    revalidatePath('/', 'layout')
    
    if (userRole === 'admin') {
      redirect('/dashboard')
    } else if (userRole === 'guide') {
      redirect('/dashboard/guide')
    } else {
      redirect('/dashboard/user')
    }
    return
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard/user')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
