CREATE POLICY "Users can insert own profile" ON public.guide_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
