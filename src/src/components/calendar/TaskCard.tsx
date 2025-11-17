import { Task, TaskType, TaskStatus } from '../../features/projects/types';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { mockUsers } from '../../mocks/db';
import { cn } from '../../lib/utils/cn';
export interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
}
export function TaskCard({
  task,
  onClick,
  compact = false
}: TaskCardProps) {
  const assignee = mockUsers.find(u => u.id === task.assignedTo);
  const typeConfig: Record<TaskType, {
    label: string;
    color: string;
    icon: string;
  }> = {
    DocumentReview: {
      label: 'بررسی مدرک',
      color: 'bg-blue-100 text-blue-800',
      icon: 'clipboard'
    },
    Inspection: {
      label: 'بازرسی',
      color: 'bg-purple-100 text-purple-800',
      icon: 'search'
    },
    CAPA: {
      label: 'CAPA',
      color: 'bg-orange-100 text-orange-800',
      icon: 'check'
    },
    Approval: {
      label: 'تأیید',
      color: 'bg-green-100 text-green-800',
      icon: 'check'
    },
    Certificate: {
      label: 'گواهینامه',
      color: 'bg-indigo-100 text-indigo-800',
      icon: 'clipboard'
    }
  };
  const statusConfig: Record<TaskStatus, {
    label: string;
    color: string;
  }> = {
    Pending: {
      label: 'در انتظار',
      color: 'bg-gray-100 text-gray-800'
    },
    InProgress: {
      label: 'در حال انجام',
      color: 'bg-blue-100 text-blue-800'
    },
    Completed: {
      label: 'انجام شده',
      color: 'bg-green-100 text-green-800'
    },
    Overdue: {
      label: 'عقب‌افتاده',
      color: 'bg-red-100 text-red-800'
    }
  };
  const typeInfo = typeConfig[task.type];
  const statusInfo = statusConfig[task.status];
  const isOverdue = task.status !== TaskStatus.Completed && new Date(task.dueDate) < new Date();
  if (compact) {
    return <button onClick={onClick} className={cn('w-full text-right p-2 rounded-lg hover:bg-gray-50 transition-colors border-r-2', isOverdue ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-white')}>
        <div className="flex items-start gap-2">
          <img src={assignee?.avatar} alt="" className="w-6 h-6 rounded-full flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {task.title}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {task.projectTitle}
            </p>
          </div>
        </div>
      </button>;
  }
  return <button onClick={onClick} className={cn('w-full text-right p-3 rounded-xl border transition-all duration-200 hover:shadow-md', isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300')}>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>

        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {task.title}
        </h4>

        <p className="text-xs text-gray-600 line-clamp-1">
          {task.projectTitle}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src={assignee?.avatar} alt="" className="w-6 h-6 rounded-full" />
            <span className="text-xs text-gray-600">{assignee?.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Icon name="calendar" size={12} />
            <span>{new Date(task.dueDate).toLocaleDateString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </button>;
}
