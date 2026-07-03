import { fetchPokemonSpecies } from '../api/species';
import type { Pokemon } from '../types/pokemon';

export async function filterByGeneration(pokemons: Pokemon[], generation: string | null): Promise<Pokemon[]> {
  if (!generation) return pokemons;
  const species = await Promise.all(pokemons.map((pokemon) => fetchPokemonSpecies(pokemon.id)));
  return pokemons.filter((_, index) => species[index].generation.name === generation);
}
