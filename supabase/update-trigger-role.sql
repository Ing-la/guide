-- 更新触发器以支持从 metadata 读取 role
CREATE OR REPLACE FUNCTION public.handle_guide_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF NEW.raw_user_meta_data->>'project' = 'guide' OR NEW.raw_user_meta_data->>'project' IS NULL THEN
    -- 从 metadata 中读取 role，如果不存在则默认为 'user'
    user_role := COALESCE(
      NEW.raw_user_meta_data->>'role',
      'user'
    );
    
    -- 确保 role 是有效值
    IF user_role NOT IN ('admin', 'user', 'guide') THEN
      user_role := 'user';
    END IF;
    
    INSERT INTO public.guide_profiles (id, phone, nickname, role, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_user_meta_data->>'nickname', NEW.email),
      user_role,
      NEW.email
    ) ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role,
      email = COALESCE(EXCLUDED.email, guide_profiles.email),
      phone = COALESCE(EXCLUDED.phone, guide_profiles.phone),
      nickname = COALESCE(EXCLUDED.nickname, guide_profiles.nickname);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
