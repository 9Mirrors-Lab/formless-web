-- Publish the Chapter 9 ACX master for advance listen / editorial playback.

insert into public.audiobook_tracks (
  book_slug,
  chapter_number,
  chapter_title,
  source,
  storage_bucket,
  storage_path,
  mime_type,
  duration_seconds,
  file_size_bytes,
  original_filename,
  is_published
) values (
  'formless',
  9,
  'Living in Freedom',
  'optimized',
  'google-drive',
  '1SF4wvtnhefd5BFqGJJ5FbTZCtCRuRBQu',
  'audio/mpeg',
  2917.480,
  70020955,
  '11_Chapter_9_acx_master.mp3',
  true
)
on conflict (book_slug, chapter_number, source) do update
set
  chapter_title = excluded.chapter_title,
  storage_bucket = excluded.storage_bucket,
  storage_path = excluded.storage_path,
  mime_type = excluded.mime_type,
  duration_seconds = excluded.duration_seconds,
  file_size_bytes = excluded.file_size_bytes,
  original_filename = excluded.original_filename,
  is_published = true;
