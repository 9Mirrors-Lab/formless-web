CREATE TABLE public.book_release_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text NOT NULL DEFAULT 'book_page',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE INDEX book_release_signups_created_at_idx ON public.book_release_signups (created_at DESC);

ALTER TABLE public.book_release_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can sign up for book release"
  ON public.book_release_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

INSERT INTO public.content (page, section, key, value, type, "order")
VALUES
  ('book', 'header', 'notify_heading', '{"text": "Sign up to be notified when the book releases."}', 'text', 0),
  ('book', 'header', 'notify_cta', '{"text": "Notify me"}', 'text', 0),
  ('book', 'header', 'notify_fine_print', '{"text": "One email on release day. Unsubscribe anytime."}', 'text', 0),
  ('book', 'header', 'notify_success', '{"text": "You''re on the list."}', 'text', 0),
  ('book', 'header', 'notify_error', '{"text": "Enter a valid email, or try again in a moment."}', 'text', 0)
ON CONFLICT (page, section, key) DO UPDATE
SET value = EXCLUDED.value;
