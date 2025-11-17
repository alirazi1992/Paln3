import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { Icon } from '../ui/Icon';
import { Dropdown } from '../ui/Dropdown';
import { cn } from '../../lib/utils/cn';

export function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    logout
  } = useAuth();

  const adminNavItems = [{
    id: 'dashboard',
    label: 'داشبورد مدیران',
    path: '/dashboard'
  }, {
    id: 'projects',
    label: 'پروژه‌ها',
    path: '/projects'
  }, {
    id: 'calendar',
    label: 'تقویم تیمی',
    path: '/calendar'
  }, {
    id: 'audit',
    label: 'گزارش‌های ممیزی',
    path: '/audit-logs'
  }, {
    id: 'security',
    label: 'رخدادهای امنیتی',
    path: '/security-logs'
  }];

  const clientNavItems = [{
    id: 'client-dashboard',
    label: 'داشبورد مشتری',
    path: '/dashboard/client'
  }];

  const navItems = user?.role === 'client' ? clientNavItems : adminNavItems;

  const isActivePath = (path: string) => {
    if (!path) return false;
    const [pathname, search] = path.split('?');
    if (search) {
      return location.pathname === pathname && location.search === `?${search}`;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const userMenuItems = [{
    id: 'profile',
    label: 'پروفایل کاربری',
    icon: <Icon name="user" size={16} />,
    onClick: () => navigate('/settings/profile')
  }, {
    id: 'settings',
    label: 'تنظیمات امنیتی',
    icon: <Icon name="settings" size={16} />,
    onClick: () => navigate('/settings/security')
  }, {
    id: 'logout',
    label: 'خروج از حساب',
    icon: <Icon name="logout" size={16} />,
    onClick: () => {
      logout();
      navigate('/login');
    }
  }];

  return <div className="bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_4px_18px_rgba(15,23,42,0.06)] sticky top-0 z-40" dir="rtl">
      <div className="px-6 py-4 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[13px] text-gray-500">سامانه کنترل پروژه‌های کلان</p>
              <h1 className="text-xl font-bold text-gray-900">مرکز عملیات</h1>
            </div>
            <nav className="flex items-center gap-2">
              {navItems.map(item => <button key={item.id} onClick={() => navigate(item.path)} className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200', isActivePath(item.path) ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
                  {item.label}
                </button>)}
            </nav>
          </div>
          <div className="flex flex-row-reverse items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Icon name="search" size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative">
              <Icon name="bell" size={20} />
              <span className="absolute top-1 left-1 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <Dropdown trigger={<div className="flex flex-row-reverse items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={user?.avatar} alt={user?.name} className="w-10 h-10 rounded-full border-2 border-gray-200" />
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>} items={userMenuItems} />
          </div>
        </div>
      </div>
    </div>;
}
