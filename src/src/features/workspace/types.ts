import { Island } from '../projects/types';

export type WorkspaceTabId = 'cases' | 'calendar' | 'reports';

export interface WorkspaceTab {
  id: WorkspaceTabId;
  label: string;
  description: string;
  accent: string;
}

export interface SnapshotMetric {
  id: string;
  label: string;
  value: string;
  trend?: {
    isPositive: boolean;
    value: string;
  };
}

export interface SnapshotReminder {
  id: string;
  title: string;
  owner: string;
  due: string;
}

export interface WorkspaceSnapshot {
  headline: string;
  subline: string;
  priority: string;
  metrics: SnapshotMetric[];
  reminders: SnapshotReminder[];
}

export type JourneyState = Record<WorkspaceTabId, Island[]>;
