import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useWorkspace } from "../../features/workspace/WorkspaceContext";
import { workspaceTabs } from "../../features/workspace/data";
import { Icon } from "../ui/Icon";
import { Dropdown } from "../ui/Dropdown";
import { cn } from "../../lib/utils/cn";

export function WorkspaceTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab } = useWorkspace();
  const currentTab = useMemo(
    () => workspaceTabs.find((tab) => tab.id === activeTab),
    [activeTab]
  );

  // Ensure document is RTL for better keyboard navigation/selection
  useEffect(() => {
    const prevDir = document.documentElement.getAttribute("dir");
    const prevLang = document.documentElement.getAttribute("lang");
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "fa");
    return () => {
      if (prevDir) document.documentElement.setAttribute("dir", prevDir);
      else document.documentElement.removeAttribute("dir");
      if (prevLang) document.documentElement.setAttribute("lang", prevLang);
      else document.documentElement.removeAttribute("lang");
    };
  }, []);

  const userMenuItems = [
    {
      id: "profile",
      label: "پروفایل کاربری",
      icon: <Icon name="user" size={16} />,
      onClick: () => navigate("/settings/profile"),
    },
    {
      id: "settings",
      label: "تنظیمات امنیتی",
      icon: <Icon name="settings" size={16} />,
      onClick: () => navigate("/settings/security"),
    },
    {
      id: "logout",
      label: "خروج از حساب",
      icon: <Icon name="logout" size={16} />,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl" dir="rtl" lang="fa">
      <div className="px-4 md:px-6 lg:px-10 py-6">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title block */}
          <div className="text-right">
            {/* Persian typography: avoid wide tracking */}
            <p className="text-xs tracking-normal text-gray-400">
              مرکز عملیات تیم فنی
            </p>
            <div className="flex items-baseline gap-3 justify-end">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                هماهنگی پرونده‌ها و میدانی
              </h1>
              {currentTab && (
                <span className="text-sm text-gray-500">
                  {currentTab.description}
                </span>
              )}
            </div>
          </div>

          {/* Actions (search, bell, share, avatar) */}
          <div className="flex items-center gap-2 mr-6">
            {/* RTL search: input then icon; both right-aligned */}
            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 w-64 shadow-sm">
              <input
                type="search"
                placeholder="جستجوی پرونده، UTN یا مالک"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none text-right"
              />
              <Icon name="search" size={18} className="text-gray-400" />
            </div>

            <button
              className="w-11 h-11 rounded-full bg-white shadow-lg border border-white/60 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="هشدارها"
            >
              <Icon name="bell" size={18} />
            </button>

            <button
              className="w-11 h-11 rounded-full bg-white shadow-lg border border-white/60 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="اشتراک‌گذاری"
            >
              <Icon name="share" size={18} />
            </button>

            <Dropdown
              // If your Dropdown supports dir/placement, this helps:
              dir="rtl"
              placement="bottom-start"
              trigger={
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full cursor-pointer border-2 border-white shadow-lg object-cover"
                />
              }
              items={userMenuItems}
              // Fallback alignment prop (if your Dropdown only supports align):
              align="left"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 justify-start">
            {workspaceTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "min-w-[160px] rounded-3xl px-4 py-3 text-right transition-all duration-200 border backdrop-blur",
                    "shadow-[0_15px_35px_rgba(15,23,42,0.08)]",
                    isActive
                      ? "bg-gray-900 text-white border-gray-900"
                      : cn(
                          "bg-white/80 text-gray-700 border-white",
                          "hover:bg-white",
                          "bg-gradient-to-br",
                          tab.accent
                        )
                  )}
                >
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-gray-200" : "text-gray-500"
                    )}
                  >
                    {tab.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
