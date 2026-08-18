-- Brand Studio readers can list collected emails.
-- Public access stays insert-only.
-- Reader check uses Auth emails. If public.profiles exists, is_admin also counts.

CREATE OR REPLACE FUNCTION public.can_read_site_signups()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed boolean := false;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = (SELECT auth.uid())
      AND lower(email) IN (
        'sonikacottman@gmail.com',
        'riles4@gmail.com'
      )
  ) INTO allowed;

  IF allowed THEN
    RETURN true;
  END IF;

  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE $q$
      SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND is_admin = true
      )
    $q$ INTO allowed;
    RETURN coalesce(allowed, false);
  END IF;

  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_read_site_signups() FROM anon;
GRANT EXECUTE ON FUNCTION public.can_read_site_signups() TO authenticated;

CREATE POLICY "Signup readers can list book waitlist"
  ON public.book_release_signups
  FOR SELECT
  TO authenticated
  USING (public.can_read_site_signups());

CREATE POLICY "Signup readers can list newsletter"
  ON public.newsletter_signups
  FOR SELECT
  TO authenticated
  USING (public.can_read_site_signups());

CREATE POLICY "Signup readers can list advance listen"
  ON public.advance_listen_signups
  FOR SELECT
  TO authenticated
  USING (public.can_read_site_signups());

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    CREATE POLICY "Signup readers can list accounts"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (public.can_read_site_signups());
  END IF;
END $$;

GRANT SELECT ON public.book_release_signups TO authenticated;
GRANT SELECT ON public.newsletter_signups TO authenticated;
GRANT SELECT ON public.advance_listen_signups TO authenticated;
