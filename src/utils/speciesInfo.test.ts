import { describe, it, expect } from 'vitest';
import { getGenus, getFlavorText, computeGenderRatio } from './speciesInfo';
import type { PokemonSpecies } from '../types/species';

function makeSpecies(overrides: Partial<PokemonSpecies> = {}): PokemonSpecies {
  return {
    id: 1,
    name: 'bulbasaur',
    generation: { name: 'generation-i', url: '' },
    evolution_chain: { url: '' },
    genera: [],
    flavor_text_entries: [],
    gender_rate: -1,
    ...overrides,
  };
}

describe('getGenus', () => {
  it('strips the trailing "Pokémon" from the English genus', () => {
    const species = makeSpecies({
      genera: [{ genus: 'Seed Pokémon', language: { name: 'en', url: '' } }],
    });
    expect(getGenus(species)).toBe('Seed');
  });

  it('returns null when no English genus entry exists', () => {
    const species = makeSpecies({ genera: [{ genus: 'Graine', language: { name: 'fr', url: '' } }] });
    expect(getGenus(species)).toBeNull();
  });
});

describe('getFlavorText', () => {
  it('prefers the pt-br entry when available', () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: 'A strange seed.', language: { name: 'en', url: '' }, version: { name: 'red', url: '' } },
        { flavor_text: 'Uma semente estranha.', language: { name: 'pt-br', url: '' }, version: { name: 'red', url: '' } },
      ],
    });
    expect(getFlavorText(species)).toBe('Uma semente estranha.');
  });

  it('falls back to English when no pt-br entry exists', () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: 'A strange seed.', language: { name: 'en', url: '' }, version: { name: 'red', url: '' } },
      ],
    });
    expect(getFlavorText(species)).toBe('A strange seed.');
  });

  it('collapses embedded newlines and form-feed characters into spaces', () => {
    const species = makeSpecies({
      flavor_text_entries: [
        { flavor_text: 'A strange seed\nwas planted\fon its back.', language: { name: 'en', url: '' }, version: { name: 'red', url: '' } },
      ],
    });
    expect(getFlavorText(species)).toBe('A strange seed was planted on its back.');
  });

  it('returns null when there are no entries at all', () => {
    expect(getFlavorText(makeSpecies())).toBeNull();
  });
});

describe('computeGenderRatio', () => {
  it('computes the male/female split for a normal gender rate', () => {
    expect(computeGenderRatio(1)).toEqual({ malePercent: 87.5, femalePercent: 12.5 });
  });

  it('returns null for genderless species (gender_rate -1)', () => {
    expect(computeGenderRatio(-1)).toBeNull();
  });

  it('computes a fully female species (gender_rate 8)', () => {
    expect(computeGenderRatio(8)).toEqual({ malePercent: 0, femalePercent: 100 });
  });
});
