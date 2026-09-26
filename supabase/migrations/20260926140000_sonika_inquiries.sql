-- Public inquiry submissions from /inquire and /qa.
-- Insert-only for anon/authenticated; SELECT limited to signup readers.

CREATE TABLE public.sonika_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  name text,
  email text,
  topic text,
  source text NOT NULL DEFAULT 'inquire',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sonika_inquiries_question_not_blank CHECK (length(btrim(question)) > 0)
);

CREATE INDEX sonika_inquiries_created_at_idx
  ON public.sonika_inquiries (created_at DESC);

CREATE INDEX sonika_inquiries_source_idx
  ON public.sonika_inquiries (source);

ALTER TABLE public.sonika_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit a Sonika inquiry"
  ON public.sonika_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Signup readers can list Sonika inquiries"
  ON public.sonika_inquiries
  FOR SELECT
  TO authenticated
  USING (public.can_read_site_signups());

GRANT INSERT ON public.sonika_inquiries TO anon, authenticated;
GRANT SELECT ON public.sonika_inquiries TO authenticated;
GRANT ALL ON public.sonika_inquiries TO service_role;
