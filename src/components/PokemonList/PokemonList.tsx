import type { Pokemon } from '../../types/pokemon';
import { PokemonCard } from '../PokemonCard/PokemonCard';

interface PokemonListProps {
  pokemons: Pokemon[];
  favoriteIds: number[];
  onToggleFavorite: (id: number) => void;
  onSelect: (id: number) => void;
}

export function PokemonList({ pokemons, favoriteIds, onToggleFavorite, onSelect }: PokemonListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favoriteIds.includes(pokemon.id)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
