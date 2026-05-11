/**
 * Generates a random UUID v4 string (RFC 4122-ish).
 *
 * Important: this uses `Math.random()` and is **not** cryptographically secure.
 * If you need a secure UUID, prefer Node's `crypto.randomUUID()` (Node 16.7+)
 * or `crypto.getRandomValues`-based generation.
 *
 * @returns A UUID v4 string.
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
