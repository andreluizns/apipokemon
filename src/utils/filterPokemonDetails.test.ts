import { describe, it, expect } from 'vitest';
import { filterByHeightAndWeight } from './filterPokemonDetails';
import type { Pokemon } from '../types/pokemon';

function makePokemon(id: number, height: number, weight: number): Pokemon {
  return {
    id, name: `p${id}`, height, weight,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [], stats: [], abilities: [],
  };
}

describe('filterByHeightAndWeight', () => {
  const pokemons = [makePokemon(1, 5, 50), makePokemon(2, 15, 150), makePokemon(3, 25, 250)];

  it('returns everything when no bounds are set', () => {
    expect(filterByHeightAndWeight(pokemons, { minHeight: null, maxHeight: null, minWeight: null, maxWeight: null })).toEqual(pokemons);
  });

  it('filters by minHeight and maxHeight', () => {
    const result = filterByHeightAndWeight(pokemons, { minHeight: 10, maxHeight: 20, minWeight: null, maxWeight: null });
    expect(result).toEqual([pokemons[1]]);
  });

  it('filters by minWeight and maxWeight', () => {
    const result = filterByHeightAndWeight(pokemons, { minHeight: null, maxHeight: null, minWeight: 100, maxWeight: 200 });
    expect(result).toEqual([pokemons[1]]);
  });
});
