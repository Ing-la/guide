'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Profile } from '@/types/database'

export async function getUsers(search?: string) {
  const supabase = await createClient()

  let query = supabase.from('guide_profiles').select('*').order('created_at', { ascending: false })

  if (search) {
    query = query.or(`nickname.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  // 如果 email 字段为空，尝试从 auth.users 获取（需要管理员权限）
  // 注意：由于 RLS 限制，这里可能无法访问 auth.users
  // 更好的方法是通过数据库触发器自动同步 email
  return (data || []).map((profile) => ({
    ...profile,
    email: profile.email || null,
  })) as Profile[]
}

export async function getUserById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('guide_profiles').select('*').eq('id', id).single()

  if (error) {
    console.error('getUserById error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    throw new Error(`无法获取用户信息: ${error.message} (代码: ${error.code || 'N/A'})`)
  }

  if (!data) {
    throw new Error('用户不存在')
  }

  return data as Profile
}

export async function updateUser(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    phone: formData.get('phone') || null,
    nickname: formData.get('nickname') || null,
    role: formData.get('role') as 'admin' | 'user' | 'guide',
  }

  const { error } = await supabase.from('guide_profiles').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = await createClient()

  // 先删除 profile（会级联删除相关数据）
  const { error } = await supabase.from('guide_profiles').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // 注意：删除 auth.users 需要管理员权限，这里只删除 profile
  // 如果需要完全删除用户，需要在 Supabase Dashboard 中操作
  // 或者使用 service role key 调用 admin API

  revalidatePath('/dashboard/users')
  return { success: true }
}
