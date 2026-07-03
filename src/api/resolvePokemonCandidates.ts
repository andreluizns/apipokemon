import { fetchAllPokemonNames } from './pokemon';
import { fetchPokemonByType } from './pokemonType';
import { extractIdFromUrl } from '../utils/pokemonUrl';

export interface PokemonCandidate {
  id: number;
  name: string;
}

export interface CandidateFilters {
  query: string;
  type: string | null;
}

export async function resolvePokemonCandidates(filters: CandidateFilters): Promise<PokemonCandidate[]> {
  let candidates: PokemonCandidate[];

  if (filters.type) {
    const typeDetail = await fetchPokemonByType(filters.type);
    candidates = typeDetail.pokemon.map((entry) => ({
      id: extractIdFromUrl(entry.pokemon.url),
      name: entry.pokemon.name,
    }));
  } else {
    const allNames = await fetchAllPokemonNames();
    candidates = allNames.results.map((entry) => ({
      id: extractIdFromUrl(entry.url),
      name: entry.name,
    }));
  }

  const normalizedQuery = filters.query.trim().toLowerCase();
  if (normalizedQuery) {
    candidates = candidates.filter((candidate) => candidate.name.includes(normalizedQuery));
  }

  return candidates;
}
