const BASE_URL = 'https://pokeapi.co/api/v2';

export async function apiGet<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status} ${url}`);
  }
  return response.json() as Promise<T>;
}
