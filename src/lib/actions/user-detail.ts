'use server'

import { updateUser, deleteUser } from './users'
import { redirect } from 'next/navigation'

export async function updateUserAction(id: string, formData: FormData) {
  const result = await updateUser(id, formData)
  if (result.success) {
    redirect('/dashboard/users')
  }
  return result
}

export async function deleteUserAction(id: string) {
  const result = await deleteUser(id)
  if (result.success) {
    redirect('/dashboard/users')
  }
  return result
}
