-- 修复 RLS 策略：允许用户查看 role='guide' 的 profiles（用于投诉表单选择导游）
DROP POLICY IF EXISTS "Users can view guide profiles for complaints" ON public.guide_profiles;
CREATE POLICY "Users can view guide profiles for complaints" ON public.guide_profiles
  FOR SELECT USING (
    role = 'guide'
  );

-- 确保需求创建的 RLS 策略正确
DROP POLICY IF EXISTS "Users can create own demands" ON public.guide_demands;
CREATE POLICY "Users can create own demands" ON public.guide_demands
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid()
    )
  );
