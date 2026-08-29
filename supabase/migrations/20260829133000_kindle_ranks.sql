-- Formless Kindle category ranks captured over time for the Brand Studio dashboard card.

CREATE TABLE public.kindle_ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  best_seller_rank integer NOT NULL
    CHECK (best_seller_rank > 0),
  personal_transformation_spirituality integer NOT NULL
    CHECK (personal_transformation_spirituality > 0),
  dating_relationships_spirituality integer NOT NULL
    CHECK (dating_relationships_spirituality > 0),
  spiritual_healing integer NOT NULL
    CHECK (spiritual_healing > 0),
  captured_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.kindle_ranks IS
  'Snapshot history of Formless Kindle bestseller ranks by category.';
COMMENT ON COLUMN public.kindle_ranks.best_seller_rank IS
  'Amazon Best Sellers Rank in the Kindle Store.';
COMMENT ON COLUMN public.kindle_ranks.personal_transformation_spirituality IS
  'Rank in Personal Transformation & Spirituality.';
COMMENT ON COLUMN public.kindle_ranks.dating_relationships_spirituality IS
  'Rank in Dating, Relationships & Spirituality.';
COMMENT ON COLUMN public.kindle_ranks.spiritual_healing IS
  'Rank in Spiritual Healing.';
COMMENT ON COLUMN public.kindle_ranks.captured_at IS
  'When these rank values were captured from Amazon.';

CREATE INDEX kindle_ranks_captured_at_idx
  ON public.kindle_ranks (captured_at DESC);

ALTER TABLE public.kindle_ranks ENABLE ROW LEVEL SECURITY;

-- Rank numbers are marketing display data; anyone can read the latest snapshots.
CREATE POLICY "Public can read kindle ranks"
  ON public.kindle_ranks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert kindle ranks"
  ON public.kindle_ranks
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update kindle ranks"
  ON public.kindle_ranks
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete kindle ranks"
  ON public.kindle_ranks
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

GRANT SELECT ON public.kindle_ranks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.kindle_ranks TO authenticated;

-- Seed from the current hardcoded dashboard history so the card has data immediately.
INSERT INTO public.kindle_ranks (
  best_seller_rank,
  personal_transformation_spirituality,
  dating_relationships_spirituality,
  spiritual_healing,
  captured_at
) VALUES
  (70468, 32, 47, 59, '2026-08-26T12:00:00+00'),
  (58953, 30, 44, 53, '2026-08-27T12:00:00+00'),
  (51869, 23, 37, 40, '2026-08-28T12:00:00+00');
