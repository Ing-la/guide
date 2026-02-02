// Supabase 配置 - 支持 Vercel 集成的前缀命名
// Vercel Supabase 集成会创建带项目前缀的环境变量
// 例如: NEXT_PUBLIC_guide_SUPABASE_URL

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_guide_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_guide_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
