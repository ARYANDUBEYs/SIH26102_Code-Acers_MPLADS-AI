import React, { useState } from 'react';
import { cn } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { Loader } from '../common/Loader';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found',
  onRowClick,
  className = '',
  rowsPerPage = 10,
  enablePagination = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (!field) return;
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortOrder === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = enablePagination
    ? sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : sortedData;

  if (isLoading) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-8">
        <Loader text="Loading Project Intelligence..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className={cn('w-full flex flex-col bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-card-dark', className)}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-4 py-3.5 select-none',
                    col.sortable && 'cursor-pointer hover:text-slate-200 transition-colors',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-500">
                        {sortField === col.accessor ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-400" /> : <ArrowDown className="w-3 h-3 text-blue-400" />
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedData.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-slate-800/60' : 'hover:bg-slate-800/30',
                  rowIdx % 2 === 1 && 'bg-slate-900/40'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn('px-4 py-3.5 text-slate-200 align-middle', col.cellClassName)}>
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(currentPage * rowsPerPage, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-200">{sortedData.length}</span> records
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 py-1 font-mono font-medium text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
