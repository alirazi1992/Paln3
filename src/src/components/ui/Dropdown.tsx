import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../lib/utils/cn';
export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  placement?: DropdownPlacement;
  dir?: 'rtl' | 'ltr';
}

export function Dropdown({
  trigger,
  items,
  align = 'right',
  placement,
  dir = 'ltr'
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const resolvedPlacement = placement ?? (align === 'right' ? 'bottom-end' : 'bottom-start');
  const verticalClass = resolvedPlacement.startsWith('top') ? 'bottom-full mb-2' : 'top-full mt-2';
  const horizontalClass = (() => {
    if (resolvedPlacement.endsWith('start')) {
      return dir === 'rtl' ? 'right-0' : 'left-0';
    }
    if (resolvedPlacement.endsWith('end')) {
      return dir === 'rtl' ? 'left-0' : 'right-0';
    }
    return align === 'right' ? 'right-0' : 'left-0';
  })();

  return <div className="relative" ref={dropdownRef} dir={dir}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && <div className={cn('absolute w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50', verticalClass, horizontalClass)}>
          {items.map(item => <button key={item.id} onClick={() => {
        item.onClick();
        setIsOpen(false);
      }} className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-50 flex flex-row-reverse items-center gap-2 transition-colors">
              {item.icon}
              {item.label}
            </button>)}
        </div>}
    </div>;
}
