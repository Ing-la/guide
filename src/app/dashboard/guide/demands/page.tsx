import { getDemands } from '@/lib/actions/demands'
import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function DemandsList() {
  try {
    const demands = await getDemands()

    if (demands.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">暂无需求</p>
          <p className="mt-2 text-sm text-gray-400">用户发布的需求将显示在这里</p>
        </div>
      )
    }

    // 获取用户信息以显示发布者昵称
    const supabase = await createClient()
    const userIds = [...new Set(demands.map((d) => d.user_id).filter(Boolean) as string[])]
    const { data: profiles } = await supabase
      .from('guide_profiles')
      .select('id, nickname')
      .in('id', userIds)

    const profileMap = new Map(profiles?.map((p) => [p.id, p.nickname]) || [])

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
                {demand.user_id && (
                  <p className="text-sm text-gray-500 mb-2">
                    发布者：{profileMap.get(demand.user_id) || '未知用户'}
                  </p>
                )}
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

export default async function GuideDemandsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">需求浏览</h1>
        <Link href="/dashboard/guide" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回导游中心
        </Link>
      </div>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          这里显示所有用户发布的需求，您可以浏览了解用户需求。
        </p>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <DemandsList />
      </Suspense>
    </div>
  )
}
