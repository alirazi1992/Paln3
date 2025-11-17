import { JourneyTask } from '../../features/projects/types';
import { Icon } from '../ui/Icon';
import { cn } from '../../lib/utils/cn';
export interface JourneyCardProps {
  task: JourneyTask;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  variant?: 'light' | 'dark';
}
export function JourneyCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  variant = 'light'
}: JourneyCardProps) {
  return <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} className={cn('p-4 rounded-2xl backdrop-blur-xl border transition-all duration-200 cursor-move', variant === 'light' ? 'bg-white/60 border-white/40 hover:bg-white/80' : 'bg-white/10 border-white/20 hover:bg-white/20', isDragging && 'opacity-50 scale-95')}>
      <div className="flex items-start gap-3">
        <img src={task.avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-medium mb-1', variant === 'light' ? 'text-gray-900' : 'text-white')}>
            {task.title}
          </h4>
          {task.subtitle && <p className="text-xs text-gray-500">{task.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.hasCheck && <button className={cn('w-6 h-6 rounded-lg flex items-center justify-center', variant === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white')}>
              <Icon name="check" size={14} />
            </button>}
          {task.hasCalendar && <button className={cn('w-6 h-6 rounded-lg flex items-center justify-center', variant === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white')}>
              <Icon name="calendar" size={14} />
            </button>}
          {task.hasMenu && <button className={cn('w-6 h-6 rounded-lg flex items-center justify-center', variant === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white')}>
              <Icon name="menu" size={14} />
            </button>}
        </div>
      </div>
    </div>;
}
