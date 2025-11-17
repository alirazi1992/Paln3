import { useState } from 'react';
import type { DragEvent } from 'react';
import { Island } from '../../features/projects/types';
import { JourneyCard } from './JourneyCard';
import { GlassCard } from '../common/GlassCard';
import { Icon } from '../ui/Icon';
export interface JourneyIslandProps {
  island: Island;
  onTaskReorder: (islandId: string, taskId: string, newOrder: number) => void;
}
export function JourneyIsland({
  island,
  onTaskReorder
}: JourneyIslandProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };
  const handleDragEnd = () => {
    setDraggedTask(null);
  };
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskReorder(island.id, draggedTask, targetIndex);
    }
    setDraggedTask(null);
  };
  return <GlassCard variant={island.variant} className="p-6 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{island.title}</h3>
        <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <Icon name="plus" size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {island.tasks.map((task, index) => <div key={task.id} onDragOver={handleDragOver} onDrop={e => handleDrop(e, index)}>
            <JourneyCard task={task} isDragging={draggedTask === task.id} onDragStart={() => handleDragStart(task.id)} onDragEnd={handleDragEnd} variant={island.variant} />
          </div>)}
      </div>
    </GlassCard>;
}
