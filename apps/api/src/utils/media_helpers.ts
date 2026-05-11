import { MediaType } from '@prisma/client';

/**
 * Maps a MIME type to a coarse media category.
 *
 * @param mimeType - MIME type (e.g. `image/png`, `video/mp4`).
 * @returns A broad category used by the app.
 */
export function detectMediaType(
  mimeType: string,
): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER' {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType === 'application/pdf' || mimeType.includes('document'))
    return 'DOCUMENT';
  return 'OTHER';
}

/**
 * Metadata describing an uploaded media file persisted in storage (e.g. S3).
 */
export type UploadedFileMeta = {
  url: string;
  key: string;
  type: MediaType;
};
