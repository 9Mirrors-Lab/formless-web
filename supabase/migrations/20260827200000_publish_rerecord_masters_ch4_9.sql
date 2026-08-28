-- Publish re-recorded ACX masters for chapters 4–9 (advance listen + re-records review).

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
) values
  (
    'formless',
    4,
    'Resistance and Surrender',
    'optimized',
    'google-drive',
    '1lSgRDyjfjY-mEnAG3RrNeyLRxOrm5Mep',
    'audio/mpeg',
    2436.740,
    58543215,
    '06_Chapter_4_acx_master.mp3',
    true
  ),
  (
    'formless',
    5,
    'Conscious Relationships',
    'optimized',
    'google-drive',
    '1Z_45Yjf7WssqHqFWNaj0U2XDsi1TcYMk',
    'audio/mpeg',
    3146.950,
    75605470,
    '07_Chapter_5_acx_master.mp3',
    true
  ),
  (
    'formless',
    6,
    'Work, Identity and Purpose',
    'optimized',
    'google-drive',
    '1caYL7WBC4OEaSeyUF4yfksnH3SC2sAFQ',
    'audio/mpeg',
    2957.050,
    71043073,
    '08_Chapter_6_acx_master.mp3',
    true
  ),
  (
    'formless',
    7,
    'Nature, Animals and Presence',
    'optimized',
    'google-drive',
    '1TDNMn5i2Owii_UOloguna3qVBLtDNBNk',
    'audio/mpeg',
    2519.220,
    60524448,
    '09_Chapter_7_acx_master.mp3',
    true
  ),
  (
    'formless',
    8,
    'Science, Spirituality and Consciousness',
    'optimized',
    'google-drive',
    '1Y2BVDJvJPzBbxiGNszCy8-KN0mzIkTyu',
    'audio/mpeg',
    3605.420,
    86619282,
    '10_Chapter_8_acx_master.mp3',
    true
  ),
  (
    'formless',
    9,
    'Living in Freedom',
    'optimized',
    'google-drive',
    '1SF4wvtnhefd5BFqGJJ5FbTZCtCRuRBQu',
    'audio/mpeg',
    2916.690,
    70073468,
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
