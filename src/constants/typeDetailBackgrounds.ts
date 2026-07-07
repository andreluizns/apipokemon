import type { PokemonTypeName } from './types';
import fire from '../assets/background/bg-fire.svg';
import water from '../assets/background/bg-water.svg';
import electric from '../assets/background/bg-eletric.svg';
import grass from '../assets/background/bg-grass.svg';
import ice from '../assets/background/bg-ice.svg';
import fighting from '../assets/background/bg-fighting.svg';
import poison from '../assets/background/bg-poison.svg';
import ground from '../assets/background/bg-ground.svg';
import flying from '../assets/background/bg-flying.svg';
import psychic from '../assets/background/bg-psychic.svg';
import bug from '../assets/background/bg-bug.svg';
import rock from '../assets/background/bg-rock.svg';
import ghost from '../assets/background/bg-ghost.svg';
import dragon from '../assets/background/bg-dragon.svg';
import dark from '../assets/background/bg-dark.svg';
import steel from '../assets/background/bg-steel.svg';
import fairy from '../assets/background/bg-fairy.svg';

// Decorative gradient glow shown behind the DetailPage header, per Pokemon
// type. Partial: "normal" has no asset yet, falls back to a flat backgroundColor.
export const TYPE_DETAIL_BACKGROUNDS: Partial<Record<PokemonTypeName, string>> = {
  fire,
  water,
  electric,
  grass,
  ice,
  fighting,
  poison,
  ground,
  flying,
  psychic,
  bug,
  rock,
  ghost,
  dragon,
  dark,
  steel,
  fairy,
};
