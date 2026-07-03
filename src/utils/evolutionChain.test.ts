import { describe, it, expect } from 'vitest';
import { flattenEvolutionChain } from './evolutionChain';
import type { EvolutionChainLink } from '../types/evolution';

describe('flattenEvolutionChain', () => {
  it('flattens a linear chain into one stage per generation, carrying the min level to evolve', () => {
    const chain: EvolutionChainLink = {
      species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
      evolution_details: [],
      evolves_to: [{
        species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
        evolution_details: [{ trigger: { name: 'level-up', url: '' }, min_level: 16, item: null }],
        evolves_to: [{
          species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
          evolution_details: [{ trigger: { name: 'level-up', url: '' }, min_level: 36, item: null }],
          evolves_to: [],
        }],
      }],
    };

    expect(flattenEvolutionChain(chain)).toEqual([
      [{ speciesName: 'bulbasaur', speciesId: 1, minLevel: null }],
      [{ speciesName: 'ivysaur', speciesId: 2, minLevel: 16 }],
      [{ speciesName: 'venusaur', speciesId: 3, minLevel: 36 }],
    ]);
  });

  it('handles branching evolutions (e.g. Eevee) as multiple entries in one stage', () => {
    const chain: EvolutionChainLink = {
      species: { name: 'eevee', url: 'https://pokeapi.co/api/v2/pokemon-species/133/' },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: 'vaporeon', url: 'https://pokeapi.co/api/v2/pokemon-species/134/' },
          evolution_details: [{ trigger: { name: 'use-item', url: '' }, min_level: null, item: { name: 'water-stone', url: '' } }],
          evolves_to: [],
        },
        {
          species: { name: 'jolteon', url: 'https://pokeapi.co/api/v2/pokemon-species/135/' },
          evolution_details: [{ trigger: { name: 'use-item', url: '' }, min_level: null, item: { name: 'thunder-stone', url: '' } }],
          evolves_to: [],
        },
      ],
    };

    const result = flattenEvolutionChain(chain);

    expect(result[0]).toEqual([{ speciesName: 'eevee', speciesId: 133, minLevel: null }]);
    expect(result[1]).toEqual([
      { speciesName: 'vaporeon', speciesId: 134, minLevel: null },
      { speciesName: 'jolteon', speciesId: 135, minLevel: null },
    ]);
  });
});
