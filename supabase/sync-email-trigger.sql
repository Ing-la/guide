CREATE OR REPLACE FUNCTION public.sync_guide_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_email_on_auth_user_update ON auth.users;
CREATE TRIGGER sync_email_on_auth_user_update
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.sync_guide_profile_email();

CREATE OR REPLACE FUNCTION public.sync_guide_profile_email_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.guide_profiles
  SET email = NEW.email
  WHERE id = NEW.id AND email IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS sync_email_on_auth_user_insert ON auth.users;
CREATE TRIGGER sync_email_on_auth_user_insert
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_guide_profile_email_on_insert();
