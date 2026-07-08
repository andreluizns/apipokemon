import type { EvolutionStage } from '../../utils/evolutionChain';
import { EvolutionStageCard } from './EvolutionStageCard';
import arrowEvolutionIcon from '../../assets/poke-page/arrow-evolution.svg';

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
              <p className="my-1 flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#173EA5]">
                <img src={arrowEvolutionIcon} alt="" aria-hidden className="h-6.75" /> Nível {entry.minLevel}
              </p>
            )}
            <EvolutionStageCard speciesId={entry.speciesId} speciesName={entry.speciesName} />
          </div>
        ))
      )}
    </div>
  );
}
