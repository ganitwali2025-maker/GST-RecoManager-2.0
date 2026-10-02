import React, { useState } from 'react';
import { CalendarRange, Download, Filter, Search, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { Gstr2BEntry } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface Gstr2bAllMonthsProps {
  entries: Gstr2BEntry[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}

export const Gstr2bAllMonths: React.FC<Gstr2bAllMonthsProps> = ({
  entries,
  selectedMonth,
  onSelectMonth,
}) => {
  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  // Filter entries for the selected month tab
  const monthEntries = entries.filter(
    (e) => e.month.toLowerCase() === selectedMonth.toLowerCase()
  );

  const totalEligibleTax = monthEntries
    .filter((e) => e.itcEligibility === 'Yes')
    .reduce((sum, e) => sum + e.totalTax, 0);

  const totalIneligibleTax = monthEntries
    .filter((e) => e.itcEligibility === 'No')
    .reduce((sum, e) => sum + e.totalTax, 0);

  const columns: ColumnDef<Gstr2BEntry>[] = [
    {
      key: 'gstin',
      header: 'GSTIN of Supplier',
      render: (row) => <span className="font-mono text-purple-700 font-semibold">{row.gstin}</span>,
    },
    {
      key: 'supplierName',
      header: 'Supplier Name',
      render: (row) => <span className="font-bold text-slate-900">{row.supplierName}</span>,
    },
    {
      key: 'invoiceNo',
      header: 'Invoice No',
      render: (row) => <span className="font-mono font-medium">{row.invoiceNo}</span>,
    },
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      render: (row) => <span className="text-slate-700">{formatDate(row.invoiceDate)}</span>,
    },
    {
      key: 'taxableValue',
      header: 'Taxable Value',
      align: 'right',
      render: (row) => <span className="font-mono">{formatINR(row.taxableValue)}</span>,
    },
    {
      key: 'igst',
      header: 'IGST',
      align: 'right',
      render: (row) => <span className="font-mono text-indigo-700">{row.igst > 0 ? formatINR(row.igst) : '-'}</span>,
    },
    {
      key: 'cgst',
      header: 'CGST',
      align: 'right',
      render: (row) => <span className="font-mono text-blue-700">{row.cgst > 0 ? formatINR(row.cgst) : '-'}</span>,
    },
    {
      key: 'sgst',
      header: 'SGST',
      align: 'right',
      render: (row) => <span className="font-mono text-teal-700">{row.sgst > 0 ? formatINR(row.sgst) : '-'}</span>,
    },
    {
      key: 'cess',
      header: 'CESS',
      align: 'right',
      render: (row) => <span className="font-mono text-slate-400">{row.cess > 0 ? formatINR(row.cess) : '₹ 0'}</span>,
    },
    {
      key: 'totalTax',
      header: 'Total Tax',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-slate-900">{formatINR(row.totalTax)}</span>,
    },
    {
      key: 'itcEligibility',
      header: 'ITC Eligibility',
      align: 'center',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            row.itcEligibility === 'Yes'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {row.itcEligibility}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      align: 'center',
      render: (row) => (
        <span className="font-mono text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
          {row.source}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header and month tabs */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <CalendarRange className="w-[18px] h-[18px]" />
              Annual GSTR-2B Repository
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">GSTR-2B All Months (FY 2026-27)</h2>
            <p className="text-xs text-slate-500">
              Browse government auto-drafted ITC statements month by month as filed by suppliers in GSTR-1 / IFF.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Eligible ITC</span>
              <span className="text-sm font-bold text-emerald-700">{formatINR(totalEligibleTax)}</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Ineligible (Sec 17(5))</span>
              <span className="text-sm font-bold text-rose-600">{formatINR(totalIneligibleTax)}</span>
            </div>
          </div>
        </div>

        {/* 12 MONTH TABS (Requested in Section 12) */}
        <div className="flex overflow-x-auto pb-1 gap-1.5 border-t border-slate-100 pt-3 custom-scrollbar">
          {months.map((m) => {
            const isSelected = m.toLowerCase() === selectedMonth.toLowerCase();
            return (
              <button
                key={m}
                onClick={() => onSelectMonth(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm font-bold'
                    : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200'
                }`}
              >
                {m} 2026
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        title={`GSTR-2B Statement for ${selectedMonth} 2026`}
        subtitle="Auto-drafted ITC reflected based on counterparty supplier filings"
        data={monthEntries}
        columns={columns}
        searchPlaceholder="Search GSTIN, supplier name, invoice no..."
        searchFields={['gstin', 'supplierName', 'invoiceNo', 'source']}
        filters={[
          {
            key: 'itcEligibility',
            label: 'Eligibility',
            options: [
              { label: 'Eligible (Yes)', value: 'Yes' },
              { label: 'Ineligible (No)', value: 'No' },
            ],
          },
          {
            key: 'source',
            label: 'Filing Source',
            options: [
              { label: 'GSTR-1', value: 'GSTR-1' },
              { label: 'IFF (Quarterly)', value: 'IFF' },
            ],
          },
        ]}
        exportFileName={`GSTR2B_${selectedMonth}_2026`}
      />
    </div>
  );
};
