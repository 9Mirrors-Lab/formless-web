-- Book vs audio review marks are shared editorial state, not per-user
-- private data. The compare page writes with the browser anon key when
-- someone is checking locally without a session. Signed-in internal
-- readers keep their existing policies.

DROP POLICY IF EXISTS "Anon can list script reviews" ON public.script_diff_reviews;
DROP POLICY IF EXISTS "Anon can insert script reviews" ON public.script_diff_reviews;
DROP POLICY IF EXISTS "Anon can update script reviews" ON public.script_diff_reviews;
DROP POLICY IF EXISTS "Anon can delete script reviews" ON public.script_diff_reviews;

CREATE POLICY "Anon can list script reviews"
  ON public.script_diff_reviews
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can insert script reviews"
  ON public.script_diff_reviews
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update script reviews"
  ON public.script_diff_reviews
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete script reviews"
  ON public.script_diff_reviews
  FOR DELETE
  TO anon
  USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.script_diff_reviews TO anon;
