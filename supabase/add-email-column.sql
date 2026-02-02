ALTER TABLE public.guide_profiles ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.guide_profiles gp
SET email = au.email
FROM auth.users au
WHERE gp.id = au.id AND gp.email IS NULL;

CREATE INDEX IF NOT EXISTS idx_guide_profiles_email ON public.guide_profiles(email);
