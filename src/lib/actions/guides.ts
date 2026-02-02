'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Guide } from '@/types/database'

export async function getGuides(search?: string) {
  const supabase = await createClient()

  let query = supabase.from('guide_guides').select('*').order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,title.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as Guide[]
}

export async function getGuideById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('guide_guides').select('*').eq('id', id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Guide
}

export async function updateGuide(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    phone: formData.get('phone') || null,
    title: formData.get('title') || null,
    status: formData.get('status') as 'active' | 'inactive',
  }

  const { error } = await supabase.from('guide_guides').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/guides')
  return { success: true }
}

export async function deleteGuide(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('guide_guides').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/guides')
  return { success: true }
}
