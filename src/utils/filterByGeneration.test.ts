import { describe, it, expect, vi, beforeEach } from 'vitest';
import { filterByGeneration } from './filterByGeneration';
import * as speciesApi from '../api/species';
import type { Pokemon } from '../types/pokemon';

function makePokemon(id: number): Pokemon {
  return {
    id, name: `p${id}`, height: 1, weight: 1,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [], stats: [], abilities: [],
  };
}

describe('filterByGeneration', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns the input unchanged when generation is null', async () => {
    const pokemons = [makePokemon(1)];
    const result = await filterByGeneration(pokemons, null);
    expect(result).toBe(pokemons);
  });

  it('keeps only pokemon whose species generation matches', async () => {
    const pokemons = [makePokemon(1), makePokemon(2)];
    vi.spyOn(speciesApi, 'fetchPokemonSpecies').mockImplementation(async (id) => ({
      id: Number(id),
      name: `p${id}`,
      generation: { name: Number(id) === 1 ? 'generation-i' : 'generation-ii', url: '' },
      evolution_chain: { url: '' },
      genera: [],
      flavor_text_entries: [],
      gender_rate: -1,
    }));

    const result = await filterByGeneration(pokemons, 'generation-i');

    expect(result).toEqual([pokemons[0]]);
  });
});
