import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvePokemonCandidates } from './resolvePokemonCandidates';
import * as pokemonApi from './pokemon';
import * as typeApi from './pokemonType';

describe('resolvePokemonCandidates', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns all pokemon (id + name) ordered by pokedex when no filters are set', async () => {
    vi.spyOn(pokemonApi, 'fetchAllPokemonNames').mockResolvedValue({
      count: 2, next: null, previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });

    const result = await resolvePokemonCandidates({ query: '', type: null });

    expect(result).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ]);
  });

  it('filters the full name list by substring when a query is set and no type is selected', async () => {
    vi.spyOn(pokemonApi, 'fetchAllPokemonNames').mockResolvedValue({
      count: 3, next: null, previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
      ],
    });

    const result = await resolvePokemonCandidates({ query: 'char', type: null });

    expect(result).toEqual([{ id: 4, name: 'charmander' }]);
  });

  it('uses the type endpoint as the base list when a type is selected', async () => {
    vi.spyOn(typeApi, 'fetchPokemonByType').mockResolvedValue({
      pokemon: [
        { slot: 1, pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { slot: 1, pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
      ],
      damage_relations: { double_damage_from: [], half_damage_from: [], no_damage_from: [] },
    });

    const result = await resolvePokemonCandidates({ query: '', type: 'fire' });

    expect(result).toEqual([
      { id: 4, name: 'charmander' },
      { id: 5, name: 'charmeleon' },
    ]);
  });

  it('intersects type and query filters', async () => {
    vi.spyOn(typeApi, 'fetchPokemonByType').mockResolvedValue({
      pokemon: [
        { slot: 1, pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { slot: 1, pokemon: { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' } },
      ],
      damage_relations: { double_damage_from: [], half_damage_from: [], no_damage_from: [] },
    });

    const result = await resolvePokemonCandidates({ query: 'meleon', type: 'fire' });

    expect(result).toEqual([{ id: 5, name: 'charmeleon' }]);
  });
});
