-- 修改 guide_complaints 表，添加 user_id 和 guide_id 字段
ALTER TABLE public.guide_complaints
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS guide_id UUID REFERENCES public.guide_guides(id) ON DELETE SET NULL;

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_guide_complaints_user_id ON public.guide_complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_complaints_guide_id ON public.guide_complaints(guide_id);

-- 更新 RLS 策略：用户权限
DROP POLICY IF EXISTS "Users can create complaints" ON public.guide_complaints;
CREATE POLICY "Users can create complaints" ON public.guide_complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own complaints" ON public.guide_complaints;
CREATE POLICY "Users can view own complaints" ON public.guide_complaints
  FOR SELECT USING (auth.uid() = user_id);

-- 更新 RLS 策略：导游权限
DROP POLICY IF EXISTS "Guides can view complaints about them" ON public.guide_complaints;
CREATE POLICY "Guides can view complaints about them" ON public.guide_complaints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.guide_guides
      WHERE id = guide_complaints.guide_id AND user_id = auth.uid()
    )
  );

-- 更新 RLS 策略：需求表 - 用户权限
DROP POLICY IF EXISTS "Users can create own demands" ON public.guide_demands;
CREATE POLICY "Users can create own demands" ON public.guide_demands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own demands" ON public.guide_demands;
CREATE POLICY "Users can view own demands" ON public.guide_demands
  FOR SELECT USING (auth.uid() = user_id);

-- 更新 RLS 策略：需求表 - 导游权限
DROP POLICY IF EXISTS "Guides can view all demands" ON public.guide_demands;
CREATE POLICY "Guides can view all demands" ON public.guide_demands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'guide'
    )
  );
