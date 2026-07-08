import { useEffect, useState } from 'react';
import { fetchPokemonByNameOrId } from '../api/pokemon';
import { resolvePokemonCandidates, type PokemonCandidate } from '../api/resolvePokemonCandidates';
import type { Pokemon } from '../types/pokemon';
import { filterByHeightAndWeight } from '../utils/filterPokemonDetails';

const PAGE_SIZE = 20;

export interface PokemonFilters {
  query: string;
  type: string | null;
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  generation: string | null;
}

export const DEFAULT_FILTERS: PokemonFilters = {
  query: '',
  type: null,
  minHeight: null,
  maxHeight: null,
  minWeight: null,
  maxWeight: null,
  generation: null,
};

interface UsePokemonExplorerResult {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function usePokemonExplorer(filters: PokemonFilters): UsePokemonExplorerResult {
  const [candidates, setCandidates] = useState<PokemonCandidate[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setCandidates(null);
    setVisibleCount(PAGE_SIZE);
    setIsLoading(true);
    setError(null);

    resolvePokemonCandidates({ query: filters.query, type: filters.type, generation: filters.generation })
      .then((result) => {
        if (!isCancelled) setCandidates(result);
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [filters.query, filters.type, filters.generation]);

  useEffect(() => {
    if (!candidates) return;
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    const idsToLoad = candidates.slice(0, visibleCount).map((candidate) => candidate.id);

    Promise.all(idsToLoad.map((id) => fetchPokemonByNameOrId(id)))
      .then((details) => filterByHeightAndWeight(details, filters))
      .then((details) => {
        if (!isCancelled) setPokemons(details);
      })
      .catch((err) => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [candidates, visibleCount, filters.minHeight, filters.maxHeight, filters.minWeight, filters.maxWeight]);

  const hasMore = candidates !== null && visibleCount < candidates.length;

  const loadMore = () => {
    if (!hasMore) return;
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return { pokemons, isLoading, error, hasMore, loadMore };
}
