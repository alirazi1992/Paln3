import { cn } from '../../lib/utils/cn';
import { ProjectStatus, DocumentStatus, InspectionResult, CAPAStatus } from '../../features/projects/types';

interface StatusBadgeProps {
  status: ProjectStatus | DocumentStatus | InspectionResult | CAPAStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  Pending: {
    label: 'در انتظار بررسی',
    color: 'bg-gray-100 text-gray-800'
  },
  UnderReview: {
    label: 'در حال ارزیابی',
    color: 'bg-blue-100 text-blue-800'
  },
  Approved: {
    label: 'تایید شده',
    color: 'bg-green-100 text-green-800'
  },
  Certified: {
    label: 'گواهی نهایی',
    color: 'bg-purple-100 text-purple-800'
  },
  Rejected: {
    label: 'رد شده',
    color: 'bg-red-100 text-red-800'
  },
  Withdrawn: {
    label: 'لغو شده',
    color: 'bg-gray-100 text-gray-800'
  },
  Draft: {
    label: 'پیش‌نویس',
    color: 'bg-gray-100 text-gray-800'
  },
  Commented: {
    label: 'دارای توضیح',
    color: 'bg-yellow-100 text-yellow-800'
  },
  Accepted: {
    label: 'پذیرفته شده',
    color: 'bg-green-100 text-green-800'
  },
  Verified: {
    label: 'صحت‌سنجی شده',
    color: 'bg-green-100 text-green-800'
  },
  Final: {
    label: 'نسخه نهایی',
    color: 'bg-purple-100 text-purple-800'
  },
  Revoked: {
    label: 'باطل شده',
    color: 'bg-red-100 text-red-800'
  },
  Superseded: {
    label: 'جایگزین شده',
    color: 'bg-gray-100 text-gray-800'
  },
  PendingDependency: {
    label: 'منتظر وابستگی',
    color: 'bg-orange-100 text-orange-800'
  },
  IntegrityError: {
    label: 'خطای یکپارچگی',
    color: 'bg-red-100 text-red-800'
  },
  Compliant: {
    label: 'مطابق استاندارد',
    color: 'bg-green-100 text-green-800'
  },
  NonCompliant: {
    label: 'دارای مغایرت',
    color: 'bg-red-100 text-red-800'
  },
  Conditional: {
    label: 'مشروط',
    color: 'bg-yellow-100 text-yellow-800'
  },
  Open: {
    label: 'باز',
    color: 'bg-blue-100 text-blue-800'
  },
  InProgress: {
    label: 'در حال انجام',
    color: 'bg-yellow-100 text-yellow-800'
  },
  Closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-800'
  }
};

export function StatusBadge({
  status,
  className
}: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800'
  };
  return <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.color, className)}>
      {config.label}
    </span>;
}
