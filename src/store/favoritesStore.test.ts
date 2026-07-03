import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './favoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ favoriteIds: [] });
  });

  it('starts with no favorites', () => {
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
  });

  it('toggleFavorite adds an id that is not present', () => {
    useFavoritesStore.getState().toggleFavorite(25);
    expect(useFavoritesStore.getState().favoriteIds).toEqual([25]);
  });

  it('toggleFavorite removes an id that is already present', () => {
    useFavoritesStore.getState().toggleFavorite(25);
    useFavoritesStore.getState().toggleFavorite(25);
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
  });

  it('isFavorite reflects current state', () => {
    useFavoritesStore.getState().toggleFavorite(1);
    expect(useFavoritesStore.getState().isFavorite(1)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(2)).toBe(false);
  });

  it('persists favoriteIds to localStorage under the pokedex-favorites key', () => {
    useFavoritesStore.getState().toggleFavorite(7);
    const stored = localStorage.getItem('pokedex-favorites');
    expect(stored).toContain('7');
  });
});
