import { getUsers } from '@/lib/actions/users'
import Link from 'next/link'
import { Suspense } from 'react'

async function UsersList({ search }: { search?: string }) {
  const users = await getUsers(search)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              昵称
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              邮箱
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              手机号
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              角色
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              创建时间
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                暂无数据
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {user.nickname || '未设置'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.phone || '未设置'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'guide'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role === 'admin' ? '管理员' : user.role === 'guide' ? '导游' : '用户'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/users/${user.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    查看/编辑
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
        <form method="get" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="搜索用户..."
            className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            搜索
          </button>
        </form>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <UsersList search={searchParams.search} />
      </Suspense>
    </div>
  )
}
