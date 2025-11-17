import React, { useState } from 'react';
import { cn } from '../../lib/utils/cn';
import { Icon } from './Icon';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  className,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'جستجوی پرونده یا کد'
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredData = searchable
    ? data.filter(item =>
        Object.values(item).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : data;

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return aVal > bVal ? modifier : -modifier;
      })
    : filteredData;

  return (
    <div className={cn('w-full', className)}>
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pr-4 pl-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-right text-sm font-semibold text-gray-700',
                    column.sortable && 'cursor-pointer hover:bg-gray-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex flex-row-reverse items-center justify-between">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <Icon
                        name="chevronDown"
                        size={16}
                        className={cn('transition-transform', sortDirection === 'asc' && 'rotate-180')}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedData.map(item => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn('hover:bg-gray-50 transition-colors', onRowClick && 'cursor-pointer')}
              >
                {columns.map(column => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900 text-right">
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {sortedData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>هیچ رکوردی با فیلتر فعلی پیدا نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
