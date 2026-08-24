-- Point published original takes at Drive. Bytes live in Published-Originals
-- (folder 1jqE0kYzd6vSjr00osL7g8Tl08r09vPus). Postgres keeps the pointer.
-- Optimized masters already use google-drive / ACX-Masters.

update public.audiobook_tracks as track
set
  storage_bucket = 'google-drive',
  storage_path = mapped.drive_id,
  original_filename = mapped.filename,
  mime_type = 'audio/mp4'
from (
  values
    (13, '1VekFAE4UB9xE-2yL4Emr5iowXdnbyMQI', '01_Opening_Credits_original.m4a'),
    (0, '1t8UHZEfD3T6XIAdyZqjEBZTBs4dURVp-', '02_Introduction_original.m4a'),
    (1, '1HSDPD8VpuQcO1RwVyIOWQ6s4Kn6gyigm', '03_Chapter_1_original.m4a'),
    (2, '1QGIAS4waJNmI16Rey57DrUJpehNAxylY', '04_Chapter_2_original.m4a'),
    (3, '1abl5vb5AvzLIb197Go2971lP3guuCnRU', '05_Chapter_3_original.m4a'),
    (4, '1tjVBmzidnl_lQb1yQBTd7XbbJZRauoAU', '06_Chapter_4_original.m4a'),
    (5, '1i-V18TiY2DiLealY0Q3D9Q6BK0lF4Rkg', '07_Chapter_5_original.m4a'),
    (6, '1vG6leJ6eXImv4to_CbfcF5MpE9x3R9xA', '08_Chapter_6_original.m4a'),
    (7, '15FGj47kgDCY2CerbRTPsgcmRIQFHlxj2', '09_Chapter_7_original.m4a'),
    (8, '18XqR6yldG6footf5PYZtMTxsPTVjem-U', '10_Chapter_8_original.m4a'),
    (9, '1rSNuWuaR5KeIkebDXbf4MJ-0xJXaLkOp', '11_Chapter_9_original.m4a'),
    (12, '16QLx1HhpRcXw9JcuBHBomJLCjcCZ2bPT', '12_Acknowledgments_original.m4a')
) as mapped(chapter_number, drive_id, filename)
where track.book_slug = 'formless'
  and track.source = 'original'
  and track.chapter_number = mapped.chapter_number;

alter table public.audiobook_tracks
  alter column storage_bucket set default 'google-drive';
