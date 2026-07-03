import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePokemonDetails } from './usePokemonDetails';
import * as pokemonApi from '../api/pokemon';
import * as speciesApi from '../api/species';

describe('usePokemonDetails', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('loads the pokemon and its species generation', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue({
      id: 1, name: 'bulbasaur', height: 7, weight: 69,
      sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
      types: [], stats: [], abilities: [],
    });
    vi.spyOn(speciesApi, 'fetchPokemonSpecies').mockResolvedValue({
      id: 1, name: 'bulbasaur', generation: { name: 'generation-i', url: '' }, evolution_chain: { url: '' },
      genera: [], flavor_text_entries: [], gender_rate: -1,
    });

    const { result } = renderHook(() => usePokemonDetails(1));

    await waitFor(() => expect(result.current.pokemon).not.toBeNull());
    expect(result.current.species?.generation.name).toBe('generation-i');
    expect(result.current.isLoading).toBe(false);
  });
});
