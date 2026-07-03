import { apiGet } from './client';
import type { PokemonListResponse, Pokemon } from '../types/pokemon';

export function fetchPokemonList(limit: number, offset: number): Promise<PokemonListResponse> {
  return apiGet<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
}

export function fetchPokemonByNameOrId(nameOrId: string | number): Promise<Pokemon> {
  return apiGet<Pokemon>(`/pokemon/${nameOrId}`);
}

// PokeAPI has no text-search endpoint; fetch the whole name list once (limit exceeds the ~1300 total) for client-side filtering.
export function fetchAllPokemonNames(): Promise<PokemonListResponse> {
  return apiGet<PokemonListResponse>(`/pokemon?limit=100000&offset=0`);
}
