import { getUserComplaints, createComplaint } from '@/lib/actions/complaints'
import { getActiveGuides } from '@/lib/actions/guides'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Guide } from '@/types/database'

async function ComplaintsList() {
  try {
    const complaints = await getUserComplaints()

    if (complaints.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">您还没有提交任何投诉</p>
          <p className="mt-2 text-sm text-gray-400">点击下方按钮创建您的第一个投诉</p>
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
                    投诉导游：{complaint.guide?.name || '未知导游'}
                  </h3>
                  {complaint.guide?.title && (
                    <span className="text-sm text-gray-500">({complaint.guide.title})</span>
                  )}
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

async function CreateComplaintForm() {
  let guides: Guide[] = []
  try {
    guides = await getActiveGuides()
  } catch (error) {
    guides = []
  }

  async function createComplaintAction(formData: FormData) {
    'use server'
    const result = await createComplaint(formData)
    if (result.success) {
      redirect('/dashboard/user/complaints')
    } else {
      redirect(`/dashboard/user/complaints?error=${encodeURIComponent(result.error || '创建失败')}`)
    }
  }

  return (
    <form action={createComplaintAction} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-bold text-gray-800">创建新投诉</h2>
      <div>
        <label htmlFor="guide_id" className="block text-sm font-medium text-gray-700">
          选择导游 <span className="text-red-500">*</span>
        </label>
        <select
          id="guide_id"
          name="guide_id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">请选择导游</option>
          {guides.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.name} {guide.title ? `(${guide.title})` : ''}
            </option>
          ))}
        </select>
        {guides.length === 0 && (
          <p className="mt-1 text-xs text-gray-500">暂无可用导游</p>
        )}
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          投诉内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          required
          minLength={10}
          rows={6}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          placeholder="请详细描述您的投诉内容（至少 10 个字符）..."
        />
        <p className="mt-1 text-xs text-gray-500">投诉内容至少需要 10 个字符</p>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        提交投诉
      </button>
    </form>
  )
}

export default async function UserComplaintsPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const { error } = searchParams

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">我的投诉</h1>
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
        <CreateComplaintForm />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-800">我的投诉列表</h2>
        <Suspense fallback={<div className="text-center">加载中...</div>}>
          <ComplaintsList />
        </Suspense>
      </div>
    </div>
  )
}
