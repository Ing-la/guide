INSERT INTO public.guide_profiles (id, phone, nickname, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  NULL,
  'Admin',
  'admin'
) ON CONFLICT (id) DO UPDATE SET role = 'admin';
