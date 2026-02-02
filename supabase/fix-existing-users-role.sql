-- 修复现有用户的 role 字段
-- 如果 role 字段不存在，先添加；如果为 NULL，设置为默认值

-- 1. 确保 role 字段存在
ALTER TABLE public.guide_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guide'));

-- 2. 将 NULL 的 role 设置为 'user'
UPDATE public.guide_profiles 
SET role = 'user' 
WHERE role IS NULL;

-- 3. 设置 admin1@guide.com 为管理员（根据你的数据库）
UPDATE public.guide_profiles 
SET role = 'admin' 
WHERE email = 'admin1@guide.com';

-- 4. 确保所有用户都有 role
UPDATE public.guide_profiles 
SET role = COALESCE(role, 'user') 
WHERE role IS NULL;
