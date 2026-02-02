-- 修复 guide_complaints 表的 guide_id 引用
-- 将 guide_id 从引用 guide_guides(id) 改为引用 guide_profiles(id)

-- 1. 删除旧的外键约束
ALTER TABLE public.guide_complaints
DROP CONSTRAINT IF EXISTS guide_complaints_guide_id_fkey;

-- 2. 修改 guide_id 列，使其引用 guide_profiles(id)
ALTER TABLE public.guide_complaints
ALTER COLUMN guide_id TYPE UUID;

-- 3. 添加新的外键约束
ALTER TABLE public.guide_complaints
ADD CONSTRAINT guide_complaints_guide_id_fkey 
FOREIGN KEY (guide_id) REFERENCES public.guide_profiles(id) ON DELETE SET NULL;

-- 4. 更新 RLS 策略：导游查看投诉自己的投诉
DROP POLICY IF EXISTS "Guides can view complaints about them" ON public.guide_complaints;
CREATE POLICY "Guides can view complaints about them" ON public.guide_complaints
  FOR SELECT USING (
    guide_id = auth.uid()
  );
