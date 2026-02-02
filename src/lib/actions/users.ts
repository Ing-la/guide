'use server'

import { createClient } from '@/lib/supabase/server'
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
