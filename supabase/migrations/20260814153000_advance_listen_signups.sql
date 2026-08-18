-- Emails from publishers and early listeners on /advance-listen.
-- Insert-only for the public API; no SELECT, so addresses cannot be listed.

CREATE TABLE public.advance_listen_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'advance_listen',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE INDEX advance_listen_signups_created_at_idx
  ON public.advance_listen_signups (created_at DESC);

ALTER TABLE public.advance_listen_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can leave an email to listen"
  ON public.advance_listen_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.advance_listen_signups TO anon, authenticated;
GRANT ALL ON public.advance_listen_signups TO service_role;
