'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Complaint } from '@/types/database'

// 管理员获取所有投诉
export async function getAllComplaints() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guide_complaints')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Complaint[]
}

// 用户获取自己的投诉列表
export async function getUserComplaints() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未登录')
  }

  const { data, error } = await supabase
    .from('guide_complaints')
    .select(`
      *,
      guide:guide_guides (
        id,
        name,
        title
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as (Complaint & { guide: { id: string; name: string; title: string | null } | null })[]
}

// 导游获取投诉自己的投诉列表
export async function getGuideComplaints() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未登录')
  }

  // 先获取导游的 guide_guides 记录
  const { data: guideData, error: guideError } = await supabase
    .from('guide_guides')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (guideError || !guideData) {
    return []
  }

  const { data, error } = await supabase
    .from('guide_complaints')
    .select(`
      *,
      user:guide_profiles!guide_complaints_user_id_fkey (
        id,
        nickname,
        email
      )
    `)
    .eq('guide_id', guideData.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as (Complaint & {
    user: { id: string; nickname: string | null; email: string | null } | null
  })[]
}

// 用户创建投诉
export async function createComplaint(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '未登录' }
  }

  const guide_id = formData.get('guide_id') as string
  const content = formData.get('content') as string

  if (!guide_id) {
    return { success: false, error: '请选择导游' }
  }

  if (!content || content.trim().length < 10) {
    return { success: false, error: '投诉内容至少需要 10 个字符' }
  }

  const { error } = await supabase.from('guide_complaints').insert({
    user_id: user.id,
    guide_id: guide_id,
    content: content.trim(),
    status: 'pending',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/user/complaints')
  return { success: true }
}
