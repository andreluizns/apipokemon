import type { NamedAPIResource } from './pokemon';

export interface TypeDamageRelations {
  double_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
}

export interface PokemonTypeDetail {
  pokemon: { pokemon: NamedAPIResource; slot: number }[];
  damage_relations: TypeDamageRelations;
}
