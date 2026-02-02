import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import type { Complaint } from '@/types/database'

async function ComplaintsList() {
  try {
    const supabase = await createClient()

    const { data: complaints, error } = await supabase
      .from('guide_complaints')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="text-lg font-semibold text-red-800">加载失败</h3>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
          <p className="mt-4 text-xs text-red-500">
            请检查数据库连接和 RLS 策略配置
          </p>
        </div>
      )
    }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              类型
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              内容
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              状态
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              创建时间
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {!complaints || complaints.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                暂无投诉
              </td>
            </tr>
          ) : (
            complaints.map((complaint: Complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      complaint.type === 'order'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {complaint.type === 'order' ? '订单投诉' : '聊天投诉'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {complaint.content.length > 50
                    ? `${complaint.content.slice(0, 50)}...`
                    : complaint.content}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {complaint.status === 'resolved' ? '已处理' : '待处理'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(complaint.created_at).toLocaleString('zh-CN')}
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

export default function ComplaintsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">投诉查看</h1>
        <p className="mt-2 text-sm text-gray-600">查看所有订单投诉和聊天记录投诉</p>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <ComplaintsList />
      </Suspense>
    </div>
  )
}
