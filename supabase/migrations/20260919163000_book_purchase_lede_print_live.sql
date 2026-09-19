-- Print edition is live; keep book purchase panel copy aligned with all three formats.
UPDATE public.content
SET value = '{"text": "Now available on Kindle, Audible, and Amazon Books."}'
WHERE page = 'book'
  AND section = 'header'
  AND key = 'purchase_lede';
