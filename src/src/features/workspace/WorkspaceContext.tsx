import React, { createContext, useContext, useState } from 'react';
import { WorkspaceTabId } from './types';

interface WorkspaceContextValue {
  activeTab: WorkspaceTabId;
  setActiveTab: (tab: WorkspaceTabId) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export interface WorkspaceProviderProps {
  children: React.ReactNode;
}

export function WorkspaceProvider({
  children
}: WorkspaceProviderProps) {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('cases');

  return <WorkspaceContext.Provider value={{
    activeTab,
    setActiveTab
  }}>
      {children}
    </WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  return context;
}
