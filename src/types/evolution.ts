import type { NamedAPIResource } from './pokemon';

export interface EvolutionDetail {
  trigger: NamedAPIResource;
  min_level: number | null;
  item: NamedAPIResource | null;
}

export interface EvolutionChainLink {
  species: NamedAPIResource;
  evolves_to: EvolutionChainLink[];
  evolution_details: EvolutionDetail[];
}

export interface EvolutionChainResponse {
  id: number;
  chain: EvolutionChainLink;
}
