import type { PokemonTypeName } from './types';

// Pastel background colors for PokemonCard, distinct from the more saturated
// TYPE_COLORS used for badges/pills elsewhere.
export const TYPE_CARD_BACKGROUND_COLORS: Partial<Record<PokemonTypeName, string>> = {
  normal: '#F1F2F3',
  fire: '#FCF3EB',
  water: '#EBF1F8',
  electric: '#FBF8E9',
  grass: '#EDF6EC',
  ice: '#F1FBF9',
  fighting: '#F8E9EE',
  poison: '#F5EDF8',
  ground: '#F9EFEA',
  flying: '#F1F4FA',
  psychic: '#FCEEEF',
  bug: '#F1F6E8',
  rock: '#F7F5F1',
  ghost: '#EBEDF4',
  dragon: '#E4EEF6',
  dark: '#ECEBED',
  steel: '#ECF1F3',
  fairy: '#FBF1FA',
};

// Background for each type badge (pill) on PokemonCard.
export const TYPE_BADGE_BACKGROUND_COLORS: Record<PokemonTypeName, string> = {
  normal: '#919AA2',
  fire: '#FF9D55',
  water: '#5090D6',
  electric: '#F4D23C',
  grass: '#63BC5A',
  ice: '#73CEC0',
  fighting: '#CE416B',
  poison: '#B567CE',
  ground: '#D97845',
  flying: '#89AAE3',
  psychic: '#FA7179',
  bug: '#91C12F',
  rock: '#C5B78C',
  ghost: '#5269AD',
  dragon: '#0B6DC3',
  dark: '#5A5465',
  steel: '#5A8EA2',
  fairy: '#EC8FE6',
};

// Background for the div wrapping the sprite on PokemonCard (same palette
// as the badges).
export const TYPE_IMAGE_BACKGROUND_COLORS: Record<PokemonTypeName, string> = TYPE_BADGE_BACKGROUND_COLORS;
