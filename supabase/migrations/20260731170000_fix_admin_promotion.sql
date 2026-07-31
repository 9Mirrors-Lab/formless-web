-- Allow postgres / service-role promotion of is_admin (CLI + dashboard SQL).
-- Authenticated browser clients still cannot self-promote.

CREATE OR REPLACE FUNCTION public.protect_profile_is_admin()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    -- Block only real browser JWT sessions (authenticated / anon).
    -- service_role and direct SQL (no JWT) may promote admins.
    IF jwt_role IN ('authenticated', 'anon') THEN
      NEW.is_admin := OLD.is_admin;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Ensure current Formless operators can manage all session takes.
UPDATE public.profiles
SET is_admin = true
WHERE email IN ('riles4@gmail.com', 'rilestrade@gmail.com');
