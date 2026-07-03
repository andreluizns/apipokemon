import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPokemonByNameOrId } from '../../api/pokemon';
import { TYPE_COLORS } from '../../constants/typeColors';
import { TYPE_LABELS_PT } from '../../constants/typeLabels';
import type { PokemonTypeName } from '../../constants/types';
import { capitalize, formatPokedexNumber } from '../../utils/formatters';
import type { Pokemon } from '../../types/pokemon';

interface EvolutionStageCardProps {
  speciesId: number;
  speciesName: string;
}

export function EvolutionStageCard({ speciesId, speciesName }: EvolutionStageCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    let isCancelled = false;
    fetchPokemonByNameOrId(speciesId).then((result) => {
      if (!isCancelled) setPokemon(result);
    });
    return () => {
      isCancelled = true;
    };
  }, [speciesId]);

  const primaryType = pokemon?.types[0]?.type.name as PokemonTypeName | undefined;
  const backgroundColor = (primaryType && TYPE_COLORS[primaryType]) || '#A8A878';
  const sprite = pokemon?.sprites.versions['generation-v']['black-white'].front_default ?? pokemon?.sprites.front_default ?? '';

  return (
    <Link
      to={`/pokemon/${speciesId}`}
      className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3"
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor }}
      >
        {sprite && <img src={sprite} alt={speciesName} className="h-10 w-10 object-contain" />}
      </div>
      <div>
        <p className="font-semibold">{capitalize(speciesName)}</p>
        <p className="text-xs text-neutral-500">{formatPokedexNumber(speciesId)}</p>
        {pokemon && (
          <div className="mt-1 flex gap-1">
            {pokemon.types.map((entry) => (
              <span
                key={entry.type.name}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                style={{ backgroundColor: TYPE_COLORS[entry.type.name as PokemonTypeName] }}
              >
                {TYPE_LABELS_PT[entry.type.name as PokemonTypeName] ?? capitalize(entry.type.name)}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
