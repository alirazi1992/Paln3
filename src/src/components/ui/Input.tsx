import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
          {label}
        </label>}
      <input className={cn('w-full px-4 py-2.5 rounded-xl border border-gray-200 text-right', 'bg-white text-gray-900 placeholder:text-gray-400', 'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent', 'transition-all duration-200', 'disabled:bg-gray-50 disabled:cursor-not-allowed', error && 'border-red-500 focus:ring-red-500', className)} {...props} />
      {error && <p className="mt-1.5 text-sm text-red-600 text-right">{error}</p>}
    </div>;
}
