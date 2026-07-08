import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EvolutionStageCard } from './EvolutionStageCard';
import * as pokemonApi from '../../api/pokemon';

describe('EvolutionStageCard', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('fetches and renders the species name, pokedex number and type badges', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue({
      id: 2,
      name: 'ivysaur',
      height: 10,
      weight: 130,
      sprites: {
        front_default: null,
        other: { 'official-artwork': { front_default: null } },
        versions: { 'generation-v': { 'black-white': { front_default: 'ivysaur.png' } } },
      },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }],
      stats: [],
      abilities: [],
    });

    render(
      <MemoryRouter>
        <EvolutionStageCard speciesId={2} speciesName="ivysaur" />
      </MemoryRouter>
    );

    expect(screen.getByText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByText('N°002')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('img', { name: 'Grama' })).toBeInTheDocument());
    expect(screen.getByRole('img', { name: 'ivysaur' })).toHaveAttribute('src', 'ivysaur.png');
  });

  it('links to the species detail page', () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <EvolutionStageCard speciesId={2} speciesName="ivysaur" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/2');
  });
});
