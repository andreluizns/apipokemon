import { extractIdFromUrl } from './pokemonUrl';
import type { EvolutionChainLink } from '../types/evolution';

export interface EvolutionStage {
  speciesName: string;
  speciesId: number;
  minLevel: number | null;
}

export function flattenEvolutionChain(chain: EvolutionChainLink): EvolutionStage[][] {
  const stages: EvolutionStage[][] = [];
  let currentLevel: EvolutionChainLink[] = [chain];

  while (currentLevel.length > 0) {
    stages.push(
      currentLevel.map((link) => ({
        speciesName: link.species.name,
        speciesId: extractIdFromUrl(link.species.url),
        minLevel: link.evolution_details[0]?.min_level ?? null,
      }))
    );
    currentLevel = currentLevel.flatMap((link) => link.evolves_to);
  }

  return stages;
}
