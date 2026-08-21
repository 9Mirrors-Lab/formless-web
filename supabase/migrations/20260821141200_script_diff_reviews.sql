-- Shared book-vs-audio review status so progress is not lost in the browser.
-- Internal readers (can_read_site_signups) can read and write.

CREATE TABLE public.script_diff_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug text NOT NULL DEFAULT 'formless',
  chapter_id integer NOT NULL,
  script_model text NOT NULL CHECK (script_model IN ('base', 'medium')),
  fingerprint text NOT NULL,
  fingerprint_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('cleared', 'needs-update')),
  reviewed_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_slug, chapter_id, script_model, fingerprint_key)
);

CREATE INDEX script_diff_reviews_chapter_idx
  ON public.script_diff_reviews (book_slug, chapter_id, script_model);

CREATE OR REPLACE FUNCTION public.handle_script_diff_reviews_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_script_diff_reviews_updated_at
  BEFORE UPDATE ON public.script_diff_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_script_diff_reviews_updated_at();

ALTER TABLE public.script_diff_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal readers can list script reviews"
  ON public.script_diff_reviews
  FOR SELECT
  TO authenticated
  USING (public.can_read_site_signups());

CREATE POLICY "Internal readers can insert script reviews"
  ON public.script_diff_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (public.can_read_site_signups());

CREATE POLICY "Internal readers can update script reviews"
  ON public.script_diff_reviews
  FOR UPDATE
  TO authenticated
  USING (public.can_read_site_signups())
  WITH CHECK (public.can_read_site_signups());

CREATE POLICY "Internal readers can delete script reviews"
  ON public.script_diff_reviews
  FOR DELETE
  TO authenticated
  USING (public.can_read_site_signups());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.script_diff_reviews TO authenticated;
GRANT ALL ON public.script_diff_reviews TO service_role;
