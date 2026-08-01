-- Broaden audiobook-takes MIME allowlist: common audio formats + Audacity .aup3 projects.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/vnd.wave',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac',
  'audio/flac',
  'audio/x-flac',
  'audio/ogg',
  'audio/opus',
  'audio/webm',
  'audio/aiff',
  'audio/x-aiff',
  'audio/x-caf',
  'audio/caf',
  'audio/amr',
  'audio/3gpp',
  'audio/3gpp2',
  'audio/x-ms-wma',
  'audio/wma',
  'application/x-audacity-project'
]::text[]
WHERE id = 'audiobook-takes';
