import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonCard } from './PokemonCard';
import type { Pokemon } from '../../types/pokemon';

const bulbasaur: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { front_default: 'sprite.png', other: { 'official-artwork': { front_default: 'art.png' } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
  types: [{ slot: 1, type: { name: 'grass', url: '' } }, { slot: 2, type: { name: 'poison', url: '' } }],
  stats: [],
  abilities: [],
};

describe('PokemonCard', () => {
  it('renders the pokedex number, name, types and sprite', () => {
    render(<PokemonCard pokemon={bulbasaur} isFavorite={false} onToggleFavorite={vi.fn()} onSelect={vi.fn()} />);

    expect(screen.getByText('N°001')).toBeInTheDocument();
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Grama')).toBeInTheDocument();
    expect(screen.getByText('Venenoso')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'bulbasaur' })).toHaveAttribute('src', 'art.png');
  });

  it('calls onSelect with the pokemon id when the card is clicked', async () => {
    const onSelect = vi.fn();
    render(<PokemonCard pokemon={bulbasaur} isFavorite={false} onToggleFavorite={vi.fn()} onSelect={onSelect} />);

    await userEvent.click(screen.getByTestId('pokemon-card'));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('calls onToggleFavorite without triggering onSelect when the heart is clicked', async () => {
    const onSelect = vi.fn();
    const onToggleFavorite = vi.fn();
    render(<PokemonCard pokemon={bulbasaur} isFavorite={false} onToggleFavorite={onToggleFavorite} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button', { name: /favoritar/i }));

    expect(onToggleFavorite).toHaveBeenCalledWith(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows a filled favorite state when isFavorite is true', () => {
    render(<PokemonCard pokemon={bulbasaur} isFavorite onToggleFavorite={vi.fn()} onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: /desfavoritar/i })).toBeInTheDocument();
  });
});
