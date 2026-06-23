CREATE TABLE public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'about_stay_close',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE INDEX newsletter_signups_created_at_idx ON public.newsletter_signups (created_at DESC);

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can sign up for newsletter"
  ON public.newsletter_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('about', 'stay_close', 'form_error', '{"text": "Enter a valid email, or try again in a moment."}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE
SET value = EXCLUDED.value;
