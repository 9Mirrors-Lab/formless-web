-- Lock customer-data reads to Auth emails (not editable profiles.email).
-- Also stop authenticated users from rewriting profiles.email / is_admin,
-- and tighten table grants to insert/select only.

CREATE OR REPLACE FUNCTION public.can_read_site_signups()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = (SELECT auth.uid())
      AND lower(email) IN (
        'sonikacottman@gmail.com',
        'riles4@gmail.com'
      )
  )
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND is_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM anon;
GRANT EXECUTE ON FUNCTION public.can_read_site_signups() TO authenticated;

-- Block browser clients from spoofing allowlist email or promoting is_admin.
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
BEGIN
  IF TG_OP = 'UPDATE' AND jwt_role IN ('authenticated', 'anon') THEN
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      NEW.is_admin := OLD.is_admin;
    END IF;
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      NEW.email := OLD.email;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_protect_is_admin ON public.profiles;
DROP TRIGGER IF EXISTS on_profiles_protect_privileged_fields ON public.profiles;

CREATE TRIGGER on_profiles_protect_privileged_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();

-- Defense in depth: revoke broad default-style grants; keep insert + reader select.
REVOKE ALL ON TABLE public.book_release_signups FROM anon, authenticated;
REVOKE ALL ON TABLE public.newsletter_signups FROM anon, authenticated;
REVOKE ALL ON TABLE public.advance_listen_signups FROM anon, authenticated;
REVOKE ALL ON TABLE public.sonika_inquiries FROM anon, authenticated;

GRANT INSERT ON TABLE public.book_release_signups TO anon, authenticated;
GRANT INSERT ON TABLE public.newsletter_signups TO anon, authenticated;
GRANT INSERT ON TABLE public.advance_listen_signups TO anon, authenticated;
GRANT INSERT ON TABLE public.sonika_inquiries TO anon, authenticated;

GRANT SELECT ON TABLE public.book_release_signups TO authenticated;
GRANT SELECT ON TABLE public.newsletter_signups TO authenticated;
GRANT SELECT ON TABLE public.advance_listen_signups TO authenticated;
GRANT SELECT ON TABLE public.sonika_inquiries TO authenticated;

GRANT ALL ON TABLE public.book_release_signups TO service_role;
GRANT ALL ON TABLE public.newsletter_signups TO service_role;
GRANT ALL ON TABLE public.advance_listen_signups TO service_role;
GRANT ALL ON TABLE public.sonika_inquiries TO service_role;
