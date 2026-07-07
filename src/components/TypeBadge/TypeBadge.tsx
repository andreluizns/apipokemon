import { TYPE_BADGE_BACKGROUND_COLORS } from '../../constants/typeCardBackgroundColors';
import { TYPE_ICONS } from '../../constants/typeIcons';
import { TYPE_LABELS_PT } from '../../constants/typeLabels';
import type { PokemonTypeName } from '../../constants/types';
import { capitalize } from '../../utils/formatters';

interface TypeBadgeProps {
  type: PokemonTypeName;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const icon = TYPE_ICONS[type];

  return (
    <span
      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white"
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
