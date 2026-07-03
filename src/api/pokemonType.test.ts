import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchPokemonByType } from './pokemonType';

describe('fetchPokemonByType', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the type endpoint by name', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ pokemon: [] }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchPokemonByType('fire');

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/type/fire');
  });
});
