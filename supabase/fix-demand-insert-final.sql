-- 最终修复：确保需求创建的 RLS 策略正确
-- 删除所有可能冲突的策略，然后重新创建

-- 删除所有需求相关的策略
DROP POLICY IF EXISTS "Users can create own demands" ON public.guide_demands;
DROP POLICY IF EXISTS "Users can view own demands" ON public.guide_demands;
DROP POLICY IF EXISTS "Guides can view all demands" ON public.guide_demands;
DROP POLICY IF EXISTS "Guide admins can manage demands" ON public.guide_demands;

-- 重新创建策略（按顺序）
-- 1. 用户创建需求（最宽松，允许所有认证用户创建）
CREATE POLICY "Users can create own demands" ON public.guide_demands
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2. 用户查看自己的需求
CREATE POLICY "Users can view own demands" ON public.guide_demands
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. 导游查看所有需求
CREATE POLICY "Guides can view all demands" ON public.guide_demands
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'guide'
    )
  );

-- 4. 管理员管理所有需求
CREATE POLICY "Guide admins can manage demands" ON public.guide_demands
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
