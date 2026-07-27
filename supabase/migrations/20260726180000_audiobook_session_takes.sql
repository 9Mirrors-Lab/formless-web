-- Author companion session takes (room tone + calibration uploads).
-- Related to audiobook_tracks (published chapter masters) but separate:
-- these are raw author submissions for initial / session calibration review.

CREATE TABLE public.audiobook_session_takes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug text NOT NULL DEFAULT 'formless',
  take_kind text NOT NULL DEFAULT 'initial_calibration'
    CHECK (take_kind IN ('initial_calibration', 'session_calibration', 'chapter_draft')),
  storage_bucket text NOT NULL DEFAULT 'audiobook-takes',
  storage_path text NOT NULL,
  mime_type text NOT NULL,
  file_size_bytes bigint,
  original_filename text,
  sample_rate_hz int,
  channels int,
  duration_seconds numeric(10, 3),
  room_tone_seconds numeric(6, 2) NOT NULL DEFAULT 30,
  notes text,
  uploaded_by uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (storage_bucket, storage_path)
);

CREATE INDEX audiobook_session_takes_book_created_idx
  ON public.audiobook_session_takes (book_slug, created_at DESC);

CREATE INDEX audiobook_session_takes_status_idx
  ON public.audiobook_session_takes (status, created_at DESC);

CREATE OR REPLACE FUNCTION public.handle_audiobook_session_takes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_audiobook_session_takes_updated_at
  BEFORE UPDATE ON public.audiobook_session_takes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_audiobook_session_takes_updated_at();

ALTER TABLE public.audiobook_session_takes ENABLE ROW LEVEL SECURITY;

-- Companion kit may be used without a logged-in session; allow insert of takes.
CREATE POLICY "Anyone can submit session takes"
  ON public.audiobook_session_takes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authors can read their own rows when signed in; service role handles review.
CREATE POLICY "Authenticated read own session takes"
  ON public.audiobook_session_takes
  FOR SELECT
  TO authenticated
  USING (uploaded_by = auth.uid());

GRANT INSERT ON public.audiobook_session_takes TO anon;
GRANT INSERT, SELECT ON public.audiobook_session_takes TO authenticated;
GRANT ALL ON public.audiobook_session_takes TO service_role;

-- Private bucket for unpublished author takes (not for public playback).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audiobook-takes',
  'audiobook-takes',
  false,
  104857600,
  ARRAY[
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/vnd.wave',
    'audio/mpeg',
    'audio/mp4',
    'audio/x-m4a',
    'audio/aac'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Anyone can upload session take objects"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'audiobook-takes');

CREATE POLICY "Authenticated read own session take objects"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'audiobook-takes'
    AND owner = auth.uid()
  );
