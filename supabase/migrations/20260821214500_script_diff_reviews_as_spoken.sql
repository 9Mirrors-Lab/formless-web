-- Split "cleared / looks fine" into "as spoken" so wording changes
-- can be kept as recorded, separate from script fixes.

ALTER TABLE public.script_diff_reviews
  DROP CONSTRAINT IF EXISTS script_diff_reviews_status_check;

UPDATE public.script_diff_reviews
SET status = 'as-spoken'
WHERE status = 'cleared';

ALTER TABLE public.script_diff_reviews
  ADD CONSTRAINT script_diff_reviews_status_check
  CHECK (status IN ('as-spoken', 'needs-update'));
