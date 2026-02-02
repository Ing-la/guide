-- 创建一个 SECURITY DEFINER 函数来创建需求，绕过 RLS 限制
CREATE OR REPLACE FUNCTION public.create_demand(
  p_user_id UUID,
  p_city TEXT,
  p_attractions TEXT[],
  p_budget NUMERIC,
  p_plan_time TIMESTAMP WITH TIME ZONE,
  p_description TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_demand_id UUID;
BEGIN
  -- 验证用户 ID 是否匹配当前登录用户
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'User ID mismatch';
  END IF;

  -- 插入需求
  INSERT INTO public.guide_demands (
    user_id,
    city,
    attractions,
    budget,
    plan_time,
    description,
    status
  )
  VALUES (
    p_user_id,
    p_city,
    p_attractions,
    p_budget,
    p_plan_time,
    p_description,
    'pending'
  )
  RETURNING id INTO v_demand_id;

  RETURN v_demand_id;
END;
$$;

-- 授予权限
GRANT EXECUTE ON FUNCTION public.create_demand TO authenticated;
