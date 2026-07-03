import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id: number) => {
        const current = get().favoriteIds;
        const next = current.includes(id)
          ? current.filter((favoriteId) => favoriteId !== id)
          : [...current, id];
        set({ favoriteIds: next });
      },
      isFavorite: (id: number) => get().favoriteIds.includes(id),
    }),
    { name: 'pokedex-favorites' }
  )
);
