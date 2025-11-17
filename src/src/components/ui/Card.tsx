import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
}
export function Card({
  children,
  className,
  variant = 'default'
}: CardProps) {
  return <div className={cn('rounded-[12px]', {
    'bg-white border border-gray-200 shadow-[0_8px_24px_rgba(15,23,42,0.06)]': variant === 'default',
    'bg-white/80 backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(15,23,42,0.12)]': variant === 'glass'
  }, className)}>
      {children}
    </div>;
}
