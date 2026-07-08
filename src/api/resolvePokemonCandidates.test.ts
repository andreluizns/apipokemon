import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvePokemonCandidates } from './resolvePokemonCandidates';
import * as pokemonApi from './pokemon';
import * as typeApi from './pokemonType';
import * as generationApi from './generation';

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

    const result = await resolvePokemonCandidates({ query: '', type: null, generation: null });

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

    const result = await resolvePokemonCandidates({ query: 'char', type: null, generation: null });

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

    const result = await resolvePokemonCandidates({ query: '', type: 'fire', generation: null });

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

    const result = await resolvePokemonCandidates({ query: 'meleon', type: 'fire', generation: null });

    expect(result).toEqual([{ id: 5, name: 'charmeleon' }]);
  });

  it('uses the generation endpoint as the base list when a generation is selected', async () => {
    vi.spyOn(generationApi, 'fetchGeneration').mockResolvedValue({
      pokemon_species: [
        { name: 'sprigatito', url: 'https://pokeapi.co/api/v2/pokemon-species/906/' },
        { name: 'fuecoco', url: 'https://pokeapi.co/api/v2/pokemon-species/909/' },
      ],
    });

    const result = await resolvePokemonCandidates({ query: '', type: null, generation: 'generation-ix' });

    expect(result).toEqual([
      { id: 906, name: 'sprigatito' },
      { id: 909, name: 'fuecoco' },
    ]);
  });

  it('intersects type and generation filters', async () => {
    vi.spyOn(typeApi, 'fetchPokemonByType').mockResolvedValue({
      pokemon: [
        { slot: 1, pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } },
        { slot: 1, pokemon: { name: 'fuecoco', url: 'https://pokeapi.co/api/v2/pokemon/909/' } },
      ],
      damage_relations: { double_damage_from: [], half_damage_from: [], no_damage_from: [] },
    });
    vi.spyOn(generationApi, 'fetchGeneration').mockResolvedValue({
      pokemon_species: [{ name: 'fuecoco', url: 'https://pokeapi.co/api/v2/pokemon-species/909/' }],
    });

    const result = await resolvePokemonCandidates({ query: '', type: 'fire', generation: 'generation-ix' });

    expect(result).toEqual([{ id: 909, name: 'fuecoco' }]);
  });
});
