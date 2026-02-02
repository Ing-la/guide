'use server'

import { updateUser, deleteUser } from './users'
import { redirect } from 'next/navigation'

export async function updateUserAction(id: string, formData: FormData) {
  const result = await updateUser(id, formData)
  if (result.success) {
    redirect('/dashboard/users')
  } else {
    // 如果失败，重定向到详情页并显示错误
    redirect(`/dashboard/users/${id}?error=${encodeURIComponent(result.error || '更新失败')}`)
  }
}

export async function deleteUserAction(id: string) {
  const result = await deleteUser(id)
  if (result.success) {
    redirect('/dashboard/users')
  } else {
    // 如果失败，重定向到详情页并显示错误
    redirect(`/dashboard/users/${id}?error=${encodeURIComponent(result.error || '删除失败')}`)
  }
}
