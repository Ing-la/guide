import { getOrderById, updateOrder, deleteOrder } from '@/lib/actions/orders'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  let order
  try {
    order = await getOrderById(params.id)
  } catch (error) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">订单详情</h1>
          <Link href="/dashboard/orders" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回列表
          </Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-800">加载失败</h3>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error ? error.message : '未知错误'}
          </p>
        </div>
      </div>
    )
  }

  async function updateOrderAction(formData: FormData) {
    'use server'
    const result = await updateOrder(params.id, formData)
    if (result.success) {
      redirect('/dashboard/orders')
    }
  }

  async function deleteOrderAction() {
    'use server'
    const result = await deleteOrder(params.id)
    if (result.success) {
      redirect('/dashboard/orders')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">订单详情</h1>
        <Link href="/dashboard/orders" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回列表
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <form action={updateOrderAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">订单ID</label>
              <div className="mt-1 text-sm text-gray-500">{order.id}</div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                金额
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                defaultValue={order.amount || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="pending">待支付</option>
                <option value="paid">已支付</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">创建时间</label>
              <div className="mt-1 text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString('zh-CN')}
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
            <form action={deleteOrderAction}>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={(e) => {
                  if (!confirm('确定要删除这个订单吗？此操作不可恢复。')) {
                    e.preventDefault()
                  }
                }}
              >
                删除订单
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
