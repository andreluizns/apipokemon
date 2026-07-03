export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) {
    throw new Error(`Cannot extract id from url: ${url}`);
  }
  return Number(match[1]);
}
