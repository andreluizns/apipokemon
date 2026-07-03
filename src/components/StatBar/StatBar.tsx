interface StatBarProps {
  label: string;
  value: number;
  max: number;
}

export function StatBar({ label, value, max }: StatBarProps) {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium uppercase text-neutral-500">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-neutral-200">
        <div
          data-testid="stat-bar-fill"
          className="h-2 rounded-full bg-emerald-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold">{value}</span>
    </div>
  );
}
