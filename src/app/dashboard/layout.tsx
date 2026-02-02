import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  let { data: profile } = await supabase
    .from('guide_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    try {
      const { data: newProfile } = await supabase
        .from('guide_profiles')
        .insert({
          id: user.id,
          email: user.email || null,
          nickname: user.email?.split('@')[0] || 'User',
          role: 'user',
        })
        .select()
        .single()
      profile = newProfile
    } catch (error) {
      console.error('Failed to create profile:', error)
    }
  }

  // 根据角色显示不同的导航
  const isAdmin = profile?.role === 'admin'
  const isGuide = profile?.role === 'guide'
  const isUser = profile?.role === 'user'

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-gray-800">
            {isAdmin ? '导游管理后台' : isGuide ? '导游中心' : '用户中心'}
          </h1>
        </div>
        <nav className="mt-6 space-y-1 px-3">
          {isAdmin && (
            <>
              <Link
                href="/dashboard"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                仪表盘
              </Link>
              <Link
                href="/dashboard/users"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                用户管理
              </Link>
              <Link
                href="/dashboard/guides"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                导游管理
              </Link>
              <Link
                href="/dashboard/demands"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                需求管理
              </Link>
              <Link
                href="/dashboard/orders"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                订单管理
              </Link>
              <Link
                href="/dashboard/complaints"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                投诉查看
              </Link>
            </>
          )}
          {isGuide && (
            <>
              <Link
                href="/dashboard/guide"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                我的中心
              </Link>
            </>
          )}
          {isUser && (
            <>
              <Link
                href="/dashboard/user"
                className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                我的中心
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              欢迎，{profile?.nickname || user.email}
            </span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              退出登录
            </button>
          </form>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
