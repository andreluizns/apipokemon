import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EvolutionChainView } from './EvolutionChainView';
import * as pokemonApi from '../../api/pokemon';

function makePokemon(id: number, name: string) {
  return {
    id,
    name,
    height: 1,
    weight: 1,
    sprites: {
      front_default: null,
      other: { 'official-artwork': { front_default: null } },
      versions: { 'generation-v': { 'black-white': { front_default: null } } },
    },
    types: [{ slot: 1, type: { name: 'grass', url: '' } }],
    stats: [],
    abilities: [],
  };
}

describe('EvolutionChainView', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('renders each stage with its species name and the level required to reach it', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) =>
      Number(id) === 1 ? makePokemon(1, 'bulbasaur') : makePokemon(2, 'ivysaur')
    );

    render(
      <MemoryRouter>
        <EvolutionChainView
          stages={[
            [{ speciesName: 'bulbasaur', speciesId: 1, minLevel: null }],
            [{ speciesName: 'ivysaur', speciesId: 2, minLevel: 16 }],
          ]}
        />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Bulbasaur')).toBeInTheDocument());
    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText(/Nível 16/)).toBeInTheDocument();
  });

  it('renders no level connector before the first stage', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue(makePokemon(132, 'ditto'));

    render(
      <MemoryRouter>
        <EvolutionChainView stages={[[{ speciesName: 'ditto', speciesId: 132, minLevel: null }]]} />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Ditto')).toBeInTheDocument());
    expect(screen.queryByText(/Nível/)).not.toBeInTheDocument();
  });
});
