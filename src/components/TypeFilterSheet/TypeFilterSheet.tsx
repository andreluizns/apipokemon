import { useEffect } from 'react';
import { POKEMON_TYPES, type PokemonTypeName } from '../../constants/types';
import { TYPE_COLORS } from '../../constants/typeColors';
import { TYPE_LABELS_PT } from '../../constants/typeLabels';

interface TypeFilterSheetProps {
  isOpen: boolean;
  selectedType: string | null;
  onSelect: (type: PokemonTypeName | null) => void;
  onClose: () => void;
}

export function TypeFilterSheet({ isOpen, selectedType, onSelect, onClose }: TypeFilterSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="type-filter-sheet-title"
        className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="type-filter-sheet-title" className="mb-4 text-center text-lg font-semibold">Selecione o tipo</h2>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            className={`rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white ${selectedType === null ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''}`}
          >
            Todos os tipos
          </button>
          {POKEMON_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onSelect(type);
                onClose();
              }}
              style={{ backgroundColor: TYPE_COLORS[type] }}
              className={`rounded-full py-3 text-sm font-semibold text-white ${selectedType === type ? 'ring-2 ring-black' : ''}`}
            >
              {TYPE_LABELS_PT[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
