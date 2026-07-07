import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPokemonByNameOrId } from '../../api/pokemon';
import { TYPE_BADGE_BACKGROUND_COLORS } from '../../constants/typeCardBackgroundColors';
import { TYPE_DETAIL_BACKGROUNDS } from '../../constants/typeDetailBackgrounds';
import { TypeBadge } from '../TypeBadge/TypeBadge';
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
  const backgroundColor = (primaryType && TYPE_BADGE_BACKGROUND_COLORS[primaryType]) || '#A8A878';
  const watermark = primaryType && TYPE_DETAIL_BACKGROUNDS[primaryType];
  const sprite = pokemon?.sprites.versions['generation-v']['black-white'].front_default ?? pokemon?.sprites.front_default ?? '';

  return (
    <Link
      to={`/pokemon/${speciesId}`}
      className="flex items-center gap-3 rounded-2xl border border-neutral-200 p-3"
    >
      <div
        className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor }}
      >
        {watermark && <img src={watermark} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />}
        {sprite && <img src={sprite} alt={speciesName} className="relative h-10 w-10 object-contain" />}
      </div>
      <div>
        <p className="font-semibold">{capitalize(speciesName)}</p>
        <p className="text-xs text-neutral-500">{formatPokedexNumber(speciesId)}</p>
        {pokemon && (
          <div className="mt-1 flex gap-1">
            {pokemon.types.map((entry) => (
              <TypeBadge key={entry.type.name} type={entry.type.name as PokemonTypeName} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
