import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}
export function GlassCard({
  children,
  className,
  variant = 'light'
}: GlassCardProps) {
  return <div className={cn('rounded-3xl backdrop-blur-xl border shadow-2xl', variant === 'light' ? 'bg-white/10 border-white/20' : 'bg-black/80 border-white/10 text-white', className)}>
      {children}
    </div>;
}
