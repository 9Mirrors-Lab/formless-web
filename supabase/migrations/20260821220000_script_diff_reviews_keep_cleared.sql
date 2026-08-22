-- Looks fine (cleared) stays a real mark. As spoken is an extra
-- status beside it, not a replacement.

ALTER TABLE public.script_diff_reviews
  DROP CONSTRAINT IF EXISTS script_diff_reviews_status_check;

ALTER TABLE public.script_diff_reviews
  ADD CONSTRAINT script_diff_reviews_status_check
  CHECK (status IN ('cleared', 'as-spoken', 'needs-update'));
