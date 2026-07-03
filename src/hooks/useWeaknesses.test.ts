import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeaknesses } from './useWeaknesses';
import * as typeApi from '../api/pokemonType';

function toResources(names: string[]) {
  return names.map((name) => ({ name, url: '' }));
}

describe('useWeaknesses', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('computes weaknesses from the damage relations of each of the pokemon types', async () => {
    vi.spyOn(typeApi, 'fetchPokemonByType').mockImplementation(async (typeName) => {
      if (typeName === 'grass') {
        return {
          pokemon: [],
          damage_relations: {
            double_damage_from: toResources(['fire', 'ice', 'poison', 'flying', 'bug']),
            half_damage_from: toResources(['water', 'electric', 'grass', 'ground']),
            no_damage_from: [],
          },
        };
      }
      return {
        pokemon: [],
        damage_relations: {
          double_damage_from: toResources(['ground', 'psychic']),
          half_damage_from: toResources(['grass', 'fighting', 'poison', 'bug', 'fairy']),
          no_damage_from: [],
        },
      };
    });

    const { result } = renderHook(() => useWeaknesses(['grass', 'poison']));

    await waitFor(() => expect(result.current).toHaveLength(4));
    expect(result.current.sort()).toEqual(['fire', 'flying', 'ice', 'psychic'].sort());
  });

  it('returns an empty array when given no types', () => {
    const fetchSpy = vi.spyOn(typeApi, 'fetchPokemonByType');

    const { result } = renderHook(() => useWeaknesses([]));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current).toEqual([]);
  });
});
