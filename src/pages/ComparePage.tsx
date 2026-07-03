import { useEffect, useState } from 'react';
import { fetchAllPokemonNames, fetchPokemonByNameOrId } from '../api/pokemon';
import { StatBar } from '../components/StatBar/StatBar';
import { capitalize } from '../utils/formatters';
import type { Pokemon } from '../types/pokemon';
import type { NamedAPIResource } from '../types/pokemon';

const STAT_MAX = 255;

interface PokemonStatsColumnProps {
  pokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
}

function PokemonStatsColumn({ pokemon, isLoading, error }: PokemonStatsColumnProps) {
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (isLoading) return <p className="text-sm text-neutral-400">Carregando...</p>;
  if (!pokemon) return <p className="text-sm text-neutral-400">Selecione um Pokémon</p>;
  return (
    <div>
      <h3 className="mb-2 font-semibold">{capitalize(pokemon.name)}</h3>
      {pokemon.stats.map((stat) => (
        <StatBar key={stat.stat.name} label={stat.stat.name} value={stat.base_stat} max={STAT_MAX} />
      ))}
    </div>
  );
}

export function ComparePage() {
  const [names, setNames] = useState<NamedAPIResource[]>([]);
  const [namesError, setNamesError] = useState<string | null>(null);
  const [nameA, setNameA] = useState('');
  const [nameB, setNameB] = useState('');
  const [pokemonA, setPokemonA] = useState<Pokemon | null>(null);
  const [pokemonB, setPokemonB] = useState<Pokemon | null>(null);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    fetchAllPokemonNames()
      .then((response) => {
        if (!isCancelled) setNames(response.results);
      })
      .catch((err) => {
        if (!isCancelled) setNamesError(err instanceof Error ? err.message : 'Unknown error');
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!nameA) {
      setPokemonA(null);
      setErrorA(null);
      return;
    }
    let isCancelled = false;
    setIsLoadingA(true);
    setErrorA(null);
    fetchPokemonByNameOrId(nameA)
      .then((result) => {
        if (!isCancelled) setPokemonA(result);
      })
      .catch((err) => {
        if (!isCancelled) setErrorA(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingA(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [nameA]);

  useEffect(() => {
    if (!nameB) {
      setPokemonB(null);
      setErrorB(null);
      return;
    }
    let isCancelled = false;
    setIsLoadingB(true);
    setErrorB(null);
    fetchPokemonByNameOrId(nameB)
      .then((result) => {
        if (!isCancelled) setPokemonB(result);
      })
      .catch((err) => {
        if (!isCancelled) setErrorB(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingB(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [nameB]);

  return (
    <main className="mx-auto max-w-md md:max-w-3xl px-4 pb-24 pt-6">
      <h1 className="mb-4 text-xl font-bold">Comparar Pokémons</h1>
      {namesError && <p className="mb-4 text-red-500">{namesError}</p>}

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pokemon-a" className="mb-1 block text-sm font-medium">Pokémon A</label>
          <select
            id="pokemon-a"
            aria-label="Pokémon A"
            value={nameA}
            onChange={(event) => setNameA(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 p-2"
          >
            <option value="">Selecione</option>
            {names.map((entry) => (
              <option key={entry.name} value={entry.name}>{capitalize(entry.name)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pokemon-b" className="mb-1 block text-sm font-medium">Pokémon B</label>
          <select
            id="pokemon-b"
            aria-label="Pokémon B"
            value={nameB}
            onChange={(event) => setNameB(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 p-2"
          >
            <option value="">Selecione</option>
            {names.map((entry) => (
              <option key={entry.name} value={entry.name}>{capitalize(entry.name)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PokemonStatsColumn pokemon={pokemonA} isLoading={isLoadingA} error={errorA} />
        <PokemonStatsColumn pokemon={pokemonB} isLoading={isLoadingB} error={errorB} />
      </div>
    </main>
  );
}
