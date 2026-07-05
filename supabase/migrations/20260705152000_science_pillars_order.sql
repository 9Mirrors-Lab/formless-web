-- Science pillars: Neuroplasticity is pillar 2, Observation is pillar 3
INSERT INTO content (page, section, key, value, type, "order")
VALUES
('science', 'pillars', 'perception', $c${"label": "Perception", "hook": "Your brain is not showing you reality. It is building a prediction of what reality should be.", "body": "Neuroscience reveals that perception is constructed, not received. What you see is filtered through memory, expectation, and conditioning."}$c$::jsonb, 'list_item', 0),
('science', 'pillars', 'neuroplasticity', $c${"label": "Neuroplasticity", "hook": "The neural pathways of suffering can be interrupted: not by force, but by awareness.", "body": "Repeated patterns of thought create physical grooves in the brain. New attention creates new pathways."}$c$::jsonb, 'list_item', 1),
('science', 'pillars', 'observation', $c${"label": "Observation", "hook": "Conscious observation changes what is being observed.", "body": "The observer effect in quantum mechanics mirrors a deeper truth: awareness itself alters the pattern."}$c$::jsonb, 'list_item', 2)
ON CONFLICT (page, section, key) DO UPDATE SET
  value = EXCLUDED.value,
  type = EXCLUDED.type,
  "order" = EXCLUDED."order",
  updated_at = now();
