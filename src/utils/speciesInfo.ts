import type { PokemonSpecies } from '../types/species';

export interface GenderRatio {
  malePercent: number;
  femalePercent: number;
}

// genus is fetched in English on purpose (e.g. "Seed Pokémon" -> "Seed"),
// matching the reference design rather than a literal pt-BR translation.
export function getGenus(species: PokemonSpecies): string | null {
  const entry = species.genera.find((g) => g.language.name === 'en');
  if (!entry) return null;
  return entry.genus.replace(/\s*Pokémon\s*$/i, '').trim();
}

export function getFlavorText(species: PokemonSpecies): string | null {
  const entries = species.flavor_text_entries;
  const localized = entries.find((e) => e.language.name === 'pt-br' || e.language.name === 'pt');
  const entry = localized ?? entries.find((e) => e.language.name === 'en');
  if (!entry) return null;
  return entry.flavor_text.replace(/[\n\f\r]+/g, ' ').trim();
}

// gender_rate is in eighths-female, from -1 (genderless) to 8 (always female).
export function computeGenderRatio(genderRate: number): GenderRatio | null {
  if (genderRate < 0) return null;
  const femalePercent = (genderRate / 8) * 100;
  return { malePercent: 100 - femalePercent, femalePercent };
}
