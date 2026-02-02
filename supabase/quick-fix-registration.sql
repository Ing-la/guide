-- 快速修复注册和登录问题
-- 确保 RLS 策略正确，允许用户插入自己的 profile

-- 1. 确保用户可以插入自己的 profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.guide_profiles;
CREATE POLICY "Users can insert own profile" ON public.guide_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. 确保用户可以查看自己的 profile
DROP POLICY IF EXISTS "Guide users can view own profile" ON public.guide_profiles;
CREATE POLICY "Guide users can view own profile" ON public.guide_profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. 确保用户可以更新自己的 profile
DROP POLICY IF EXISTS "Guide users can update own profile" ON public.guide_profiles;
CREATE POLICY "Guide users can update own profile" ON public.guide_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. 确保触发器存在并正常工作
DROP TRIGGER IF EXISTS on_auth_user_created_guide ON auth.users;
CREATE TRIGGER on_auth_user_created_guide
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_guide_new_user();

-- 5. 确保 handle_guide_new_user 函数存在
CREATE OR REPLACE FUNCTION public.handle_guide_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'project' = 'guide' OR NEW.raw_user_meta_data->>'project' IS NULL THEN
    INSERT INTO public.guide_profiles (id, email, phone, nickname, role)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 确保 is_guide_admin 函数存在
CREATE OR REPLACE FUNCTION public.is_guide_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.guide_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
