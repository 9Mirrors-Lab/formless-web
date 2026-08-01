-- Raise audiobook-takes upload limit from 300 MB to 600 MB.
UPDATE storage.buckets
SET file_size_limit = 629145600
WHERE id = 'audiobook-takes';
