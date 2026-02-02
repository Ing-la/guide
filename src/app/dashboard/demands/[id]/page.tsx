import { getDemandById, updateDemand, deleteDemand } from '@/lib/actions/demands'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let demand
  try {
    demand = await getDemandById(id)
  } catch (error) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">需求详情</h1>
          <Link href="/dashboard/demands" className="text-sm text-gray-600 hover:text-gray-900">
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

  async function updateDemandAction(formData: FormData) {
    'use server'
    const result = await updateDemand(id, formData)
    if (result.success) {
      redirect('/dashboard/demands')
    }
  }

  async function deleteDemandAction() {
    'use server'
    const result = await deleteDemand(id)
    if (result.success) {
      redirect('/dashboard/demands')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">需求详情</h1>
        <Link href="/dashboard/demands" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回列表
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <form action={updateDemandAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                城市
              </label>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={demand.city || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="attractions" className="block text-sm font-medium text-gray-700">
                景点（用逗号分隔）
              </label>
              <input
                type="text"
                id="attractions"
                name="attractions"
                defaultValue={demand.attractions?.join(', ') || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                预算
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                defaultValue={demand.budget || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="plan_time" className="block text-sm font-medium text-gray-700">
                计划时间
              </label>
              <input
                type="datetime-local"
                id="plan_time"
                name="plan_time"
                defaultValue={
                  demand.plan_time
                    ? new Date(demand.plan_time).toISOString().slice(0, 16)
                    : ''
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                描述
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={demand.description || ''}
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
                defaultValue={demand.status}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="pending">待匹配</option>
                <option value="matched">已匹配</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 border-t pt-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              保存修改
            </button>
            <form action={deleteDemandAction}>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={(e) => {
                  if (!confirm('确定要删除这个需求吗？此操作不可恢复。')) {
                    e.preventDefault()
                  }
                }}
              >
                删除需求
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
