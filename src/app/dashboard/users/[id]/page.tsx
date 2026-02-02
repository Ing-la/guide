import { getUserById, updateUser, deleteUser } from '@/lib/actions/users'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // 检查是否是管理员
  const supabase = await createClient()
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  
  if (!currentUser) {
    redirect('/login')
  }
  
  let currentProfile
  try {
    const { data, error } = await supabase
      .from('guide_profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()
    
    if (error) {
      console.error('Failed to fetch current profile:', error)
      return (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-800">错误</h1>
            <p className="text-gray-600">无法获取用户信息，请检查数据库连接</p>
            <p className="mt-2 text-sm text-gray-500">{error.message}</p>
          </div>
        </div>
      )
    }
    
    currentProfile = data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">错误</h1>
          <p className="text-gray-600">检查权限时发生错误</p>
        </div>
      </div>
    )
  }
  
  if (currentProfile?.role !== 'admin') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">访问受限</h1>
          <p className="text-gray-600">此功能仅限管理员使用</p>
        </div>
      </div>
    )
  }
  
  let user
  try {
    user = await getUserById(id)
  } catch (error) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">用户详情</h1>
          <Link href="/dashboard/users" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回列表
          </Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-800">加载失败</h3>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error ? error.message : '未知错误'}
          </p>
          <p className="mt-4 text-xs text-red-500">
            请检查数据库连接和 RLS 策略配置
          </p>
        </div>
      </div>
    )
  }

  async function updateUserAction(formData: FormData) {
    'use server'
    const result = await updateUser(id, formData)
    if (result.success) {
      redirect('/dashboard/users')
    }
  }

  async function deleteUserAction() {
    'use server'
    const result = await deleteUser(id)
    if (result.success) {
      redirect('/dashboard/users')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">用户详情</h1>
        <Link
          href="/dashboard/users"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 返回列表
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <form action={updateUserAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                昵称
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                defaultValue={user.nickname || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <div className="mt-1 text-sm text-gray-500">
                {user.email || '未设置'}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                手机号
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={user.phone || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                角色
              </label>
              <select
                id="role"
                name="role"
                defaultValue={user.role}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="user">用户</option>
                <option value="guide">导游</option>
                <option value="admin">管理员</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">用户ID</label>
              <div className="mt-1 text-sm text-gray-500">{user.id}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">创建时间</label>
              <div className="mt-1 text-sm text-gray-500">
                {new Date(user.created_at).toLocaleString('zh-CN')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">更新时间</label>
              <div className="mt-1 text-sm text-gray-500">
                {new Date(user.updated_at).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t pt-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              保存修改
            </button>
            <form action={deleteUserAction}>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={(e) => {
                  if (!confirm('确定要删除这个用户吗？此操作不可恢复。')) {
                    e.preventDefault()
                  }
                }}
              >
                删除用户
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
