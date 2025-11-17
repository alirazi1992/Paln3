import { cn } from '../../lib/utils/cn';
export interface PillCounterProps {
  count: number;
  color?: string;
  className?: string;
}
export function PillCounter({
  count,
  color = 'bg-red-500',
  className
}: PillCounterProps) {
  if (count === 0) return null;
  return <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white', color, className)}>
      {count}
    </div>;
}
