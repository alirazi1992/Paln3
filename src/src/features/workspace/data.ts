import { Island } from '../projects/types';
import { JourneyState, WorkspaceSnapshot, WorkspaceTab, WorkspaceTabId } from './types';

export const workspaceTabs: WorkspaceTab[] = [{
  id: 'cases',
  label: 'تابلوی پرونده‌ها',
  description: 'تمرکز بر مالکیت، ارجاع و هشدار SLA',
  accent: 'from-sky-50 to-indigo-50'
}, {
  id: 'calendar',
  label: 'مسیر تقویمی',
  description: 'برنامه‌ریزی بازدیدها و همپوشانی تیم‌ها',
  accent: 'from-emerald-50 to-teal-50'
}, {
  id: 'reports',
  label: 'میز گزارش‌گیری',
  description: 'تحلیل کیفیت اجرا و آماده‌سازی خروجی‌ها',
  accent: 'from-orange-50 to-rose-50'
}];

export const workspaceSnapshots: Record<WorkspaceTabId, WorkspaceSnapshot> = {
  cases: {
    headline: 'اتاق عملیات فنی',
    subline: '۱۲ ارجاع فعال · ۶ پرونده در مسیر اضطراری',
    priority: 'پیش از جلسه عصر، پرونده‌های پرریسک را پایدار و مستند کنید.',
    metrics: [{
      id: 'cases-open',
      label: 'پرونده‌های باز',
      value: '۲۴',
      trend: {
        isPositive: true,
        value: '+۱۲%'
      }
    }, {
      id: 'cases-sla',
      label: 'هشدار SLA',
      value: '۴',
      trend: {
        isPositive: false,
        value: '-۳%'
      }
    }, {
      id: 'cases-handovers',
      label: 'تحویل شیفت',
      value: '۸',
      trend: {
        isPositive: true,
        value: '+۲'
      }
    }],
    reminders: [{
      id: 'cases-1',
      title: 'پروژه بدنه UTN-2045 منتظر تایید طراحی است',
      owner: 'سارا رحیمی',
      due: 'امروز ۱۵:۰۰'
    }, {
      id: 'cases-2',
      title: 'ارسال خلاصه بازرسی برای یگان ۳',
      owner: 'علی محمدی',
      due: 'فردا'
    }, {
      id: 'cases-3',
      title: 'آماده‌سازی گزارش برای تماس مدیران',
      owner: 'فاطمه کریمی',
      due: 'جمعه'
    }]
  },
  calendar: {
    headline: 'کنترل تقویم میدانی',
    subline: '۷ بازدید قطعی · ۳ بازه در انتظار تایید',
    priority: 'پیش از فریز لجستیک، برنامه چرخشی بازدیدها را نهایی کنید.',
    metrics: [{
      id: 'calendar-lock',
      label: 'بازه‌های قفل‌شده',
      value: '۹',
      trend: {
        isPositive: true,
        value: '+۱'
      }
    }, {
      id: 'calendar-drifts',
      label: 'انحراف برنامه',
      value: '۳',
      trend: {
        isPositive: false,
        value: '-۸%'
      }
    }, {
      id: 'calendar-collab',
      label: 'همپوشانی تیم‌ها',
      value: '۵',
      trend: {
        isPositive: true,
        value: '+۱۸%'
      }
    }],
    reminders: [{
      id: 'calendar-1',
      title: 'تایید دسترسی حوض خشک با یارد A',
      owner: 'حسین جلالی',
      due: 'امروز'
    }, {
      id: 'calendar-2',
      title: 'هماهنگی با QA برای تست بارگیری',
      owner: 'سارا رحیمی',
      due: 'فردا ۱۱:۰۰'
    }]
  },
  reports: {
    headline: 'کنسول بینش',
    subline: 'گزارش کیفیت تکنسین‌ها تا ۱۸ ساعت دیگر مهلت دارد',
    priority: 'نمونه‌ها را تایید و خروجی قابل ارائه به ممیزی آماده کنید.',
    metrics: [{
      id: 'reports-coverage',
      label: 'پوشش نمونه',
      value: '۹۲%',
      trend: {
        isPositive: true,
        value: '+۴%'
      }
    }, {
      id: 'reports-outliers',
      label: 'موارد غیرمعمول',
      value: '۳',
      trend: {
        isPositive: false,
        value: '+۱'
      }
    }, {
      id: 'reports-shares',
      label: 'بسته‌های اشتراک‌گذاری',
      value: '۱۱',
      trend: {
        isPositive: true,
        value: '+۲'
      }
    }],
    reminders: [{
      id: 'reports-1',
      title: 'ضمیمه‌کردن تشخیص‌ها به بسته CAPA',
      owner: 'علی محمدی',
      due: 'امروز ۱۸:۰۰'
    }, {
      id: 'reports-2',
      title: 'انتشار نسخه آماده ممیزی',
      owner: 'فاطمه کریمی',
      due: 'دوشنبه آینده'
    }]
  }
};

const journeyBase: Island[] = [{
  id: 'intake',
  title: 'دریافت و ارجاع',
  variant: 'light',
  tasks: [{
    id: 'task-assign',
    title: 'ارجاع پرونده ارتعاش بدنه',
    subtitle: 'UTN-2038 · تیم بدنه',
    avatar: 'https://i.pravatar.cc/120?img=21',
    hasCheck: true,
    hasMenu: true
  }, {
    id: 'task-brief',
    title: 'بارگذاری خلاصه مهندسی',
    subtitle: 'یادداشت بازرسی در انتظار',
    avatar: 'https://i.pravatar.cc/120?img=35',
    hasMenu: true
  }, {
    id: 'task-sync',
    title: 'زمان‌بندی جلسه با QA',
    subtitle: 'نیازمند بازه تقویمی',
    avatar: 'https://i.pravatar.cc/120?img=49',
    hasCalendar: true
  }]
}, {
  id: 'execution',
  title: 'اجرای میدانی',
  variant: 'dark',
  tasks: [{
    id: 'task-lab',
    title: 'آزمایشگاه ارتعاش',
    subtitle: 'ماشین‌آلات · بار موتور',
    avatar: 'https://i.pravatar.cc/120?img=14',
    hasCheck: true,
    hasMenu: true
  }, {
    id: 'task-field',
    title: 'صحت‌سنجی میدانی',
    subtitle: 'حوض B · تیم شیفت شب',
    avatar: 'https://i.pravatar.cc/120?img=18',
    hasCalendar: true
  }]
}, {
  id: 'handover',
  title: 'تحویل و بستن پرونده',
  variant: 'light',
  tasks: [{
    id: 'task-recap',
    title: 'تهیه گزارش جمع‌بندی',
    subtitle: 'ارسال برای مدیران',
    avatar: 'https://i.pravatar.cc/120?img=28',
    hasMenu: true
  }, {
    id: 'task-signoff',
    title: 'تایید دیجیتال',
    subtitle: 'منتظر تایید بازبین ارشد',
    avatar: 'https://i.pravatar.cc/120?img=40',
    hasCheck: true
  }]
}];

const cloneIslands = (islands: Island[]): Island[] => islands.map(island => ({
  ...island,
  tasks: island.tasks.map(task => ({ ...task }))
}));

export function createInitialJourneyState(): JourneyState {
  return {
    cases: cloneIslands(journeyBase),
    calendar: cloneIslands(journeyBase),
    reports: cloneIslands(journeyBase)
  };
}
