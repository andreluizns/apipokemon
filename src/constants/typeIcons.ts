import type { PokemonTypeName } from './types';
import water from '../assets/icons/types/water.svg';
import dragon from '../assets/icons/types/dragon.svg';
import electric from '../assets/icons/types/electric.svg';
import fairy from '../assets/icons/types/fairy.svg';
import ghost from '../assets/icons/types/ghost.svg';
import fire from '../assets/icons/types/fire.svg';
import grass from '../assets/icons/types/grass.svg';
import bug from '../assets/icons/types/bug.svg';
import fighting from '../assets/icons/types/fighting.svg';
import normal from '../assets/icons/types/normal.svg';
import dark from '../assets/icons/types/dark.svg';
import steel from '../assets/icons/types/steel.svg';
import rock from '../assets/icons/types/rock.svg';
import psychic from '../assets/icons/types/psychic.svg';
import ground from '../assets/icons/types/ground.svg';
import poison from '../assets/icons/types/poison.svg';
import flying from '../assets/icons/types/flying.svg';

// Icon per type for the badge/pill shown on PokemonCard. Partial: "ice" has
// no icon asset yet, badges for it render without one.
export const TYPE_ICONS: Partial<Record<PokemonTypeName, string>> = {
  water,
  dragon,
  electric,
  fairy,
  ghost,
  fire,
  grass,
  bug,
  fighting,
  normal,
  dark,
  steel,
  rock,
  psychic,
  ground,
  poison,
  flying,
};
