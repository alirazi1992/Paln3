import { cn } from '../../lib/utils/cn';
import { Icon } from '../ui/Icon';
import { KPI } from '../../features/projects/types';

interface KPICardProps {
  kpi: KPI;
  className?: string;
}

const trendMeta = {
  up: {
    icon: 'arrowUpRight',
    color: 'text-emerald-600',
    label: 'رشد'
  },
  down: {
    icon: 'arrowDownRight',
    color: 'text-rose-600',
    label: 'کاهش'
  },
  stable: {
    icon: 'menu',
    color: 'text-gray-500',
    label: 'ثابت'
  }
} as const;

export function KPICard({
  kpi,
  className
}: KPICardProps) {
  const trend = trendMeta[kpi.trend as keyof typeof trendMeta] ?? trendMeta.stable;
  return <div className={cn('bg-white rounded-xl border border-gray-200 p-6 text-right', className)}>
      <div className="flex items-start justify-between flex-row-reverse mb-4">
        <h3 className="text-sm font-medium text-gray-600">{kpi.name}</h3>
        <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', trend.color)}>
          <Icon name={trend.icon} size={14} />
          {Math.abs(kpi.change)}%
        </span>
      </div>
      <div className="flex items-baseline justify-end gap-2">
        <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
        <span className="text-sm text-gray-500">{kpi.unit}</span>
      </div>
      <p className="mt-3 text-xs text-gray-500">{kpi.period}</p>
    </div>;
}
