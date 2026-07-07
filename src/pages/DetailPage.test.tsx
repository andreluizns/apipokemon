import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DetailPage } from './DetailPage';
import * as pokemonApi from '../api/pokemon';
import * as speciesApi from '../api/species';
import * as evolutionApi from '../api/evolution';
import * as typeApi from '../api/pokemonType';

function toResources(names: string[]) {
  return names.map((name) => ({ name, url: '' }));
}

describe('DetailPage', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('renders the pokemon name, types, species info and weaknesses for the routed id', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      sprites: {
        front_default: null,
        other: { 'official-artwork': { front_default: 'art.png' } },
        versions: { 'generation-v': { 'black-white': { front_default: 'pixel.png' } } },
      },
      types: [
        { slot: 1, type: { name: 'grass', url: '' } },
        { slot: 2, type: { name: 'poison', url: '' } },
      ],
      stats: [{ base_stat: 45, stat: { name: 'hp', url: '' } }],
      abilities: [{ ability: { name: 'overgrow', url: '' }, is_hidden: false }],
    });
    vi.spyOn(speciesApi, 'fetchPokemonSpecies').mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      generation: { name: 'generation-i', url: '' },
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
      genera: [{ genus: 'Seed Pokémon', language: { name: 'en', url: '' } }],
      flavor_text_entries: [
        { flavor_text: 'Uma semente estranha.', language: { name: 'pt-br', url: '' }, version: { name: 'red', url: '' } },
      ],
      gender_rate: 1,
    });
    vi.spyOn(evolutionApi, 'fetchEvolutionChain').mockResolvedValue({
      id: 1,
      chain: {
        species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        evolution_details: [],
        evolves_to: [],
      },
    });
    vi.spyOn(typeApi, 'fetchPokemonByType').mockImplementation(async (typeName) => {
      if (typeName === 'grass') {
        return {
          pokemon: [],
          damage_relations: {
            double_damage_from: toResources(['fire', 'ice', 'poison', 'flying', 'bug']),
            half_damage_from: toResources(['water', 'electric', 'grass', 'ground']),
            no_damage_from: [],
          },
        };
      }
      return {
        pokemon: [],
        damage_relations: {
          double_damage_from: toResources(['ground', 'psychic']),
          half_damage_from: toResources(['grass', 'fighting', 'poison', 'bug', 'fairy']),
          no_damage_from: [],
        },
      };
    });

    render(
      <MemoryRouter initialEntries={['/pokemon/1']}>
        <Routes>
          <Route path="/pokemon/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Bulbasaur' })).toBeInTheDocument());
    expect(screen.getByText('N°001')).toBeInTheDocument();
    expect(screen.getByText('6,9 kg')).toBeInTheDocument();
    expect(screen.getByText('0,7 m')).toBeInTheDocument();
    expect(screen.getByText('Seed')).toBeInTheDocument();
    expect(screen.getByText('Overgrow')).toBeInTheDocument();
    expect(screen.getByText('Uma semente estranha.')).toBeInTheDocument();
    expect(screen.getByText(/87,5%/)).toBeInTheDocument();
    expect(screen.getByText(/12,5%/)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Psíquico')).toBeInTheDocument());
    expect(screen.getByText('Fogo')).toBeInTheDocument();
    expect(screen.getByText('Gelo')).toBeInTheDocument();
    expect(screen.getByText('Voador')).toBeInTheDocument();

    expect(screen.queryByText('Estatísticas')).not.toBeInTheDocument();
  });
});
