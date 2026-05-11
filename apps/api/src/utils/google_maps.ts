import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Extract the Google Maps *share token* from the copied Google Maps short link.
 *
 * Example:
 * - Input:  `https://maps.app.goo.gl/8ag7yR2xezRLPVRS8`
 * - Output: `8ag7yR2xezRLPVRS8`
 *
 * Supported:
 * - `https://maps.app.goo.gl/<token>`
 * - `maps.app.goo.gl/<token>` (no scheme)
 * - `<token>` (token-only)
 *
 * If we can't extract a token, we throw a 400 with an actionable message.
 */
export function extractGoogleMapsTokenFromUrl(rawUrl: string): string {
  const trimmed = (rawUrl ?? '').trim();

  if (!trimmed) {
    throw new HttpException('googleMapsUrl is empty', HttpStatus.BAD_REQUEST);
  }

  // Token-only input (common when user pastes just the token)
  if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed)) {
    return trimmed;
  }

  // Ensure there is a protocol for the URL parser
  const urlString = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    throw new HttpException('Invalid URL format', HttpStatus.BAD_REQUEST);
  }

  // 1. Validate the host
  if (url.hostname !== 'maps.app.goo.gl') {
    throw new HttpException(
      'URL must be a maps.app.goo.gl share link (e.g., https://maps.app.goo.gl/<token>)',
      HttpStatus.BAD_REQUEST,
    );
  }

  // 2. Extract token from path: /<token>
  // Filter removes empty strings from leading slashes
  const parts = url.pathname.split('/').filter(Boolean);

  const token = parts[0];

  if (!token) {
    throw new HttpException(
      'Missing share token in URL (e.g., https://maps.app.goo.gl/XYZ)',
      HttpStatus.BAD_REQUEST,
    );
  }

  return token;
}
