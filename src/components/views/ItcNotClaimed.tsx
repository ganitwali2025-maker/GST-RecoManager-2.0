import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Ban,
  ArrowRight,
  Eye,
  History,
  ShieldCheck,
  Check
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { AuditModal } from '../common/AuditModal';
import { ReconciledInvoice, AuditLog } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface ItcNotClaimedProps {
  invoices: ReconciledInvoice[];
  onClaimInvoice?: (id: string) => void;
}

export const ItcNotClaimed: React.FC<ItcNotClaimedProps> = ({ invoices }) => {
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState<ReconciledInvoice | null>(null);
  const [selectedViewInvoice, setSelectedViewInvoice] = useState<ReconciledInvoice | null>(null);

  // Filter invoices that are not claimed, missing in 2B, or reversed
  const unclaimedInvoices = invoices.filter(
    (i) => i.matchStatus === 'NOT CLAIMED' || i.matchStatus === 'NOT IN 2B' || i.matchStatus === 'REVERSED'
  );

  const potentialItc = 4865000;
  const claimedItc = 3982000;
  const unclaimedItc = 549200; // 331200 + 218000
  const expiredBlockedItc = 190000 + 112000; // Reversed + Blocked

  const sampleAuditTrail: AuditLog[] = [
    {
      id: 'aud-unclaimed-1',
      entityId: 'inv-108',
      entityType: 'Invoice',
      action: 'Modified',
      createdBy: 'CA Rajesh Sharma',
      createdDate: '2026-09-30 17:15:00',
      previousValue: 'Claim Status: Eligible',
      updatedValue: 'Claim Status: Held in Transit (Mandideep Warehouse)',
      ipAddress: '103.24.112.45',
      device: 'Desktop / Chrome',
      remarks: 'Goods received on 02 Oct 2026. Claim shifted to October 2026 GSTR-3B as per Section 16(2)(b).',
    },
  ];

  const handleClaimNow = (row: ReconciledInvoice) => {
    alert(`Success: Invoice #${row.invoiceNo} marked for GSTR-3B Table 4(A)(5) claiming in current tax return.`);
  };

  const columns: ColumnDef<ReconciledInvoice>[] = [
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
      key: 'invoiceDate',
      header: 'Invoice Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.invoiceDate)}</span>,
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
      header: 'Eligible ITC',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-purple-800">{formatINR(row.bookItc)}</span>,
    },
    {
      key: 'matchStatus',
      header: 'Claim Status',
      render: (row) => <StatusBadge status={row.matchStatus} size="sm" />,
    },
    {
      key: 'remarks',
      header: 'Reason',
      render: (row) => <span className="text-slate-500 text-[11px]">{row.remarks}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-center gap-1.5">
          {row.matchStatus === 'NOT CLAIMED' && (
            <button
              onClick={() => handleClaimNow(row)}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Claim Now
            </button>
          )}
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
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Top Cards (Requested in Section 11) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Potential ITC"
          value={formatINR(potentialItc, { compact: true })}
          percentage="Gross Ledger"
          isPositive={true}
          comparisonText="Total purchase credits"
          icon={AlertCircle}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <KpiCard
          title="Claimed ITC"
          value={formatINR(claimedItc, { compact: true })}
          percentage="81.8% Availed"
          isPositive={true}
          comparisonText="In September 3B"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <KpiCard
          title="Unclaimed ITC"
          value={formatINR(unclaimedItc, { compact: true })}
          percentage="Requires Action"
          isPositive={false}
          comparisonText="Pending 2B or delivery"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <KpiCard
          title="Expired / Blocked ITC"
          value={formatINR(expiredBlockedItc, { compact: true })}
          percentage="Sec 17(5) Reversals"
          isPositive={false}
          comparisonText="Non-eligible credits"
          icon={Ban}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
        />
      </div>

      {/* Main Table */}
      <DataTable
        title="Unclaimed & Deferred Input Tax Credit Register"
        subtitle="Invoices pending availing due to Rule 36(4), Goods in Transit (Section 16(2)), or vendor non-filing"
        data={unclaimedInvoices}
        columns={columns}
        searchPlaceholder="Search supplier, GSTIN, invoice..."
        searchFields={['supplierName', 'supplierGstin', 'invoiceNo', 'remarks']}
        exportFileName="Unclaimed_ITC_Register"
      />

      {/* View Modal */}
      {selectedViewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-[20px] border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Unclaimed Invoice Review</h3>
            <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-800">{selectedViewInvoice.supplierName}</div>
              <div className="text-slate-500 font-mono">Invoice: {selectedViewInvoice.invoiceNo}</div>
              <div className="text-purple-700 font-bold">ITC: {formatINR(selectedViewInvoice.bookItc)}</div>
            </div>
            <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <strong>Compliance Reason:</strong> {selectedViewInvoice.remarks}
            </p>
            <div className="flex justify-end gap-2 pt-2">
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

      {/* Audit Modal */}
      {selectedAuditInvoice && (
        <AuditModal
          isOpen={true}
          onClose={() => setSelectedAuditInvoice(null)}
          entityTitle={`Unclaimed ITC: ${selectedAuditInvoice.supplierName} (${selectedAuditInvoice.invoiceNo})`}
          auditTrail={sampleAuditTrail}
        />
      )}
    </div>
  );
};
