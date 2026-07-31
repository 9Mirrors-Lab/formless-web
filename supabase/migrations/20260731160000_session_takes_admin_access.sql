-- Admin access for reviewing / downloading / managing author session takes.
-- Mark a profile with: update public.profiles set is_admin = true where email = 'you@…';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND is_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Prevent authenticated users from promoting themselves.
CREATE OR REPLACE FUNCTION public.protect_profile_is_admin()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.is_admin IS DISTINCT FROM OLD.is_admin
     AND coalesce(auth.jwt() ->> 'role', '') <> 'service_role' THEN
    NEW.is_admin := OLD.is_admin;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_protect_is_admin ON public.profiles;

CREATE TRIGGER on_profiles_protect_is_admin
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_is_admin();

-- Session take metadata: admins manage all rows.
CREATE POLICY "Admins read all session takes"
  ON public.audiobook_session_takes
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins update session takes"
  ON public.audiobook_session_takes
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete session takes"
  ON public.audiobook_session_takes
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

GRANT UPDATE, DELETE ON public.audiobook_session_takes TO authenticated;

-- Private bucket objects: admins can download and remove any take.
CREATE POLICY "Admins read all session take objects"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audiobook-takes'
    AND public.is_admin()
  );

CREATE POLICY "Admins delete session take objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'audiobook-takes'
    AND public.is_admin()
  );
