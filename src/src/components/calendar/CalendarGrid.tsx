import { Task } from '../../features/projects/types';
import { TaskCard } from './TaskCard';
import { cn } from '../../lib/utils/cn';
export interface CalendarGridProps {
  tasks: Task[];
  currentDate: Date;
  onTaskClick: (task: Task) => void;
}
export function CalendarGrid({
  tasks,
  currentDate,
  onTaskClick
}: CalendarGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  // Generate calendar days
  const days: (Date | null)[] = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }
  // Get tasks for a specific date
  const getTasksForDate = (date: Date | null): Task[] => {
    if (!date) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() && taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
    });
  };
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  return <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day, index) => <div key={index} className="p-3 text-center text-sm font-semibold text-gray-700">
            {day}
          </div>)}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
        const dayTasks = getTasksForDate(date);
        const today = isToday(date);
        return <div key={index} className={cn('min-h-[120px] border-b border-r border-gray-100 p-2', !date && 'bg-gray-50', index % 7 === 6 && 'border-r-0')}>
              {date && <>
                  <div className={cn('text-sm font-medium mb-2 flex items-center justify-between', today ? 'text-blue-600' : date.getMonth() !== month ? 'text-gray-400' : 'text-gray-900')}>
                    <span className={cn('w-7 h-7 flex items-center justify-center rounded-full', today && 'bg-blue-600 text-white')}>
                      {date.getDate()}
                    </span>
                    {dayTasks.length > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {dayTasks.length}
                      </span>}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} compact />)}
                    {dayTasks.length > 3 && <div className="text-xs text-gray-500 text-center py-1">
                        +{dayTasks.length - 3} بیشتر
                      </div>}
                  </div>
                </>}
            </div>;
      })}
      </div>
    </div>;
}
