import { apiGet } from './client';
import type { PokemonTypeDetail } from '../types/typeDetail';

export function fetchPokemonByType(typeName: string): Promise<PokemonTypeDetail> {
  return apiGet<PokemonTypeDetail>(`/type/${typeName}`);
}
