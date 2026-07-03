import { useEffect, useState } from 'react';
import { fetchPokemonByType } from '../api/pokemonType';
import { computeWeaknesses } from '../utils/typeEffectiveness';
import type { PokemonTypeName } from '../constants/types';

export function useWeaknesses(types: PokemonTypeName[]): PokemonTypeName[] {
  const [weaknesses, setWeaknesses] = useState<PokemonTypeName[]>([]);
  const typesKey = types.join(',');

  useEffect(() => {
    if (typesKey === '') {
      setWeaknesses([]);
      return;
    }
    let isCancelled = false;

    Promise.all(typesKey.split(',').map((type) => fetchPokemonByType(type)))
      .then((details) => {
        if (!isCancelled) setWeaknesses(computeWeaknesses(details.map((d) => d.damage_relations)));
      })
      .catch(() => {
        if (!isCancelled) setWeaknesses([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [typesKey]);

  return weaknesses;
}
