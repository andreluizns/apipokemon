import type { PokemonTypeName } from './types';
import fire from '../assets/background/fire-card.svg';
import water from '../assets/background/water-card.svg';
import electric from '../assets/background/eletric-card.svg';
import grass from '../assets/background/grass-card.svg';
import ice from '../assets/background/ice-card.svg';
import fighting from '../assets/background/fighting-card.svg';
import poison from '../assets/background/poision-card.svg';
import ground from '../assets/background/ground-card.svg';
import flying from '../assets/background/flying-card.svg';
import psychic from '../assets/background/psychic.svg';
import bug from '../assets/background/bug-card.svg';
import rock from '../assets/background/rock-card.svg';
import ghost from '../assets/background/ghost-card.svg';
import dragon from '../assets/background/dragon-card.svg';
import dark from '../assets/background/dark-card.svg';
import steel from '../assets/background/steel-card.svg';
import fairy from '../assets/background/fairy-card.svg';

// Decorative watermark (leaf/flame/wave/etc, matching the type's own motif)
// shown behind the DetailPage header sprite and the EvolutionStageCard
// avatar circle. Partial: "normal" has no asset yet, falls back to a flat
// backgroundColor with no watermark.
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
