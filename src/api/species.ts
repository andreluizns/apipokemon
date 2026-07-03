import { apiGet } from './client';
import type { PokemonSpecies } from '../types/species';

export function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return apiGet<PokemonSpecies>(`/pokemon-species/${nameOrId}`);
}
