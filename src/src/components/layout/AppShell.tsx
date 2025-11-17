import React from 'react';
import { Topbar } from './Topbar';
export interface AppShellProps {
  children: React.ReactNode;
}
export function AppShell({
  children
}: AppShellProps) {
  return <div className="min-h-screen bg-[#F7F8FA] text-right" dir="rtl">
      <Topbar />
      <main className="px-6 py-8 lg:px-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>;
}
