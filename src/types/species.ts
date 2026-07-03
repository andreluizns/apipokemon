import type { NamedAPIResource } from './pokemon';

export interface PokemonGenus {
  genus: string;
  language: NamedAPIResource;
}

export interface PokemonFlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  generation: NamedAPIResource;
  evolution_chain: { url: string };
  genera: PokemonGenus[];
  flavor_text_entries: PokemonFlavorTextEntry[];
  gender_rate: number;
}
