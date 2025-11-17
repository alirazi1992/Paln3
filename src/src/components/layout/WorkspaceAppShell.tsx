import React from "react";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceTopbar } from "./WorkspaceTopbar";

export interface WorkspaceAppShellProps {
  children: React.ReactNode;
}

export function WorkspaceAppShell({ children }: WorkspaceAppShellProps) {
  return (
    <div
      className="min-h-screen bg-[#F7F8FA] relative overflow-hidden"
      dir="rtl"
      lang="fa"
    >
      {/* پس‌زمینه گرادینت کل صفحه */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F8FA] to-[#eef1f5] pointer-events-none" />

      {/* کل شِل؛ عرض کامل مرورگر، بدون max-width */}
      <div className="relative z-10 flex flex-row-reverse w-full">
        <WorkspaceSidebar />

        <div className="flex-1 flex flex-col min-h-screen text-right px-4 py-6 lg:px-8 lg:py-8">
          <WorkspaceTopbar />

          <main className="flex-1 mt-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
