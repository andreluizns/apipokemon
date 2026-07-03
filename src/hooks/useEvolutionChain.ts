import { useEffect, useState } from 'react';
import { fetchEvolutionChain } from '../api/evolution';
import { flattenEvolutionChain, type EvolutionStage } from '../utils/evolutionChain';

interface UseEvolutionChainResult {
  stages: EvolutionStage[][];
  isLoading: boolean;
  error: string | null;
}

// Takes the evolution_chain.url already fetched via usePokemonDetails/fetchPokemonSpecies,
// rather than re-fetching the species endpoint here.
export function useEvolutionChain(evolutionChainUrl: string | null): UseEvolutionChainResult {
  const [stages, setStages] = useState<EvolutionStage[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!evolutionChainUrl) return;
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetchEvolutionChain(evolutionChainUrl)
      .then((evolutionChain) => {
        if (!isCancelled) setStages(flattenEvolutionChain(evolutionChain.chain));
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
  }, [evolutionChainUrl]);

  return { stages, isLoading, error };
}
