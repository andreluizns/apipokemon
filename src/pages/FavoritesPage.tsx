import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPokemonByNameOrId } from '../api/pokemon';
import { useFavoritesStore } from '../store/favoritesStore';
import { PokemonList } from '../components/PokemonList/PokemonList';
import type { Pokemon } from '../types/pokemon';

export function FavoritesPage() {
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setPokemons([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all(favoriteIds.map((id) => fetchPokemonByNameOrId(id)))
      .then((results) => {
        if (!isCancelled) setPokemons(results);
      })
      .catch((err) => {
        if (!isCancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [favoriteIds]);

  // Filter to the current favoriteIds so unfavoriting a card removes it immediately,
  // instead of leaving it visible until the next fetch resolves.
  const visiblePokemons = pokemons.filter((pokemon) => favoriteIds.includes(pokemon.id));

  return (
    <main className="mx-auto max-w-md md:max-w-3xl px-4 pb-24 pt-6">
      <h1 className="mb-4 text-xl font-bold">Favoritos</h1>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading && <p className="text-sm text-neutral-500">Carregando...</p>}
      {favoriteIds.length === 0 ? (
        <p className="text-neutral-500">Nenhum favorito ainda.</p>
      ) : (
        <PokemonList
          pokemons={visiblePokemons}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelect={(id) => navigate(`/pokemon/${id}`)}
        />
      )}
    </main>
  );
}
