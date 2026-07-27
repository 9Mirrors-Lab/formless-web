-- Restore anon insert privilege and avoid RETURNING needing SELECT.

GRANT INSERT ON public.audiobook_session_takes TO anon;
GRANT INSERT, SELECT ON public.audiobook_session_takes TO authenticated;
GRANT ALL ON public.audiobook_session_takes TO service_role;
