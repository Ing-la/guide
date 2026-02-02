import { getGuideComplaints } from '@/lib/actions/complaints'
import { Suspense } from 'react'
import Link from 'next/link'

async function ComplaintsList() {
  try {
    const complaints = await getGuideComplaints()

    if (complaints.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">暂无投诉</p>
          <p className="mt-2 text-sm text-gray-400">针对您的投诉将显示在这里</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    投诉用户：{complaint.user?.nickname || complaint.user?.email || '未知用户'}
                  </h3>
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {complaint.status === 'resolved' ? '已处理' : '待处理'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{complaint.content}</p>
              </div>
              <div className="text-xs text-gray-400 ml-4">
                {new Date(complaint.created_at).toLocaleDateString('zh-CN')}
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

export default async function GuideComplaintsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">投诉查看</h1>
        <Link href="/dashboard/guide" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回导游中心
        </Link>
      </div>

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          这里显示所有针对您的投诉，您可以查看投诉内容。
        </p>
      </div>

      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <ComplaintsList />
      </Suspense>
    </div>
  )
}
