-- Neuroplasticity pillar copy update
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'pillars',
  'neuroplasticity',
  $c${
    "label": "Neuroplasticity",
    "hook": "Your brain is not fixed.",
    "body": "Every thought you repeatedly believe strengthens neural pathways. Likewise, every moment of awareness weakens them and begins creating new ones.\n\nThe patterns you've lived with for years are not permanent.\n\nChange begins the moment you stop identifying with them."
  }$c$::jsonb,
  'list_item',
  1
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
