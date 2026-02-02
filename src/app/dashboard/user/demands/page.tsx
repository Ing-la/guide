import { getUserDemands, createDemand } from '@/lib/actions/demands'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

async function DemandsList() {
  try {
    const demands = await getUserDemands()

    if (demands.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">您还没有发布任何需求</p>
          <p className="mt-2 text-sm text-gray-400">点击下方按钮创建您的第一个需求</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {demands.map((demand) => (
          <div
            key={demand.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{demand.city || '未指定城市'}</h3>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      demand.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : demand.status === 'matched'
                          ? 'bg-blue-100 text-blue-800'
                          : demand.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
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
                </div>
                {demand.attractions && demand.attractions.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2">
                    景点：{demand.attractions.join('、')}
                  </p>
                )}
                {demand.budget && (
                  <p className="text-sm text-gray-600 mb-2">预算：¥{demand.budget.toLocaleString()}</p>
                )}
                {demand.plan_time && (
                  <p className="text-sm text-gray-600 mb-2">
                    计划时间：{new Date(demand.plan_time).toLocaleString('zh-CN')}
                  </p>
                )}
                {demand.description && (
                  <p className="text-sm text-gray-500 mt-2">{demand.description}</p>
                )}
              </div>
              <div className="text-xs text-gray-400 ml-4">
                {new Date(demand.created_at).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="text-lg font-semibold text-red-800">加载失败</h3>
        <p className="mt-2 text-sm text-red-600">
          {error instanceof Error ? error.message : '未知错误'}
        </p>
      </div>
    )
  }
}

async function CreateDemandForm() {
  async function createDemandAction(formData: FormData) {
    'use server'
    const result = await createDemand(formData)
    if (result.success) {
      redirect('/dashboard/user/demands')
    } else {
      redirect(`/dashboard/user/demands?error=${encodeURIComponent(result.error || '创建失败')}`)
    }
  }

  return (
    <form action={createDemandAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-bold text-gray-800">创建新需求</h2>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          城市 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="city"
          name="city"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="例如：北京"
        />
      </div>
      <div>
        <label htmlFor="attractions" className="block text-sm font-medium text-gray-700">
          景点
        </label>
        <input
          type="text"
          id="attractions"
          name="attractions"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="多个景点用逗号分隔，例如：天安门,故宫,天坛"
        />
      </div>
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          预算（元）
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="例如：5000"
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
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          描述
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="请描述您的需求..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        创建需求
      </button>
    </form>
  )
}

export default async function UserDemandsPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const { error } = searchParams

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">我的需求</h1>
        <Link href="/dashboard/user" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回用户中心
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{decodeURIComponent(error)}</p>
        </div>
      )}

      <div className="mb-8">
        <CreateDemandForm />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">我的需求列表</h2>
        <Suspense fallback={<div className="text-center">加载中...</div>}>
          <DemandsList />
        </Suspense>
      </div>
    </div>
  )
}
