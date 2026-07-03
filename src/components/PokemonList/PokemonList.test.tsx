import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PokemonList } from './PokemonList';
import type { Pokemon } from '../../types/pokemon';

function makePokemon(id: number): Pokemon {
  return {
    id,
    name: `pokemon-${id}`,
    height: 1,
    weight: 1,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [{ slot: 1, type: { name: 'normal', url: '' } }],
    stats: [],
    abilities: [],
  };
}

describe('PokemonList', () => {
  it('renders one card per pokemon', () => {
    const pokemons = [makePokemon(1), makePokemon(2), makePokemon(3)];
    render(
      <PokemonList pokemons={pokemons} favoriteIds={[2]} onToggleFavorite={vi.fn()} onSelect={vi.fn()} />
    );

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(3);
  });

  it('marks only the pokemon whose id is in favoriteIds as favorited', () => {
    const pokemons = [makePokemon(1), makePokemon(2), makePokemon(3)];
    render(
      <PokemonList pokemons={pokemons} favoriteIds={[2]} onToggleFavorite={vi.fn()} onSelect={vi.fn()} />
    );

    expect(screen.getAllByRole('button', { name: /^favoritar$/i })).toHaveLength(2);
    expect(screen.getByRole('button', { name: /^desfavoritar$/i })).toBeInTheDocument();
  });
});
