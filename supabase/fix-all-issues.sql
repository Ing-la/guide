DROP POLICY IF EXISTS "Guide admins can view all profiles" ON public.guide_profiles;
DROP POLICY IF EXISTS "Guide admins can update all profiles" ON public.guide_profiles;
DROP POLICY IF EXISTS "Guide admins can delete all profiles" ON public.guide_profiles;
DROP POLICY IF EXISTS "Guide users can view own profile" ON public.guide_profiles;
DROP POLICY IF EXISTS "Guide users can update own profile" ON public.guide_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.guide_profiles;
DROP POLICY IF EXISTS "Guide admins can manage guides" ON public.guide_guides;
DROP POLICY IF EXISTS "Guide admins can manage demands" ON public.guide_demands;
DROP POLICY IF EXISTS "Guide admins can manage orders" ON public.guide_orders;
DROP POLICY IF EXISTS "Guide admins can manage complaints" ON public.guide_complaints;
DROP POLICY IF EXISTS "Guide admins can manage guide_titles" ON public.guide_titles;

CREATE OR REPLACE FUNCTION public.is_guide_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.guide_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE POLICY "Guide admins can view all profiles" ON public.guide_profiles
  FOR SELECT USING (public.is_guide_admin());

CREATE POLICY "Guide admins can update all profiles" ON public.guide_profiles
  FOR UPDATE USING (public.is_guide_admin());

CREATE POLICY "Guide admins can delete all profiles" ON public.guide_profiles
  FOR DELETE USING (public.is_guide_admin());

CREATE POLICY "Guide users can view own profile" ON public.guide_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Guide users can update own profile" ON public.guide_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.guide_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Guide admins can manage guides" ON public.guide_guides
  FOR ALL USING (public.is_guide_admin());

CREATE POLICY "Guide admins can manage demands" ON public.guide_demands
  FOR ALL USING (public.is_guide_admin());

CREATE POLICY "Guide admins can manage orders" ON public.guide_orders
  FOR ALL USING (public.is_guide_admin());

CREATE POLICY "Guide admins can manage complaints" ON public.guide_complaints
  FOR ALL USING (public.is_guide_admin());

CREATE POLICY "Guide admins can manage guide_titles" ON public.guide_titles
  FOR ALL USING (public.is_guide_admin());
