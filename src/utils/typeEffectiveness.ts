import { POKEMON_TYPES, type PokemonTypeName } from '../constants/types';
import type { TypeDamageRelations } from '../types/typeDetail';

// PokeAPI has no precomputed "weaknesses" field. Each /type/{name} response
// describes what's effective AGAINST that type; for a dual-type Pokemon the
// multipliers from each of its types multiply together (e.g. a type resisted
// by one of the Pokemon's types can cancel out a weakness from the other).
export function computeWeaknesses(damageRelationsList: TypeDamageRelations[]): PokemonTypeName[] {
  return POKEMON_TYPES.filter((attackingType) => {
    const multiplier = damageRelationsList.reduce((total, relations) => {
      if (relations.no_damage_from.some((t) => t.name === attackingType)) return total * 0;
      if (relations.double_damage_from.some((t) => t.name === attackingType)) return total * 2;
      if (relations.half_damage_from.some((t) => t.name === attackingType)) return total * 0.5;
      return total;
    }, 1);
    return multiplier > 1;
  });
}
