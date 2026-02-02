-- 检查 RLS 策略是否正确设置
-- 运行此 SQL 查看当前的 RLS 策略

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'guide_profiles'
ORDER BY policyname;

-- 检查 is_guide_admin 函数是否存在
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc
WHERE proname = 'is_guide_admin';
