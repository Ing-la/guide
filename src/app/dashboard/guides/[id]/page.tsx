import { getGuideById, updateGuide, deleteGuide } from '@/lib/actions/guides'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function GuideDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  let guide
  try {
    guide = await getGuideById(id)
  } catch (error) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">导游详情</h1>
          <Link href="/dashboard/guides" className="text-sm text-gray-600 hover:text-gray-900">
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

  async function updateGuideAction(formData: FormData) {
    'use server'
    const result = await updateGuide(id, formData)
    if (result.success) {
      redirect('/dashboard/guides')
    }
  }

  async function deleteGuideAction() {
    'use server'
    const result = await deleteGuide(id)
    if (result.success) {
      redirect('/dashboard/guides')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">导游详情</h1>
        <Link href="/dashboard/guides" className="text-sm text-gray-600 hover:text-gray-900">
          ← 返回列表
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
        <form action={updateGuideAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={guide.name}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                手机号
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={guide.phone || ''}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                头衔
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={guide.title || ''}
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
                defaultValue={guide.status}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">评分</label>
              <div className="mt-1 text-sm text-gray-500">{guide.rating?.toFixed(1) || '0.0'}</div>
            </div>
          </div>

          <div className="flex gap-4 border-t pt-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              保存修改
            </button>
            <form action={deleteGuideAction}>
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={(e) => {
                  if (!confirm('确定要删除这个导游吗？此操作不可恢复。')) {
                    e.preventDefault()
                  }
                }}
              >
                删除导游
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  )
}
