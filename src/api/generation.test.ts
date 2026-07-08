import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchGeneration } from './generation';

describe('fetchGeneration', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the generation endpoint by name', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ pokemon_species: [] }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchGeneration('generation-ix');

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/generation/generation-ix');
  });
});
