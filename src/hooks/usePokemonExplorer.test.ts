import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePokemonExplorer, DEFAULT_FILTERS } from './usePokemonExplorer';
import * as candidatesApi from '../api/resolvePokemonCandidates';
import * as pokemonApi from '../api/pokemon';
import type { Pokemon } from '../types/pokemon';

function makePokemon(id: number): Pokemon {
  return {
    id,
    name: `pokemon-${id}`,
    height: 10,
    weight: 100,
    sprites: { front_default: null, other: { 'official-artwork': { front_default: null } }, versions: { 'generation-v': { 'black-white': { front_default: null } } } },
    types: [],
    stats: [],
    abilities: [],
  };
}

describe('usePokemonExplorer', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('loads the first page of candidates and their details', async () => {
    vi.spyOn(candidatesApi, 'resolvePokemonCandidates').mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `pokemon-${i + 1}` }))
    );
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => makePokemon(Number(id)));

    const { result } = renderHook(() => usePokemonExplorer(DEFAULT_FILTERS));

    await waitFor(() => expect(result.current.pokemons).toHaveLength(20));
    expect(result.current.hasMore).toBe(true);
  });

  it('loadMore reveals the next batch of already-resolved candidates', async () => {
    vi.spyOn(candidatesApi, 'resolvePokemonCandidates').mockResolvedValue(
      Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `pokemon-${i + 1}` }))
    );
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => makePokemon(Number(id)));

    const { result } = renderHook(() => usePokemonExplorer(DEFAULT_FILTERS));
    await waitFor(() => expect(result.current.pokemons).toHaveLength(20));

    act(() => result.current.loadMore());

    await waitFor(() => expect(result.current.pokemons).toHaveLength(25));
    expect(result.current.hasMore).toBe(false);
  });

  it('re-resolves candidates when filters change', async () => {
    const resolveSpy = vi
      .spyOn(candidatesApi, 'resolvePokemonCandidates')
      .mockResolvedValue([{ id: 1, name: 'pokemon-1' }]);
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => makePokemon(Number(id)));

    const { rerender } = renderHook(({ filters }) => usePokemonExplorer(filters), {
      initialProps: { filters: DEFAULT_FILTERS },
    });

    await waitFor(() => expect(resolveSpy).toHaveBeenCalledTimes(1));

    rerender({ filters: { ...DEFAULT_FILTERS, type: 'fire' } });

    await waitFor(() => expect(resolveSpy).toHaveBeenCalledTimes(2));
    expect(resolveSpy).toHaveBeenLastCalledWith({ query: '', type: 'fire', generation: null });
  });

  it('re-resolves candidates when the generation filter changes', async () => {
    const resolveSpy = vi
      .spyOn(candidatesApi, 'resolvePokemonCandidates')
      .mockResolvedValue([{ id: 1, name: 'pokemon-1' }]);
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => makePokemon(Number(id)));

    const { rerender } = renderHook(({ filters }) => usePokemonExplorer(filters), {
      initialProps: { filters: DEFAULT_FILTERS },
    });

    await waitFor(() => expect(resolveSpy).toHaveBeenCalledTimes(1));

    rerender({ filters: { ...DEFAULT_FILTERS, generation: 'generation-ix' } });

    await waitFor(() => expect(resolveSpy).toHaveBeenCalledTimes(2));
    expect(resolveSpy).toHaveBeenLastCalledWith({ query: '', type: null, generation: 'generation-ix' });
  });
});

describe('usePokemonExplorer advanced filters', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('applies height/weight bounds to the fetched details before returning them', async () => {
    vi.spyOn(candidatesApi, 'resolvePokemonCandidates').mockResolvedValue([
      { id: 1, name: 'short' },
      { id: 2, name: 'tall' },
    ]);
    vi.spyOn(pokemonApi, 'fetchPokemonByNameOrId').mockImplementation(async (id) => ({
      ...makePokemon(Number(id)),
      height: Number(id) === 1 ? 3 : 30,
    }));

    const { result } = renderHook(() =>
      usePokemonExplorer({ ...DEFAULT_FILTERS, minHeight: 10, maxHeight: 50 })
    );

    await waitFor(() => expect(result.current.pokemons).toHaveLength(1));
    expect(result.current.pokemons[0].id).toBe(2);
  });
});
