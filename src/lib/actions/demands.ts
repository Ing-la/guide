'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Demand } from '@/types/database'

export async function getDemands(search?: string, status?: string) {
  const supabase = await createClient()

  let query = supabase.from('demands').select('*').order('created_at', { ascending: false })

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

export async function getDemandById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('demands').select('*').eq('id', id).single()

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

  const { error } = await supabase.from('demands').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/demands')
  return { success: true }
}
