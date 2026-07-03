import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchEvolutionChain } from './evolution';

describe('fetchEvolutionChain', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the exact evolution-chain URL it is given', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
    vi.stubGlobal('fetch', mockFetch);

    await fetchEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/');

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/evolution-chain/1/');
  });
});
