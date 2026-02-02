-- 修复 RLS 策略：简化 INSERT 策略，移除可能导致循环依赖的 EXISTS 检查

-- 修复需求创建的 RLS 策略
DROP POLICY IF EXISTS "Users can create own demands" ON public.guide_demands;
CREATE POLICY "Users can create own demands" ON public.guide_demands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 修复投诉创建的 RLS 策略
DROP POLICY IF EXISTS "Users can create complaints" ON public.guide_complaints;
CREATE POLICY "Users can create complaints" ON public.guide_complaints
  FOR INSERT WITH CHECK (auth.uid() = user_id);
