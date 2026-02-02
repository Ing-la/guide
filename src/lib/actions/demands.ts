'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Demand } from '@/types/database'

// 获取所有需求（管理员和导游使用）
export async function getDemands(search?: string, status?: string) {
  const supabase = await createClient()

  let query = supabase.from('guide_demands').select('*').order('created_at', { ascending: false })

  if (search) {
    query = query.or(`city.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as Demand[]
}

// 用户获取自己的需求列表
export async function getUserDemands() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('未登录')
  }

  const { data, error } = await supabase
    .from('guide_demands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Demand[]
}

// 用户创建需求
export async function createDemand(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '未登录' }
  }

  const city = formData.get('city') as string
  const attractions = formData.get('attractions') as string
  const budget = formData.get('budget') as string
  const plan_time = formData.get('plan_time') as string
  const description = formData.get('description') as string

  if (!city || city.trim() === '') {
    return { success: false, error: '城市为必填项' }
  }

  const data: any = {
    user_id: user.id,
    city: city.trim(),
    attractions: attractions ? attractions.split(',').map((a) => a.trim()).filter(Boolean) : null,
    budget: budget ? parseFloat(budget) : null,
    plan_time: plan_time || null,
    description: description || null,
    status: 'pending',
  }

  // 验证预算
  if (data.budget !== null && (isNaN(data.budget) || data.budget <= 0)) {
    return { success: false, error: '预算必须是正数' }
  }

  // 验证计划时间
  if (data.plan_time) {
    const planDate = new Date(data.plan_time)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (planDate < today) {
      return { success: false, error: '计划时间不能早于今天' }
    }
  }

  const { error } = await supabase.from('guide_demands').insert(data)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/user/demands')
  return { success: true }
}

export async function getDemandById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('guide_demands').select('*').eq('id', id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Demand
}

export async function updateDemand(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    city: formData.get('city') || null,
    attractions: formData.get('attractions')?.toString().split(',').filter(Boolean) || null,
    budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : null,
    plan_time: formData.get('plan_time') || null,
    description: formData.get('description') || null,
    status: formData.get('status') as 'pending' | 'matched' | 'completed' | 'cancelled',
  }

  const { error } = await supabase.from('demands').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/demands')
  return { success: true }
}

export async function deleteDemand(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('guide_demands').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/demands')
  return { success: true }
}
