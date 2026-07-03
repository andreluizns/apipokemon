import type { Pokemon } from '../../types/pokemon';
import { TYPE_COLORS } from '../../constants/typeColors';
import {
  TYPE_CARD_BACKGROUND_COLORS,
  TYPE_BADGE_BACKGROUND_COLORS,
  TYPE_IMAGE_BACKGROUND_COLORS,
} from '../../constants/typeCardBackgroundColors';
import { TYPE_LABELS_PT } from '../../constants/typeLabels';
import { TYPE_ICONS } from '../../constants/typeIcons';
import type { PokemonTypeName } from '../../constants/types';
import { capitalize, formatPokedexNumber } from '../../utils/formatters';
import favoriteActiveIcon from '../../assets/icons/favorite-toggle-active.png';
import favoriteInactiveIcon from '../../assets/icons/favorite-toggle-inactive.png';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelect: (id: number) => void;
}

export function PokemonCard({ pokemon, isFavorite, onToggleFavorite, onSelect }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name as PokemonTypeName | undefined;
  const backgroundColor =
    (primaryType && (TYPE_CARD_BACKGROUND_COLORS[primaryType] ?? TYPE_COLORS[primaryType])) || '#A8A878';
  const artwork = pokemon.sprites.other['official-artwork'].front_default ?? pokemon.sprites.front_default ?? '';

  return (
    <div
      data-testid="pokemon-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(pokemon.id);
        }
      }}
      className="flex h-25.5 cursor-pointer items-center justify-between overflow-hidden rounded-2xl text-[#000000] shadow-sm"
      style={{ backgroundColor }}
    >
      <div className="py-4 pl-4">
        <p className="text-[12px] opacity-80">{formatPokedexNumber(pokemon.id)}</p>
        <h3 className="text-[21px] font-semibold">{capitalize(pokemon.name)}</h3>
        <div className="mt-2 flex gap-2">
          {pokemon.types.map((entry) => {
            const typeName = entry.type.name as PokemonTypeName;
            const icon = TYPE_ICONS[typeName];
            return (
              <span
                key={entry.type.name}
                className="flex items-center gap-1 rounded-[48.16px] px-1.5 py-1 text-[11px] font-medium text-[#000000]"
                style={{ backgroundColor: TYPE_BADGE_BACKGROUND_COLORS[typeName] ?? 'rgba(0, 0, 0, 0.2)' }}
              >
                {icon && (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
                    <img src={icon} alt="" aria-hidden className="h-2.5 w-2.5" />
                  </span>
                )}
                {TYPE_LABELS_PT[typeName] ?? capitalize(entry.type.name)}
              </span>
            );
          })}
        </div>
      </div>
      <div
        className="relative flex h-full shrink-0 items-center justify-center rounded-[15px] px-4"
        style={{
          backgroundColor: (primaryType && TYPE_IMAGE_BACKGROUND_COLORS[primaryType]) ?? 'rgba(0, 0, 0, 0.1)',
        }}
      >
        {artwork && <img src={artwork} alt={pokemon.name} className="h-[94px] w-[94px] object-contain" />}
        <button
          type="button"
          aria-label={isFavorite ? 'Desfavoritar' : 'Favoritar'}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(pokemon.id);
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center"
        >
          <img
            src={isFavorite ? favoriteActiveIcon : favoriteInactiveIcon}
            alt=""
            aria-hidden
            className="h-8 w-8 object-contain"
          />
        </button>
      </div>
    </div>
  );
}
