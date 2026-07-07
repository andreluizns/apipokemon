import { TYPE_BADGE_BACKGROUND_COLORS } from '../../constants/typeCardBackgroundColors';
import { TYPE_ICONS } from '../../constants/typeIcons';
import { TYPE_LABELS_PT } from '../../constants/typeLabels';
import type { PokemonTypeName } from '../../constants/types';
import { capitalize } from '../../utils/formatters';

interface TypeBadgeProps {
  type: PokemonTypeName;
  size?: 'sm' | 'lg';
}

const SIZE_CLASSES: Record<'sm' | 'lg', string> = {
  sm: 'px-3 py-1 text-xs font-medium',
  lg: 'px-3.5 py-1 text-sm font-medium',
};

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const icon = TYPE_ICONS[type];

  return (
    <span
      className={`flex items-center gap-1 rounded-full text-white ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: TYPE_BADGE_BACKGROUND_COLORS[type] }}
    >
      {icon && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">
          <img src={icon} alt="" aria-hidden className="h-2.5 w-2.5" />
        </span>
      )}
      {TYPE_LABELS_PT[type] ?? capitalize(type)}
    </span>
  );
}
