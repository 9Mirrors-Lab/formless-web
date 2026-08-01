-- Raise audiobook-takes upload limit from 100 MB to 300 MB.
UPDATE storage.buckets
SET file_size_limit = 314572800
WHERE id = 'audiobook-takes';
