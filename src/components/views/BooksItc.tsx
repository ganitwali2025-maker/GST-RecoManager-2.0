import React from 'react';
import { BookOpen, UploadCloud, FileSpreadsheet, Plus, Download, CheckCircle2 } from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { ReconciledInvoice } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface BooksItcProps {
  invoices: ReconciledInvoice[];
  onOpenImport: () => void;
  onAddInvoice?: () => void;
}

export const BooksItc: React.FC<BooksItcProps> = ({ invoices, onOpenImport }) => {
  const columns: ColumnDef<ReconciledInvoice>[] = [
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.invoiceDate)}</span>,
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.supplierName}</div>
          <div className="text-[10px] text-purple-700 font-mono">{row.supplierGstin}</div>
        </div>
      ),
    },
    {
      key: 'invoiceNo',
      header: 'Invoice No',
      render: (row) => <span className="font-mono font-bold text-slate-800">{row.invoiceNo}</span>,
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
      key: 'bookItc',
      header: 'Total ITC',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-purple-800">{formatINR(row.bookItc)}</span>,
    },
    {
      key: 'twoBItc',
      header: '2B Status',
      align: 'center',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            row.twoBItc > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}
        >
          {row.twoBItc > 0 ? 'Reflected' : 'Missing'}
        </span>
      ),
    },
    {
      key: 'eligibleItc',
      header: 'Claim Status',
      align: 'center',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            row.eligibleItc ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {row.eligibleItc ? 'Eligible' : 'Ineligible'}
        </span>
      ),
    },
    {
      key: 'matchStatus',
      header: 'Reconciliation Status',
      render: (row) => <StatusBadge status={row.matchStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <BookOpen className="w-[18px] h-[18px]" />
            ERP Inward Register
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Books ITC Register (Purchase Daybook)</h2>
          <p className="text-xs text-slate-500">
            Source records imported from ERP / Tally Prime with real-time sync to PostgreSQL table <code className="text-purple-700 font-mono">gst_book_purchases</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImport}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <UploadCloud className="w-[18px] h-[18px]" />
            Import Excel / Paste Data
          </button>
        </div>
      </div>

      <DataTable
        title="Books Purchase Register with GSTR-2B Tracking"
        subtitle="Manage all inward invoices entered into ERP accounting books"
        data={invoices}
        columns={columns}
        searchPlaceholder="Search supplier, GSTIN, invoice number..."
        searchFields={['supplierName', 'supplierGstin', 'invoiceNo', 'matchStatus']}
        filters={[
          {
            key: 'matchStatus',
            label: 'Status',
            options: [
              { label: 'Matched', value: 'MATCHED' },
              { label: 'Amount Mismatch', value: 'AMOUNT MISMATCH' },
              { label: 'Not in 2B', value: 'NOT IN 2B' },
              { label: 'Reversed', value: 'REVERSED' },
            ],
          },
        ]}
        exportFileName="Books_ITC_Register"
      />
    </div>
  );
};
