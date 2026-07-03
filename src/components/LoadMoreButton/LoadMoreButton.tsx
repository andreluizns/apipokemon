interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export function LoadMoreButton({ hasMore, isLoading, onClick }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="mx-auto mt-4 block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
    >
      {isLoading ? 'Carregando...' : 'Carregar mais'}
    </button>
  );
}
