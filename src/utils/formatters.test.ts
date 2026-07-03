import { describe, it, expect } from 'vitest';
import { formatPokedexNumber, capitalize, formatWeightKg, formatHeightM } from './formatters';

describe('formatPokedexNumber', () => {
  it('pads to 3 digits with a N° prefix', () => {
    expect(formatPokedexNumber(1)).toBe('N°001');
    expect(formatPokedexNumber(25)).toBe('N°025');
    expect(formatPokedexNumber(150)).toBe('N°150');
  });

  it('does not truncate ids with more than 3 digits', () => {
    expect(formatPokedexNumber(1010)).toBe('N°1010');
  });
});

describe('capitalize', () => {
  it('uppercases only the first letter', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });
});

describe('formatWeightKg', () => {
  it('converts hectograms to a pt-BR formatted kg string', () => {
    expect(formatWeightKg(69)).toBe('6,9 kg');
  });
});

describe('formatHeightM', () => {
  it('converts decimeters to a pt-BR formatted meter string', () => {
    expect(formatHeightM(7)).toBe('0,7 m');
  });
});
