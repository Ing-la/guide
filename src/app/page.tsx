import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // 获取用户角色并重定向到对应页面
    try {
      const { data: profile } = await supabase
        .from('guide_profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role || 'user'
      
      if (role === 'admin') {
        redirect('/dashboard')
      } else if (role === 'guide') {
        redirect('/dashboard/guide')
      } else {
        redirect('/dashboard/user')
      }
    } catch (error) {
      // 如果查询失败，默认重定向到 dashboard（由 layout 处理）
      redirect('/dashboard')
    }
  } else {
    redirect('/login')
  }
}
