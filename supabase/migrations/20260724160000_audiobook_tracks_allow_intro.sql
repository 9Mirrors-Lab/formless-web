-- Allow chapter_number 0 for book Introduction tracks.

ALTER TABLE public.audiobook_tracks
  DROP CONSTRAINT IF EXISTS audiobook_tracks_chapter_number_check;

ALTER TABLE public.audiobook_tracks
  ADD CONSTRAINT audiobook_tracks_chapter_number_check CHECK (chapter_number >= 0);
