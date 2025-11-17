import { Island } from '../../features/projects/types';
import { JourneyIsland } from './JourneyIsland';
export interface JourneyBoardProps {
  islands: Island[];
  onTaskReorder: (islandId: string, taskId: string, newOrder: number) => void;
}
export function JourneyBoard({
  islands,
  onTaskReorder
}: JourneyBoardProps) {
  return <div className="relative">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {islands.map((island, index) => <div key={island.id} className="relative">
            <JourneyIsland island={island} onTaskReorder={onTaskReorder} />
            {index < islands.length - 1 && <div className="absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />}
          </div>)}
      </div>
    </div>;
}
