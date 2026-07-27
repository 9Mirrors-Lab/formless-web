-- Fix missing table RLS for audiobook_session_takes (storage policies already exist).

DROP POLICY IF EXISTS "Anyone can submit session takes" ON public.audiobook_session_takes;
DROP POLICY IF EXISTS "Authenticated read own session takes" ON public.audiobook_session_takes;

CREATE POLICY "Anyone can submit session takes"
  ON public.audiobook_session_takes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated read own session takes"
  ON public.audiobook_session_takes
  FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

REVOKE ALL ON public.audiobook_session_takes FROM anon;
GRANT INSERT ON public.audiobook_session_takes TO anon;

REVOKE ALL ON public.audiobook_session_takes FROM authenticated;
GRANT INSERT, SELECT ON public.audiobook_session_takes TO authenticated;

GRANT ALL ON public.audiobook_session_takes TO service_role;
