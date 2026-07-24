-- Audiobook chapter audio files (original / optimized) + public storage bucket.

CREATE TABLE public.audiobook_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug text NOT NULL DEFAULT 'formless',
  chapter_number int NOT NULL CHECK (chapter_number >= 0),
  chapter_title text NOT NULL,
  source text NOT NULL CHECK (source IN ('original', 'optimized')),
  storage_bucket text NOT NULL DEFAULT 'audiobook',
  storage_path text NOT NULL,
  mime_type text NOT NULL DEFAULT 'audio/mp4',
  duration_seconds numeric(10, 3),
  file_size_bytes bigint,
  original_filename text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_slug, chapter_number, source),
  UNIQUE (storage_bucket, storage_path)
);

CREATE INDEX audiobook_tracks_book_chapter_idx
  ON public.audiobook_tracks (book_slug, chapter_number);

CREATE INDEX audiobook_tracks_published_idx
  ON public.audiobook_tracks (book_slug)
  WHERE is_published = true;

CREATE OR REPLACE FUNCTION public.handle_audiobook_tracks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_audiobook_tracks_updated_at
  BEFORE UPDATE ON public.audiobook_tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_audiobook_tracks_updated_at();

ALTER TABLE public.audiobook_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published audiobook tracks"
  ON public.audiobook_tracks
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Expose to Data API (project does not auto-grant new public tables).
GRANT SELECT ON public.audiobook_tracks TO anon, authenticated;
GRANT ALL ON public.audiobook_tracks TO service_role;

-- Public bucket for review playback (waveforms need direct media URLs).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audiobook',
  'audiobook',
  true,
  104857600,
  ARRAY['audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/m4a', 'audio/x-m4a']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read audiobook objects"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'audiobook');

CREATE POLICY "Authenticated upload audiobook objects"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audiobook');

CREATE POLICY "Authenticated update audiobook objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audiobook')
  WITH CHECK (bucket_id = 'audiobook');
