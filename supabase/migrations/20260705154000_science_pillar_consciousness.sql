-- Science pillar 4: Consciousness
INSERT INTO content (page, section, key, value, type, "order")
VALUES
(
  'science',
  'pillars',
  'consciousness',
  $c${
    "label": "Consciousness",
    "hook": "Science continues asking one of humanity's oldest questions:\nWhat is consciousness?",
    "body": "Some theories suggest consciousness emerges from the brain.\nOthers explore whether consciousness is more fundamental than matter itself.\n\nRegardless of where science eventually lands, your own experience offers something immediate.\n\nThoughts come and go.\nEmotions come and go.\nSensations come and go.\n\nYet something remains aware of all of them.\n\nThat is the place this practice begins."
  }$c$::jsonb,
  'list_item',
  3
)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
