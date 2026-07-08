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
      className="flex items-center gap-3 overflow-hidden rounded-[65px] border border-neutral-200"
    >
      <div
        className="relative flex h-18.5 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{ backgroundColor }}
      >
        {watermark && (
          <img
            src={watermark}
            alt=""
            aria-hidden
            className="absolute left-1/2 top-1/2 h-16.25 w-16.25 -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        )}
        {sprite && <img src={sprite} alt={speciesName} className="relative h-12 w-12 object-contain" />}
      </div>
      <div className="w-full py-0 pr-3 md:w-auto">
        <p className="text-[16px] font-medium text-[#1A1A1A]">{capitalize(speciesName)}</p>
        <p className="text-[14px] text-[#4D4D4D]">{formatPokedexNumber(speciesId)}</p>
        {pokemon && (
          <div className="mt-1 flex gap-1">
            {pokemon.types.map((entry) => (
              <TypeBadge key={entry.type.name} type={entry.type.name as PokemonTypeName} iconOnly />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
