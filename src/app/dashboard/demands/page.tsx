import { getDemands } from '@/lib/actions/demands'
import Link from 'next/link'
import { Suspense } from 'react'

async function DemandsList({ search, status }: { search?: string; status?: string }) {
  try {
    const demands = await getDemands(search, status)

    return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              城市
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              景点
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              预算
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              状态
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
          {demands.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                暂无数据
              </td>
            </tr>
          ) : (
            demands.map((demand) => (
              <tr key={demand.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {demand.city || '未设置'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {demand.attractions?.join(', ') || '未设置'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  ¥{demand.budget?.toLocaleString() || '0'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      demand.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : demand.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : demand.status === 'matched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {demand.status === 'pending'
                      ? '待匹配'
                      : demand.status === 'matched'
                        ? '已匹配'
                        : demand.status === 'completed'
                          ? '已完成'
                          : '已取消'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(demand.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/demands/${demand.id}`}
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
  } catch (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="text-lg font-semibold text-red-800">加载失败</h3>
        <p className="mt-2 text-sm text-red-600">
          {error instanceof Error ? error.message : '未知错误'}
        </p>
        <p className="mt-4 text-xs text-red-500">
          请检查数据库连接和 RLS 策略配置
        </p>
      </div>
    )
  }
}

export default async function DemandsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">需求管理</h1>
        <form method="get" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="搜索需求..."
            className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={searchParams.status}
            className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="pending">待匹配</option>
            <option value="matched">已匹配</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            搜索
          </button>
        </form>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <DemandsList search={searchParams.search} status={searchParams.status} />
      </Suspense>
    </div>
  )
}
