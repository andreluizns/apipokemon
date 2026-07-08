import { fetchAllPokemonNames } from './pokemon';
import { fetchPokemonByType } from './pokemonType';
import { fetchGeneration } from './generation';
import { extractIdFromUrl } from '../utils/pokemonUrl';

export interface PokemonCandidate {
  id: number;
  name: string;
}

export interface CandidateFilters {
  query: string;
  type: string | null;
  generation: string | null;
}

function intersectById(sources: PokemonCandidate[][]): PokemonCandidate[] {
  const [first, ...rest] = sources;
  return first.filter((candidate) => rest.every((source) => source.some((entry) => entry.id === candidate.id)));
}

export async function resolvePokemonCandidates(filters: CandidateFilters): Promise<PokemonCandidate[]> {
  const sources: PokemonCandidate[][] = [];

  if (filters.type) {
    const typeDetail = await fetchPokemonByType(filters.type);
    sources.push(
      typeDetail.pokemon.map((entry) => ({ id: extractIdFromUrl(entry.pokemon.url), name: entry.pokemon.name }))
    );
  }

  if (filters.generation) {
    const generationDetail = await fetchGeneration(filters.generation);
    sources.push(
      generationDetail.pokemon_species.map((entry) => ({ id: extractIdFromUrl(entry.url), name: entry.name }))
    );
  }

  let candidates: PokemonCandidate[];
  if (sources.length === 0) {
    const allNames = await fetchAllPokemonNames();
    candidates = allNames.results.map((entry) => ({ id: extractIdFromUrl(entry.url), name: entry.name }));
  } else if (sources.length === 1) {
    candidates = sources[0];
  } else {
    candidates = intersectById(sources);
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (normalizedQuery) {
    candidates = candidates.filter((candidate) => candidate.name.includes(normalizedQuery));
  }

  return candidates;
}
