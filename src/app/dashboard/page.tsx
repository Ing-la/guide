import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    // 检查用户角色，如果不是管理员则重定向
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('guide_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role || 'user'

      // 如果不是管理员，重定向到对应的角色页面
      if (role !== 'admin') {
        if (role === 'guide') {
          redirect('/dashboard/guide')
        } else {
          redirect('/dashboard/user')
        }
      }
    }

    // 获取统计数据（仅管理员可见）
    const [usersCount, guidesCount, demandsCount, ordersCount] = await Promise.all([
      supabase.from('guide_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('guide_guides').select('id', { count: 'exact', head: true }),
      supabase.from('guide_demands').select('id', { count: 'exact', head: true }),
      supabase.from('guide_orders').select('id', { count: 'exact', head: true }),
    ])

  const stats = [
    { name: '用户总数', value: usersCount.count || 0, color: 'bg-blue-500' },
    { name: '导游总数', value: guidesCount.count || 0, color: 'bg-green-500' },
    { name: '需求总数', value: demandsCount.count || 0, color: 'bg-yellow-500' },
    { name: '订单总数', value: ordersCount.count || 0, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">仪表盘</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full ${stat.color} opacity-20`}></div>
            </div>
          </div>
        ))}
      </div>
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
