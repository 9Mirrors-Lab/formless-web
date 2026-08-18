-- Copy existing Auth/profile emails into the advance listen list.
-- New accounts still land in public.profiles via handle_new_user.

INSERT INTO public.advance_listen_signups (email, source)
SELECT lower(btrim(email)), 'advance_listen'
FROM public.profiles
WHERE email IS NOT NULL
  AND btrim(email) <> ''
ON CONFLICT (email) DO NOTHING;
