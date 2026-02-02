CREATE POLICY "Guide admins can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'guide' AND
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Guide admins can view files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'guide' AND
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Guide admins can update files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'guide' AND
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Guide admins can delete files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'guide' AND
    EXISTS (
      SELECT 1 FROM public.guide_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'guide' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'guide' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'guide' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'guide' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
