import { useEffect, useState } from 'react';
import { fetchPokemonByNameOrId } from '../api/pokemon';
import { fetchPokemonSpecies } from '../api/species';
import type { Pokemon } from '../types/pokemon';
import type { PokemonSpecies } from '../types/species';

interface UsePokemonDetailsResult {
  pokemon: Pokemon | null;
  species: PokemonSpecies | null;
  isLoading: boolean;
  error: string | null;
}

export function usePokemonDetails(id: number): UsePokemonDetailsResult {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([fetchPokemonByNameOrId(id), fetchPokemonSpecies(id)])
      .then(([pokemonResult, speciesResult]) => {
        if (!isCancelled) {
          setPokemon(pokemonResult);
          setSpecies(speciesResult);
        }
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
  }, [id]);

  return { pokemon, species, isLoading, error };
}
