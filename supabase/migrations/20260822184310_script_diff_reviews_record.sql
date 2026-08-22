-- Record marks a difference that will be recut. It sits beside
-- looks fine, as spoken, and needs update.

ALTER TABLE public.script_diff_reviews
  DROP CONSTRAINT IF EXISTS script_diff_reviews_status_check;

ALTER TABLE public.script_diff_reviews
  ADD CONSTRAINT script_diff_reviews_status_check
  CHECK (status IN ('cleared', 'as-spoken', 'needs-update', 'record'));
