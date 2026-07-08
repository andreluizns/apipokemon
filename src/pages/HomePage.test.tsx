import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import * as pokemonApi from '../api/pokemon';
import * as candidatesApi from '../api/resolvePokemonCandidates';
import { useFavoritesStore } from '../store/favoritesStore';
import type { Pokemon } from '../types/pokemon';

function makePokemon(): Pokemon {
  return {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    stats: [],
    abilities: [],
  };
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it('renders fetched pokemon and toggles favorites through the store', async () => {
    vi.spyOn(candidatesApi, 'resolvePokemonCandidates').mockResolvedValue([{ id: 1, name: 'bulbasaur' }]);
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue(makePokemon());

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /favoritar/i }));

    expect(useFavoritesStore.getState().favoriteIds).toEqual([1]);
  });

  it('filters the list by name as the user types', async () => {
    const resolveSpy = vi
      .spyOn(candidatesApi, 'resolvePokemonCandidates')
      .mockResolvedValue([{ id: 1, name: 'bulbasaur' }]);
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue(makePokemon());

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());
    expect(resolveSpy).toHaveBeenLastCalledWith({ query: '', type: null });

    await userEvent.type(screen.getByPlaceholderText('Procurar Pokémon...'), 'char');

    await waitFor(
      () => expect(resolveSpy).toHaveBeenLastCalledWith({ query: 'char', type: null }),
      { timeout: 3000 }
    );
  });

  it('shows a no-results message and hides Carregar mais when nothing matches', async () => {
    vi.spyOn(candidatesApi, 'resolvePokemonCandidates').mockResolvedValue([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Nenhum resultado encontrado.')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument();
  });
});
