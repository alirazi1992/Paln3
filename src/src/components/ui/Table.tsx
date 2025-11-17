import React from 'react';
import { cn } from '../../lib/utils/cn';
export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}
export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}
export function Table<T extends {
  id: string;
}>({
  data,
  columns,
  className
}: TableProps<T>) {
  return <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-right">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map(column => <th key={column.key} className="px-4 py-3 text-right text-sm font-medium text-gray-700" style={{
            width: column.width
          }}>
                {column.header}
              </th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(item => <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {columns.map(column => <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                  {column.render(item)}
                </td>)}
            </tr>)}
        </tbody>
      </table>
    </div>;
}
