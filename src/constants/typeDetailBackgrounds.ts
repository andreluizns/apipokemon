import type { PokemonTypeName } from './types';
import fireWatermark from '../assets/background/fire-card.svg';
import waterWatermark from '../assets/background/water-card.svg';
import electricWatermark from '../assets/background/eletric-card.svg';
import grassWatermark from '../assets/background/grass-card.svg';
import iceWatermark from '../assets/background/ice-card.svg';
import fightingWatermark from '../assets/background/fighting-card.svg';
import poisonWatermark from '../assets/background/poision-card.svg';
import groundWatermark from '../assets/background/ground-card.svg';
import flyingWatermark from '../assets/background/flying-card.svg';
import psychicWatermark from '../assets/background/psychic.svg';
import bugWatermark from '../assets/background/bug-card.svg';
import rockWatermark from '../assets/background/rock-card.svg';
import ghostWatermark from '../assets/background/ghost-card.svg';
import dragonWatermark from '../assets/background/dragon-card.svg';
import darkWatermark from '../assets/background/dark-card.svg';
import steelWatermark from '../assets/background/steel-card.svg';
import fairyWatermark from '../assets/background/fairy-card.svg';

import normalBase from '../assets/background/bg-normal.svg';
import fireBase from '../assets/background/bg-fire.svg';
import waterBase from '../assets/background/bg-water.svg';
import electricBase from '../assets/background/bg-eletric.svg';
import grassBase from '../assets/background/bg-grass.svg';
import iceBase from '../assets/background/bg-ice.svg';
import fightingBase from '../assets/background/bg-fighting.svg';
import poisonBase from '../assets/background/bg-poison.svg';
import groundBase from '../assets/background/bg-ground.svg';
import flyingBase from '../assets/background/bg-flying.svg';
import psychicBase from '../assets/background/bg-psychic.svg';
import bugBase from '../assets/background/bg-bug.svg';
import rockBase from '../assets/background/bg-rock.svg';
import ghostBase from '../assets/background/bg-ghost.svg';
import dragonBase from '../assets/background/bg-dragon.svg';
import darkBase from '../assets/background/bg-dark.svg';
import steelBase from '../assets/background/bg-steel.svg';
import fairyBase from '../assets/background/bg-fairy.svg';

// Full-bleed gradient background for the DetailPage header, per type
// (bg-<type>.svg). Covers all 18 types.
export const TYPE_DETAIL_BASE_BACKGROUNDS: Record<PokemonTypeName, string> = {
  normal: normalBase,
  fire: fireBase,
  water: waterBase,
  electric: electricBase,
  grass: grassBase,
  ice: iceBase,
  fighting: fightingBase,
  poison: poisonBase,
  ground: groundBase,
  flying: flyingBase,
  psychic: psychicBase,
  bug: bugBase,
  rock: rockBase,
  ghost: ghostBase,
  dragon: dragonBase,
  dark: darkBase,
  steel: steelBase,
  fairy: fairyBase,
};

// Decorative watermark (leaf/flame/wave/etc, matching the type's own motif)
// layered on top of the base background, shown behind the DetailPage header
// sprite and the EvolutionStageCard avatar circle. Partial: "normal" has no
// asset yet, renders with the base background only, no watermark.
export const TYPE_DETAIL_BACKGROUNDS: Partial<Record<PokemonTypeName, string>> = {
  fire: fireWatermark,
  water: waterWatermark,
  electric: electricWatermark,
  grass: grassWatermark,
  ice: iceWatermark,
  fighting: fightingWatermark,
  poison: poisonWatermark,
  ground: groundWatermark,
  flying: flyingWatermark,
  psychic: psychicWatermark,
  bug: bugWatermark,
  rock: rockWatermark,
  ghost: ghostWatermark,
  dragon: dragonWatermark,
  dark: darkWatermark,
  steel: steelWatermark,
  fairy: fairyWatermark,
};
