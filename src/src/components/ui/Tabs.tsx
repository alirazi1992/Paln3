import React, { useState } from 'react';
import { cn } from '../../lib/utils/cn';
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}
export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills';
  className?: string;
}
export function Tabs({
  tabs,
  defaultTab,
  variant = 'default',
  className
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  return <div className={cn('w-full', className)}>
      <div className={cn('flex gap-2', variant === 'pills' ? 'bg-gray-100 p-1 rounded-2xl' : 'border-b border-gray-200')}>
        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('px-4 py-2 text-sm font-medium transition-all duration-200', variant === 'pills' && 'rounded-xl', activeTab === tab.id ? variant === 'pills' ? 'bg-black text-white shadow-sm' : 'border-b-2 border-black text-black' : 'text-gray-600 hover:text-gray-900')}>
            {tab.label}
          </button>)}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>;
}