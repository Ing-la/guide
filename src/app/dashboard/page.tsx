import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 获取统计数据
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
}
