import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPokemonList, fetchPokemonByNameOrId, fetchAllPokemonNames } from './pokemon';

describe('pokemon API functions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchPokemonList requests the given limit/offset', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchPokemonList(20, 40);

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=40');
  });

  it('fetchPokemonByNameOrId requests by id', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 25 }) });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchPokemonByNameOrId(25);

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
    expect(result).toEqual({ id: 25 });
  });

  it('fetchAllPokemonNames requests a large limit with offset 0', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchAllPokemonNames();

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
  });
});
