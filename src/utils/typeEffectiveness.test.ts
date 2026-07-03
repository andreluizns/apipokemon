import { describe, it, expect } from 'vitest';
import { computeWeaknesses } from './typeEffectiveness';
import type { TypeDamageRelations } from '../types/typeDetail';

function toResources(names: string[]) {
  return names.map((name) => ({ name, url: '' }));
}

describe('computeWeaknesses', () => {
  it('computes the real Bulbasaur (grass/poison) weaknesses, including cancellations', () => {
    const grass: TypeDamageRelations = {
      double_damage_from: toResources(['fire', 'ice', 'poison', 'flying', 'bug']),
      half_damage_from: toResources(['water', 'electric', 'grass', 'ground']),
      no_damage_from: [],
    };
    const poison: TypeDamageRelations = {
      double_damage_from: toResources(['ground', 'psychic']),
      half_damage_from: toResources(['grass', 'fighting', 'poison', 'bug', 'fairy']),
      no_damage_from: [],
    };

    const weaknesses = computeWeaknesses([grass, poison]);

    // fire/ice/flying/psychic: 2x from one type, neutral from the other -> weak.
    // poison and bug: 2x from grass cancelled out by poison's own 0.5x resistance.
    // ground: 2x from poison cancelled out by grass's 0.5x resistance.
    expect(weaknesses.sort()).toEqual(['fire', 'flying', 'ice', 'psychic'].sort());
  });

  it('returns no weaknesses for a single type with no double_damage_from entries', () => {
    const normal: TypeDamageRelations = {
      double_damage_from: [],
      half_damage_from: [],
      no_damage_from: [],
    };

    expect(computeWeaknesses([normal])).toEqual([]);
  });

  it('treats no_damage_from as immunity, overriding a weakness from another type', () => {
    const weakToGhost: TypeDamageRelations = {
      double_damage_from: toResources(['ghost']),
      half_damage_from: [],
      no_damage_from: [],
    };
    const immuneToGhost: TypeDamageRelations = {
      double_damage_from: [],
      half_damage_from: [],
      no_damage_from: toResources(['ghost']),
    };

    expect(computeWeaknesses([weakToGhost, immuneToGhost])).toEqual([]);
  });
});
