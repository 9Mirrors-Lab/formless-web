-- Republish Chapter 5 optimized master (Updated2 remaster).
-- Drive file id unchanged: 1Z_45Yjf7WssqHqFWNaj0U2XDsi1TcYMk
-- Bytes replaced on gdrive:Formless/03_Distribution_Channels/Audio/ACX-Masters/07_Chapter_5_acx_master.mp3

update public.audiobook_tracks
set
  duration_seconds = 3145.670,
  file_size_bytes = 75574678,
  is_published = true
where book_slug = 'formless'
  and chapter_number = 5
  and source = 'optimized';
