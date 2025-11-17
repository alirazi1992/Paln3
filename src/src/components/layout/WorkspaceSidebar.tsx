import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../lib/utils/cn';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { WorkspaceTabId } from '../../features/workspace/types';

interface SidebarNavItem {
  id: string;
  icon: string;
  label: string;
  path?: string;
  workspace?: WorkspaceTabId;
}

const primaryNav: SidebarNavItem[] = [{
  id: 'dashboard',
  icon: 'spark',
  label: 'ایستگاه تکنسین',
  path: '/dashboard/technician'
}];

const workspaceShortcuts: SidebarNavItem[] = [{
  id: 'shortcut-cases',
  icon: 'layers',
  label: 'پرونده‌های ارجاعی',
  workspace: 'cases'
}, {
  id: 'shortcut-calendar',
  icon: 'calendarDays',
  label: 'برنامه روزانه',
  workspace: 'calendar'
}, {
  id: 'shortcut-reports',
  icon: 'chart',
  label: 'گزارش و تحلیل',
  workspace: 'reports'
}];

const utilityNav: SidebarNavItem[] = [{
  id: 'settings',
  icon: 'settings',
  label: 'تنظیمات حساب',
  path: '/settings/profile'
}, {
  id: 'security',
  icon: 'shield',
  label: 'امنیت و دسترسی',
  path: '/settings/security'
}];

export function WorkspaceSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab
  } = useWorkspace();

  const handleWorkspaceClick = (item: SidebarNavItem) => {
    if (!item.workspace) return;
    if (location.pathname !== '/dashboard/technician') {
      navigate('/dashboard/technician');
    }
    setActiveTab(item.workspace);
  };

  const itemClass = (active: boolean) => cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200', 'bg-white/50 text-gray-500 hover:text-gray-900 hover:bg-white shadow-[0_10px_25px_rgba(15,23,42,0.08)]', active && 'bg-gray-900 text-white shadow-[0_20px_40px_rgba(15,23,42,0.25)] scale-105');

  return <aside className="hidden lg:flex w-[88px] shrink-0 flex-col items-center py-6 gap-4">
      <div className="flex flex-col gap-3 mt-4">
        {primaryNav.map(item => <Tooltip key={item.id} content={item.label} position="left">
            <NavLink to={item.path ?? '#'} className={({ isActive }) => itemClass(isActive)}>
              <Icon name={item.icon} size={20} />
            </NavLink>
          </Tooltip>)}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {workspaceShortcuts.map(item => {
        const isActive = Boolean(location.pathname === '/dashboard/technician' && item.workspace && activeTab === item.workspace);
        return <Tooltip key={item.id} content={item.label} position="left">
              <button onClick={() => handleWorkspaceClick(item)} className={itemClass(isActive)}>
                <Icon name={item.icon} size={20} />
              </button>
            </Tooltip>;
      })}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {utilityNav.map(item => <Tooltip key={item.id} content={item.label} position="left">
            <NavLink to={item.path ?? '#'} className={({ isActive }) => itemClass(isActive)}>
              <Icon name={item.icon} size={20} />
            </NavLink>
          </Tooltip>)}
      </div>
    </aside>;
}
