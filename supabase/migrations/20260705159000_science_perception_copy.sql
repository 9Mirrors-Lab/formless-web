-- Perception pillar copy update
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'pillars',
  'perception',
  $c${
    "label": "Perception",
    "hook": "You don't experience life exactly as it is.\nYou experience life through the lens of memory, conditioning, beliefs, and past experiences.",
    "body": "Your brain constantly filters and interprets information, creating a version of reality based on what it has learned.\n\nAwareness allows you to notice the lens.\n\nWhen you see the lens, you are no longer identified with it."
  }$c$::jsonb,
  'list_item',
  0
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
