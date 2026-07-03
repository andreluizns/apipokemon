import { apiGet } from './client';
import type { EvolutionChainResponse } from '../types/evolution';

// Takes the absolute evolution_chain.url from a species response, unlike the other API functions which take an id/name.
export function fetchEvolutionChain(url: string): Promise<EvolutionChainResponse> {
  return apiGet<EvolutionChainResponse>(url);
}
