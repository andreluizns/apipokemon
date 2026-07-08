import { apiGet } from './client';
import type { GenerationDetail } from '../types/generation';

export function fetchGeneration(name: string): Promise<GenerationDetail> {
  return apiGet<GenerationDetail>(`/generation/${name}`);
}
