import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Filter,
  Check,
  Columns
} from 'lucide-react';
import { exportToCSV, exportToExcel, triggerPrint } from '../../utils/exportUtils';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filters?: {
    key: keyof T;
    label: string;
    options: { label: string; value: string }[];
  }[];
  exportFileName?: string;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode; toolbarAction?: React.ReactNode; leftToolbarElements?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  title,
  subtitle,
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchFields,
  filters,
  exportFileName = 'GST_Export',
    onRowClick,
    actions,
    toolbarAction,
    leftToolbarElements,
  }: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filtered & Searched data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        let matches = false;

        if (searchFields && searchFields.length > 0) {
          matches = searchFields.some((f) => {
            const val = (row as Record<string, unknown>)[f as string];
            return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
          });
        } else {
          matches = Object.values(row as Record<string, unknown>).some((val) => {
            return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
          });
        }

        if (!matches) return false;
      }

      // Dropdown filters
      for (const [key, val] of Object.entries(activeFilters)) {
        if (val && val !== 'ALL') {
          const rowVal = String((row as Record<string, unknown>)[key] ?? '');
          if (rowVal.toLowerCase() !== val.toLowerCase()) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, searchFields, activeFilters]);

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];

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
  }, [filteredData, sortKey, sortOrder]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = columns.filter((c) => visibleColumns[c.key]).map((c) => c.header);
    const rows = sortedData.map((row) =>
      columns
        .filter((c) => visibleColumns[c.key])
        .map((c) => {
          const val = (row as Record<string, unknown>)[c.key];
          return val !== undefined && val !== null ? String(val) : '';
        })
    );
    exportToCSV(exportFileName, headers, rows);
  };

  const handleExportExcel = () => {
    const headers = columns.filter((c) => visibleColumns[c.key]).map((c) => c.header);
    const rows = sortedData.map((row) =>
      columns
        .filter((c) => visibleColumns[c.key])
        .map((c) => {
          const val = (row as Record<string, unknown>)[c.key];
          return val !== undefined && val !== null ? String(val) : '';
        })
    );
    exportToExcel(exportFileName, 'GST_Data', headers, rows);
  };

  const activeColumnsList = columns.filter((c) => visibleColumns[c.key]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      {/* Header bar */}
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Control Toolbar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="flex items-center gap-3">{leftToolbarElements}</div><div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-[18px] h-[18px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Action buttons on toolbar */} {toolbarAction}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filters if available */}
          {filters && filters.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-semibold transition-colors ${
                  Object.values(activeFilters).some((v) => v && v !== 'ALL')
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Filter className="w-[18px] h-[18px]" />
                <span>Filters</span>
                {Object.values(activeFilters).some((v) => v && v !== 'ALL') && (
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                )}
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-30 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-xs font-bold text-slate-800">Advanced Filters</span>
                    <button
                      onClick={() => setActiveFilters({})}
                      className="text-[10px] text-purple-600 hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                  {filters.map((filter) => (
                    <div key={String(filter.key)} className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-600">{filter.label}</label>
                      <select
                        value={activeFilters[String(filter.key)] || 'ALL'}
                        onChange={(e) => {
                          setActiveFilters({
                            ...activeFilters,
                            [String(filter.key)]: e.target.value,
                          });
                          setCurrentPage(1);
                        }}
                        className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="ALL">All {filter.label}s</option>
                        {filter.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Column Visibility Removed */}

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
            title="Download CSV"
          >
            <Download className="w-[18px] h-[18px] text-slate-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
            title="Download Excel Spreadsheet"
          >
            <Download className="w-[18px] h-[18px] text-purple-600" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Print */}
          <button
            onClick={triggerPrint}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-600 transition-colors"
            title="Print Table"
          >
            <Printer className="w-[18px] h-[18px] text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Table Area with Sticky Headers */}
      <div className="overflow-auto relative min-h-[220px] max-h-[600px] custom-scrollbar">
        <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              {activeColumnsList.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 select-none' : ''
                  } ${col.className || ''}`}
                >
                  <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortKey === col.key ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-purple-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-purple-600" />
                          )
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

          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={activeColumnsList.length} className="py-12 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-semibold text-slate-600">No matching records found</p>
                    <p className="text-[11px]">Adjust your search query or reset table filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-purple-50/30 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {activeColumnsList.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3 px-4 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-500">
          <span>
            Showing <strong className="text-slate-800 font-semibold">{sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-800 font-semibold">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </strong>{' '}
            of <strong className="text-slate-800 font-semibold">{sortedData.length}</strong> entries
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>

          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}



