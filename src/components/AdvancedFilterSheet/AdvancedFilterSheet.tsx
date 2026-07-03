import { useEffect, useState } from 'react';
import { GENERATIONS } from '../../constants/generations';

export interface AdvancedFilterValue {
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  generation: string | null;
}

interface AdvancedFilterSheetProps {
  isOpen: boolean;
  value: AdvancedFilterValue;
  onApply: (value: AdvancedFilterValue) => void;
  onClose: () => void;
}

function toNullableNumber(text: string): number | null {
  if (text.trim() === '') return null;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? null : parsed;
}

export function AdvancedFilterSheet({ isOpen, value, onApply, onClose }: AdvancedFilterSheetProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (isOpen) setDraft(value);
  }, [isOpen, value]);

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
        aria-labelledby="advanced-filter-sheet-title"
        className="w-full max-w-3xl rounded-t-3xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="advanced-filter-sheet-title" className="mb-4 text-center text-lg font-semibold">Filtros avançados</h2>

        <label className="mb-1 block text-sm font-medium" htmlFor="min-height">Altura mínima (dm)</label>
        <input
          id="min-height"
          type="number"
          className="mb-3 w-full rounded-lg border border-neutral-300 p-2"
          value={draft.minHeight ?? ''}
          onChange={(event) => setDraft((prev) => ({ ...prev, minHeight: toNullableNumber(event.target.value) }))}
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="max-height">Altura máxima (dm)</label>
        <input
          id="max-height"
          type="number"
          className="mb-3 w-full rounded-lg border border-neutral-300 p-2"
          value={draft.maxHeight ?? ''}
          onChange={(event) => setDraft((prev) => ({ ...prev, maxHeight: toNullableNumber(event.target.value) }))}
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="min-weight">Peso mínimo (hg)</label>
        <input
          id="min-weight"
          type="number"
          className="mb-3 w-full rounded-lg border border-neutral-300 p-2"
          value={draft.minWeight ?? ''}
          onChange={(event) => setDraft((prev) => ({ ...prev, minWeight: toNullableNumber(event.target.value) }))}
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="max-weight">Peso máximo (hg)</label>
        <input
          id="max-weight"
          type="number"
          className="mb-3 w-full rounded-lg border border-neutral-300 p-2"
          value={draft.maxWeight ?? ''}
          onChange={(event) => setDraft((prev) => ({ ...prev, maxWeight: toNullableNumber(event.target.value) }))}
        />

        <label className="mb-1 block text-sm font-medium" htmlFor="generation">Geração</label>
        <select
          id="generation"
          className="mb-4 w-full rounded-lg border border-neutral-300 p-2"
          value={draft.generation ?? ''}
          onChange={(event) => setDraft((prev) => ({ ...prev, generation: event.target.value || null }))}
        >
          <option value="">Todas</option>
          {GENERATIONS.map((generation) => (
            <option key={generation.value} value={generation.value}>{generation.label}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => {
            onApply(draft);
            onClose();
          }}
          className="w-full rounded-full bg-neutral-900 py-3 text-sm font-semibold text-white"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}
