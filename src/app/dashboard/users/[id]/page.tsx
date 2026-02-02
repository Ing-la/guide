import { getUserById, updateUser, deleteUser } from '@/lib/actions/users'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id)

  async function updateUserAction(formData: FormData) {
    'use server'
    const result = await updateUser(params.id, formData)
    if (result.success) {
      redirect('/dashboard/users')
    }
  }

  async function deleteUserAction() {
    'use server'
    const result = await deleteUser(params.id)
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
