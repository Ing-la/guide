DROP TABLE IF EXISTS public.guide_complaints CASCADE;
DROP TABLE IF EXISTS public.guide_orders CASCADE;
DROP TABLE IF EXISTS public.guide_demands CASCADE;
DROP TABLE IF EXISTS public.guide_guides CASCADE;
DROP TABLE IF EXISTS public.guide_titles CASCADE;
DROP TABLE IF EXISTS public.guide_profiles CASCADE;

DROP FUNCTION IF EXISTS public.handle_guide_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.sync_guide_profile_email() CASCADE;
DROP FUNCTION IF EXISTS public.sync_guide_profile_email_on_insert() CASCADE;
DROP FUNCTION IF EXISTS public.is_guide_admin() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TRIGGER IF EXISTS on_auth_user_created_guide ON auth.users;
DROP TRIGGER IF EXISTS sync_email_on_auth_user_update ON auth.users;
DROP TRIGGER IF EXISTS sync_email_on_auth_user_insert ON auth.users;

CREATE TABLE IF NOT EXISTS public.guide_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  phone TEXT,
  nickname TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guide')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guide_guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  title TEXT,
  rating NUMERIC(3, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guide_demands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  city TEXT,
  attractions TEXT[],
  budget NUMERIC(10, 2),
  plan_time TIMESTAMP WITH TIME ZONE,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guide_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demand_id UUID REFERENCES public.guide_demands(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  guide_id UUID REFERENCES public.guide_guides(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  amount NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guide_complaints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.guide_orders(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('order', 'chat')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guide_titles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_guide_profiles_role ON public.guide_profiles(role);
CREATE INDEX IF NOT EXISTS idx_guide_profiles_email ON public.guide_profiles(email);
CREATE INDEX IF NOT EXISTS idx_guide_guides_user_id ON public.guide_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_guides_status ON public.guide_guides(status);
CREATE INDEX IF NOT EXISTS idx_guide_demands_user_id ON public.guide_demands(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_demands_status ON public.guide_demands(status);
CREATE INDEX IF NOT EXISTS idx_guide_orders_user_id ON public.guide_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_guide_orders_guide_id ON public.guide_orders(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_orders_status ON public.guide_orders(status);
CREATE INDEX IF NOT EXISTS idx_guide_complaints_order_id ON public.guide_complaints(order_id);
CREATE INDEX IF NOT EXISTS idx_guide_complaints_status ON public.guide_complaints(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guide_profiles_updated_at BEFORE UPDATE ON public.guide_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_guides_updated_at BEFORE UPDATE ON public.guide_guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_demands_updated_at BEFORE UPDATE ON public.guide_demands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_orders_updated_at BEFORE UPDATE ON public.guide_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_titles_updated_at BEFORE UPDATE ON public.guide_titles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

DROP TRIGGER IF EXISTS on_auth_user_created_guide ON auth.users;
CREATE TRIGGER on_auth_user_created_guide
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_guide_new_user();

CREATE OR REPLACE FUNCTION public.sync_guide_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_guide_profile_email_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET email = NEW.email
  WHERE id = NEW.id AND email IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_email_on_auth_user_update ON auth.users;
CREATE TRIGGER sync_email_on_auth_user_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_guide_profile_email();

DROP TRIGGER IF EXISTS sync_email_on_auth_user_insert ON auth.users;
CREATE TRIGGER sync_email_on_auth_user_insert
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_guide_profile_email_on_insert();

CREATE OR REPLACE FUNCTION public.is_guide_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.guide_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

ALTER TABLE public.guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_titles ENABLE ROW LEVEL SECURITY;

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
