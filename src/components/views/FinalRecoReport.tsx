import React, { useState } from 'react';
import {
  FileText,
  Eye,
  History,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  RotateCcw,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { AuditModal } from '../common/AuditModal';
import { ReconciledInvoice, MatchStatus, AuditLog } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface FinalRecoReportProps {
  invoices: ReconciledInvoice[];
  onUpdateInvoice: (updated: ReconciledInvoice) => void;
  onDeleteInvoice: (id: string) => void;
}

export const FinalRecoReport: React.FC<FinalRecoReportProps> = ({
  invoices,
  onUpdateInvoice,
  onDeleteInvoice,
}) => {
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState<ReconciledInvoice | null>(null);
  const [selectedViewInvoice, setSelectedViewInvoice] = useState<ReconciledInvoice | null>(null);
  const [selectedEditInvoice, setSelectedEditInvoice] = useState<ReconciledInvoice | null>(null);

  // Compute Summary Cards
  const totalInvoices = invoices.length;
  const matchedCount = invoices.filter(i => i.matchStatus === 'MATCHED').length;
  const mismatchCount = invoices.filter(i => i.matchStatus === 'AMOUNT MISMATCH' || i.matchStatus === 'GST MISMATCH').length;
  const missingIn2BCount = invoices.filter(i => i.matchStatus === 'NOT IN 2B').length;
  const duplicateCount = invoices.filter(i => i.matchStatus === 'DUPLICATE').length;
  const notClaimedCount = invoices.filter(i => i.matchStatus === 'NOT CLAIMED').length;
  const reversedCount = invoices.filter(i => i.matchStatus === 'REVERSED').length;

  const defaultAuditTrail: AuditLog[] = [
    {
      id: 'aud-inv-1',
      entityId: 'reco-1',
      entityType: 'Invoice',
      action: 'Reconciled',
      createdBy: 'System Reco Engine',
      createdDate: '2026-10-01 09:30:15',
      previousValue: 'Status: PENDING',
      updatedValue: 'Status: MATCHED (Confidence: 100%)',
      ipAddress: '127.0.0.1 (PostgreSQL Worker)',
      device: 'Server Task Engine',
      remarks: 'Automated exact match algorithm matched GSTIN, Invoice No and Tax amounts with GSTR-2B JSON import.',
    },
  ];

  const columns: ColumnDef<ReconciledInvoice>[] = [
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.invoiceDate)}</span>,
    },
    {
      key: 'supplierName',
      header: 'Supplier Name',
      render: (row) => (
        <div className="max-w-[200px]">
          <div className="font-bold text-slate-900 truncate" title={row.supplierName}>
            {row.supplierName}
          </div>
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
      header: 'Book ITC',
      align: 'right',
      render: (row) => <span className="font-mono font-medium text-purple-900">{formatINR(row.bookItc)}</span>,
    },
    {
      key: 'twoBItc',
      header: '2B ITC',
      align: 'right',
      render: (row) => (
        <span className={`font-mono font-medium ${row.twoBItc === 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
          {formatINR(row.twoBItc)}
        </span>
      ),
    },
    {
      key: 'difference',
      header: 'Difference',
      align: 'right',
      render: (row) => (
        <span className={`font-mono font-bold ${row.difference > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
          {row.difference > 0 ? formatINR(row.difference) : '₹ 0.00'}
        </span>
      ),
    },
    {
      key: 'matchStatus',
      header: 'Match Status',
      render: (row) => <StatusBadge status={row.matchStatus} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setSelectedViewInvoice(row)}
            className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setSelectedAuditInvoice(row)}
            className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100"
            title="Audit Trail"
          >
            <History className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setSelectedEditInvoice(row)}
            className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
            title="Edit Status / Remarks"
          >
            <Edit className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete invoice ${row.invoiceNo}?`)) {
                onDeleteInvoice(row.id);
              }
            }}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
            title="Delete Row"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Final GST Reconciliation Report</h2>
          <p className="text-xs text-slate-500">
            Comprehensive audit-ready reconciliation matching ERP Book purchases with government GSTR-2B data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-purple-100 text-purple-800 rounded-xl">
            September 2026 • Live Sync
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS (Requested in Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Invoices</span>
          <span className="text-lg font-bold text-slate-900">{totalInvoices}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Matched</span>
          <span className="text-lg font-bold text-emerald-700">{matchedCount}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-amber-200 bg-amber-50/20 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Mismatch</span>
          <span className="text-lg font-bold text-amber-700">{mismatchCount}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-rose-200 bg-rose-50/20 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Missing in 2B</span>
          <span className="text-lg font-bold text-rose-700">{missingIn2BCount}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 bg-slate-50 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Duplicate</span>
          <span className="text-lg font-bold text-slate-800">{duplicateCount}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-blue-200 bg-blue-50/20 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Not Claimed</span>
          <span className="text-lg font-bold text-blue-700">{notClaimedCount}</span>
        </div>

        <div className="bg-white rounded-xl p-3 border border-purple-200 bg-purple-50/20 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Reversed</span>
          <span className="text-lg font-bold text-purple-700">{reversedCount}</span>
        </div>
      </div>

      {/* Main Table with all required filters */}
      <DataTable
        title="Reconciled Inward Supplies (Purchase Register vs GSTR-2B)"
        subtitle="Filter by status, supplier or GSTIN. Actions allow full audit trail inspection and status adjustments."
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
              { label: 'GST Mismatch', value: 'GST MISMATCH' },
              { label: 'Not in 2B', value: 'NOT IN 2B' },
              { label: 'Duplicate', value: 'DUPLICATE' },
              { label: 'Not Claimed', value: 'NOT CLAIMED' },
              { label: 'Reversed', value: 'REVERSED' },
            ],
          },
          {
            key: 'month',
            label: 'Month',
            options: [
              { label: 'September', value: 'September' },
              { label: 'August', value: 'August' },
              { label: 'July', value: 'July' },
            ],
          },
        ]}
        exportFileName="Final_GST_Reconciliation_Report"
      />

      {/* View Details Modal */}
      {selectedViewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-[20px] border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Invoice Reconciliation Details</h3>
                <span className="text-xs text-purple-700 font-mono">{selectedViewInvoice.invoiceNo}</span>
              </div>
              <StatusBadge status={selectedViewInvoice.matchStatus} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Supplier</span>
                  <span className="font-bold text-slate-800">{selectedViewInvoice.supplierName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN</span>
                  <span className="font-mono text-slate-800">{selectedViewInvoice.supplierGstin}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Taxable Value</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(selectedViewInvoice.taxableValue)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Book ITC</span>
                  <span className="font-mono font-bold text-purple-700">{formatINR(selectedViewInvoice.bookItc)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">2B ITC</span>
                  <span className="font-mono font-bold text-emerald-700">{formatINR(selectedViewInvoice.twoBItc)}</span>
                </div>
              </div>

              <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                <span className="text-purple-800 font-bold block text-[11px]">Audit Remarks</span>
                <p className="text-purple-950 mt-0.5">{selectedViewInvoice.remarks || 'No issues found during automatic matching.'}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedViewInvoice(null)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {selectedEditInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-[20px] border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Modify Reconciliation Status</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Number</label>
                <input type="text" readOnly value={selectedEditInvoice.invoiceNo} className="w-full p-2 bg-slate-50 border rounded-lg font-mono" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Match Status</label>
                <select
                  defaultValue={selectedEditInvoice.matchStatus}
                  id="edit-status-select"
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="MATCHED">MATCHED</option>
                  <option value="AMOUNT MISMATCH">AMOUNT MISMATCH</option>
                  <option value="GST MISMATCH">GST MISMATCH</option>
                  <option value="NOT IN 2B">NOT IN 2B</option>
                  <option value="DUPLICATE">DUPLICATE</option>
                  <option value="NOT CLAIMED">NOT CLAIMED</option>
                  <option value="REVERSED">REVERSED</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Audit Remarks</label>
                <textarea
                  id="edit-remarks-text"
                  defaultValue={selectedEditInvoice.remarks || ''}
                  rows={3}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Reason for manual adjustment..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedEditInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const statusEl = document.getElementById('edit-status-select') as HTMLSelectElement;
                  const remarksEl = document.getElementById('edit-remarks-text') as HTMLTextAreaElement;
                  if (statusEl && remarksEl) {
                    onUpdateInvoice({
                      ...selectedEditInvoice,
                      matchStatus: statusEl.value as MatchStatus,
                      remarks: remarksEl.value,
                    });
                  }
                  setSelectedEditInvoice(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
              >
                Save Changes to DB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {selectedAuditInvoice && (
        <AuditModal
          isOpen={true}
          onClose={() => setSelectedAuditInvoice(null)}
          entityTitle={`Invoice #${selectedAuditInvoice.invoiceNo} (${selectedAuditInvoice.supplierName})`}
          auditTrail={selectedAuditInvoice.auditTrail || defaultAuditTrail}
        />
      )}
    </div>
  );
};
