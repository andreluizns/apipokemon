import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesPage } from './FavoritesPage';
import { useFavoritesStore } from '../store/favoritesStore';
import * as pokemonApi from '../api/pokemon';
import type { Pokemon } from '../types/pokemon';

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it('shows an empty state when there are no favorites', () => {
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/nenhum favorito/i)).toBeInTheDocument();
  });

  it('fetches and renders details for each favorited id', async () => {
    useFavoritesStore.setState({ favoriteIds: [1] });
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue({
      id: 1, name: 'bulbasaur', height: 7, weight: 69,
      sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }], stats: [], abilities: [],
    });

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());
  });

  it('shows an error message when fetching a favorite fails', async () => {
    useFavoritesStore.setState({ favoriteIds: [1] });
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockRejectedValue(new Error('boom'));

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
  });

  it('removes a card immediately when unfavorited, without waiting for a refetch', async () => {
    useFavoritesStore.setState({ favoriteIds: [1, 2] });
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => ({
      id: Number(id),
      name: Number(id) === 1 ? 'bulbasaur' : 'ivysaur',
      height: 7,
      weight: 69,
      sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      stats: [],
      abilities: [],
    }));

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Ivysaur')).toBeInTheDocument());

    act(() => {
      useFavoritesStore.setState({ favoriteIds: [1] });
    });

    expect(screen.queryByText('Ivysaur')).not.toBeInTheDocument();
  });

  it('clears the loading state when favorites are removed while a fetch is in flight', async () => {
    useFavoritesStore.setState({ favoriteIds: [1] });
    let resolveFetch: (value: Pokemon) => void = () => {};
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(
      () => new Promise((resolve) => { resolveFetch = resolve; })
    );

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Carregando...')).toBeInTheDocument());

    act(() => {
      useFavoritesStore.setState({ favoriteIds: [] });
    });

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    expect(screen.getByText(/nenhum favorito/i)).toBeInTheDocument();

    resolveFetch({
      id: 1, name: 'bulbasaur', height: 7, weight: 69,
      sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
      types: [], stats: [], abilities: [],
    });
  });
});
