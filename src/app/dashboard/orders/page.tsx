import { getOrders } from '@/lib/actions/orders'
import Link from 'next/link'
import { Suspense } from 'react'

async function OrdersList({ search, status }: { search?: string; status?: string }) {
  const orders = await getOrders(search, status)

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              订单ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              金额
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
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                暂无数据
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  ¥{order.amount?.toLocaleString() || '0'}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'paid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status === 'pending'
                      ? '待支付'
                      : order.status === 'paid'
                        ? '已支付'
                        : order.status === 'completed'
                          ? '已完成'
                          : '已取消'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string }
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">订单管理</h1>
        <form method="get" className="flex gap-2">
          <select
            name="status"
            defaultValue={searchParams.status}
            className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">全部状态</option>
            <option value="pending">待支付</option>
            <option value="paid">已支付</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            筛选
          </button>
        </form>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <OrdersList search={searchParams.search} status={searchParams.status} />
      </Suspense>
    </div>
  )
}
