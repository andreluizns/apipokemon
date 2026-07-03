import type { Pokemon } from '../types/pokemon';

export interface RangeFilters {
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
}

export function filterByHeightAndWeight(pokemons: Pokemon[], filters: RangeFilters): Pokemon[] {
  return pokemons.filter((pokemon) => {
    if (filters.minHeight !== null && pokemon.height < filters.minHeight) return false;
    if (filters.maxHeight !== null && pokemon.height > filters.maxHeight) return false;
    if (filters.minWeight !== null && pokemon.weight < filters.minWeight) return false;
    if (filters.maxWeight !== null && pokemon.weight > filters.maxWeight) return false;
    return true;
  });
}
