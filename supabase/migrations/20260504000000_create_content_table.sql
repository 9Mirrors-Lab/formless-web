-- Mirrors remote migration applied via Supabase MCP (project content table).

CREATE TABLE public.content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  type text NOT NULL DEFAULT 'text',
  "order" int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page, section, key)
);

CREATE INDEX content_page_idx ON public.content (page);
CREATE INDEX content_page_section_idx ON public.content (page, section);
CREATE INDEX content_published_page_idx ON public.content (page) WHERE is_published = true;

CREATE OR REPLACE FUNCTION public.handle_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_content_updated_at();

ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published content"
  ON public.content
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);
