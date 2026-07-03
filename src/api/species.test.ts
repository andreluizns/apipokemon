import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPokemonSpecies } from './species';

describe('fetchPokemonSpecies', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the species endpoint by id or name', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchPokemonSpecies(1);

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon-species/1');
  });
});
