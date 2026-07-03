import type { EvolutionStage } from '../../utils/evolutionChain';
import { EvolutionStageCard } from './EvolutionStageCard';

interface EvolutionChainViewProps {
  stages: EvolutionStage[][];
}

export function EvolutionChainView({ stages }: EvolutionChainViewProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 p-3">
      {stages.map((stage, stageIndex) =>
        stage.map((entry) => (
          <div key={entry.speciesId}>
            {stageIndex > 0 && entry.minLevel !== null && (
              <p className="my-1 flex items-center gap-1 pl-1 text-xs font-medium text-blue-600">
                <span aria-hidden>↓</span> Nível {entry.minLevel}
              </p>
            )}
            <EvolutionStageCard speciesId={entry.speciesId} speciesName={entry.speciesName} />
          </div>
        ))
      )}
    </div>
  );
}
