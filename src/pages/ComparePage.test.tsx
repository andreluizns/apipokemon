import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ComparePage } from './ComparePage';
import * as pokemonApi from '../api/pokemon';

function makePokemon(id: number, name: string, hp: number) {
  return {
    id, name, height: 7, weight: 69,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    stats: [{ base_stat: hp, stat: { name: 'hp', url: '' } }],
    abilities: [],
  };
}

describe('ComparePage', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('lets the user pick two pokemon by name and shows both stat sets', async () => {
    vi.spyOn(pokemonApi, 'fetchAllPokemonNames').mockResolvedValue({
      count: 2, next: null, previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    });
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (idOrName) => {
      if (String(idOrName) === '1' || idOrName === 'bulbasaur') return makePokemon(1, 'bulbasaur', 45);
      return makePokemon(4, 'charmander', 39);
    });

    render(
      <MemoryRouter>
        <ComparePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText('Pokémon A')).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText('Pokémon A'), 'bulbasaur');
    await userEvent.selectOptions(screen.getByLabelText('Pokémon B'), 'charmander');

    await waitFor(() => expect(screen.getAllByText('hp')).toHaveLength(2));
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('39')).toBeInTheDocument();
  });

  it('shows an error message when fetching a selected pokemon fails', async () => {
    vi.spyOn(pokemonApi, 'fetchAllPokemonNames').mockResolvedValue({
      count: 1, next: null, previous: null,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    });
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockRejectedValue(new Error('boom'));

    render(
      <MemoryRouter>
        <ComparePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText('Pokémon A')).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText('Pokémon A'), 'bulbasaur');

    await waitFor(() => expect(screen.getByText('boom')).toBeInTheDocument());
  });

  it('discards a stale response when the selection changes before it resolves', async () => {
    vi.spyOn(pokemonApi, 'fetchAllPokemonNames').mockResolvedValue({
      count: 2, next: null, previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    });

    let resolveBulbasaur: (value: ReturnType<typeof makePokemon>) => void = () => {};
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (idOrName) => {
      if (idOrName === 'bulbasaur') {
        return new Promise((resolve) => {
          resolveBulbasaur = resolve;
        });
      }
      return makePokemon(4, 'charmander', 39);
    });

    render(
      <MemoryRouter>
        <ComparePage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByLabelText('Pokémon A')).toBeInTheDocument());
    await userEvent.selectOptions(screen.getByLabelText('Pokémon A'), 'bulbasaur');
    await userEvent.selectOptions(screen.getByLabelText('Pokémon A'), 'charmander');

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Charmander' })).toBeInTheDocument());

    await act(async () => {
      resolveBulbasaur(makePokemon(1, 'bulbasaur', 45));
    });

    expect(screen.getByRole('heading', { name: 'Charmander' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bulbasaur' })).not.toBeInTheDocument();
  });
});
