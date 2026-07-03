import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiGet } from './client';

describe('apiGet', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('resolves with parsed JSON on success', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ hello: 'world' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await apiGet<{ hello: string }>('/some-path');

    expect(result).toEqual({ hello: 'world' });
    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/some-path');
  });

  it('passes absolute URLs through unchanged', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    await apiGet('https://pokeapi.co/api/v2/evolution-chain/1/');

    expect(mockFetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/evolution-chain/1/');
  });

  it('throws when the response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    vi.stubGlobal('fetch', mockFetch);

    await expect(apiGet('/missing')).rejects.toThrow('PokeAPI request failed: 404');
  });
});
