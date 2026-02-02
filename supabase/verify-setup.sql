SELECT 'Database Tables Check' AS check_type;

SELECT 
  table_name,
  CASE 
    WHEN table_name LIKE 'guide_%' THEN '✓ Has prefix'
    ELSE '✗ Missing prefix'
  END AS status
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('guide_profiles', 'guide_guides', 'guide_demands', 'guide_orders', 'guide_complaints', 'guide_titles')
ORDER BY table_name;

SELECT 'RLS Policies Check' AS check_type;

SELECT 
  schemaname,
  tablename,
  policyname,
  CASE 
    WHEN policyname LIKE 'Guide%' THEN '✓ Has prefix'
    ELSE '✗ Missing prefix'
  END AS status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename LIKE 'guide_%'
ORDER BY tablename, policyname;

SELECT 'Storage Policies Check' AS check_type;

SELECT 
  policyname,
  CASE 
    WHEN policyname LIKE 'Guide%' OR policyname LIKE 'Users%' THEN '✓ Found'
    ELSE '✗ Not found'
  END AS status
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%guide%'
ORDER BY policyname;

SELECT 'Admin Users Check' AS check_type;

SELECT 
  id,
  nickname,
  role,
  CASE 
    WHEN role = 'admin' THEN '✓ Admin'
    ELSE '✗ Not admin'
  END AS status,
  created_at
FROM public.guide_profiles
WHERE role = 'admin'
ORDER BY created_at DESC;

SELECT 'Triggers Check' AS check_type;

SELECT 
  trigger_name,
  event_object_table,
  CASE 
    WHEN trigger_name LIKE '%guide%' THEN '✓ Has prefix'
    ELSE '✗ Missing prefix'
  END AS status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (trigger_name LIKE '%guide%' OR event_object_table LIKE 'guide_%')
ORDER BY trigger_name;

SELECT 'Indexes Check' AS check_type;

SELECT 
  indexname,
  tablename,
  CASE 
    WHEN indexname LIKE 'idx_guide%' THEN '✓ Has prefix'
    ELSE '✗ Missing prefix'
  END AS status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE 'guide_%'
ORDER BY tablename, indexname;
