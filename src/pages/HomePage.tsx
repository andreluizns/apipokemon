import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePokemonExplorer, DEFAULT_FILTERS } from '../hooks/usePokemonExplorer';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { PokemonList } from '../components/PokemonList/PokemonList';
import { LoadMoreButton } from '../components/LoadMoreButton/LoadMoreButton';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { TypeFilterSheet } from '../components/TypeFilterSheet/TypeFilterSheet';
import { AdvancedFilterSheet, type AdvancedFilterValue } from '../components/AdvancedFilterSheet/AdvancedFilterSheet';
import { useFavoritesStore } from '../store/favoritesStore';
import { TYPE_LABELS_PT } from '../constants/typeLabels';
import type { PokemonTypeName } from '../constants/types';

export function HomePage() {
  const navigate = useNavigate();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);
  const [selectedType, setSelectedType] = useState<PokemonTypeName | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterValue>({
    minHeight: null, maxHeight: null, minWeight: null, maxWeight: null, generation: null,
  });
  const [isTypeSheetOpen, setIsTypeSheetOpen] = useState(false);
  const [isAdvancedSheetOpen, setIsAdvancedSheetOpen] = useState(false);

  const { pokemons, isLoading, error, hasMore, loadMore } = usePokemonExplorer({
    ...DEFAULT_FILTERS,
    query: debouncedSearchTerm,
    type: selectedType,
    ...advancedFilters,
  });

  return (
    <main className="mx-auto max-w-md md:max-w-3xl px-4 pb-24 pt-6">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setIsTypeSheetOpen(true)}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          {selectedType ? TYPE_LABELS_PT[selectedType] : 'Todos os tipos'} ⌄
        </button>
        <button
          type="button"
          onClick={() => setIsAdvancedSheetOpen(true)}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Mais filtros ⌄
        </button>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {isLoading && !hasMore && <p className="mt-4 text-center text-sm text-neutral-500">Carregando...</p>}

      <div className="mt-4">
        <PokemonList
          pokemons={pokemons}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelect={(id) => navigate(`/pokemon/${id}`)}
        />
      </div>

      <LoadMoreButton hasMore={hasMore} isLoading={isLoading} onClick={loadMore} />

      <TypeFilterSheet
        isOpen={isTypeSheetOpen}
        selectedType={selectedType}
        onSelect={setSelectedType}
        onClose={() => setIsTypeSheetOpen(false)}
      />
      <AdvancedFilterSheet
        isOpen={isAdvancedSheetOpen}
        value={advancedFilters}
        onApply={setAdvancedFilters}
        onClose={() => setIsAdvancedSheetOpen(false)}
      />
    </main>
  );
}
