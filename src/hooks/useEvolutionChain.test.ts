import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvolutionChain } from './useEvolutionChain';
import * as evolutionApi from '../api/evolution';

describe('useEvolutionChain', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('fetches the given evolution-chain URL and flattens the result', async () => {
    vi.spyOn(evolutionApi, 'fetchEvolutionChain').mockResolvedValue({
      id: 1,
      chain: {
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        evolution_details: [],
        evolves_to: [],
      },
    });

    const { result } = renderHook(() => useEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/'));

    await waitFor(() => expect(result.current.stages).toHaveLength(1));
    expect(result.current.stages[0][0].speciesName).toBe('bulbasaur');
    expect(result.current.isLoading).toBe(false);
    expect(evolutionApi.fetchEvolutionChain).toHaveBeenCalledWith('https://pokeapi.co/api/v2/evolution-chain/1/');
  });

  it('does nothing when the url is null', () => {
    const fetchSpy = vi.spyOn(evolutionApi, 'fetchEvolutionChain');

    const { result } = renderHook(() => useEvolutionChain(null));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.stages).toEqual([]);
  });
});
