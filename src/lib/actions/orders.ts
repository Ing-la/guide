'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Order } from '@/types/database'

export async function getOrders(search?: string, status?: string) {
  const supabase = await createClient()

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data as Order[]
}

export async function getOrderById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from('orders').select('*').eq('id', id).single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Order
}

export async function updateOrder(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    amount: formData.get('amount') ? parseFloat(formData.get('amount') as string) : null,
    status: formData.get('status') as 'pending' | 'paid' | 'completed' | 'cancelled',
  }

  const { error } = await supabase.from('orders').update(data).eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}

export async function deleteOrder(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('orders').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/orders')
  return { success: true }
}
