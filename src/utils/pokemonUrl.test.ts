import { describe, it, expect } from 'vitest';
import { extractIdFromUrl } from './pokemonUrl';

describe('extractIdFromUrl', () => {
  it('extracts the trailing numeric id from a PokeAPI URL', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('works without a trailing slash', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon-species/1')).toBe(1);
  });

  it('throws when the URL has no trailing id', () => {
    expect(() => extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/')).toThrow();
  });
});
