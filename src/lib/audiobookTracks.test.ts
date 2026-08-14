import { describe, expect, it, vi } from 'vitest';

import { GOOGLE_DRIVE_STORAGE_PROVIDER } from '@/lib/googleDriveUpload';
import {
  audiobookPublicUrl,
  audiobookTrackPublicUrl,
  googleDriveMediaUrl,
  isGoogleDriveMediaUrl,
} from '@/lib/audiobookTracks';
import { parseGoogleDriveFileId } from '@/lib/googleDriveMedia';

const DRIVE_FILE_ID = '1lSgRDyjfjY-mEnAG3RrNeyLRxOrm5Mep';

describe('audiobook public URLs', () => {
  it('builds a same-origin Drive proxy URL from a file id', () => {
    expect(googleDriveMediaUrl(DRIVE_FILE_ID)).toBe(
      `/api/drive/media?id=${DRIVE_FILE_ID}`,
    );
  });

  it('rejects short or unsafe Drive ids', () => {
    expect(parseGoogleDriveFileId('abc123')).toBeNull();
    expect(googleDriveMediaUrl('abc123')).toBe('');
  });

  it('uses Drive proxy URLs when the catalog bucket is google-drive', () => {
    expect(audiobookPublicUrl(GOOGLE_DRIVE_STORAGE_PROVIDER, DRIVE_FILE_ID)).toBe(
      googleDriveMediaUrl(DRIVE_FILE_ID),
    );
  });

  it('plays optimized masters through the Drive proxy even if the bucket is mislabeled', () => {
    expect(
      audiobookTrackPublicUrl('optimized', 'audiobook', DRIVE_FILE_ID),
    ).toBe(googleDriveMediaUrl(DRIVE_FILE_ID));
    expect(
      audiobookTrackPublicUrl(
        'optimized',
        'audiobook',
        'formless/chapter-01/optimized.mp3',
      ),
    ).toBe('');
  });

  it('keeps Supabase public object URLs for original takes', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    expect(audiobookPublicUrl('audiobook', 'formless/chapter-01/original.m4a')).toBe(
      'https://example.supabase.co/storage/v1/object/public/audiobook/formless/chapter-01/original.m4a',
    );
    expect(
      audiobookTrackPublicUrl(
        'original',
        'audiobook',
        'formless/chapter-01/original.m4a',
      ),
    ).toBe(
      'https://example.supabase.co/storage/v1/object/public/audiobook/formless/chapter-01/original.m4a',
    );
    vi.unstubAllEnvs();
  });

  it('detects Drive media URLs including the same-origin proxy', () => {
    expect(isGoogleDriveMediaUrl(googleDriveMediaUrl(DRIVE_FILE_ID))).toBe(true);
    expect(
      isGoogleDriveMediaUrl(
        'https://drive.usercontent.google.com/download?id=x&export=download',
      ),
    ).toBe(true);
    expect(
      isGoogleDriveMediaUrl(
        'https://mkssukztjbpkovvyxhiz.supabase.co/storage/v1/object/public/audiobook/x.mp3',
      ),
    ).toBe(false);
  });
});
