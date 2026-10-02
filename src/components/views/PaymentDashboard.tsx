import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  Building,
  History,
  Download,
  Printer
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { PaymentEntry, AuditLog } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';
import { AuditModal } from '../common/AuditModal';

interface PaymentDashboardProps {
  payments: PaymentEntry[];
  onAddPayment?: (payment: PaymentEntry) => void;
}

export const PaymentDashboard: React.FC<PaymentDashboardProps> = ({ payments }) => {
  const [selectedAuditPayment, setSelectedAuditPayment] = useState<PaymentEntry | null>(null);
  const [showGenerateChallanModal, setShowGenerateChallanModal] = useState(false);

  // Compute KPI sums
  const totalLiability = 4309000;
  const itcUtilized = 3982000;
  const cashPaid = 4080000;
  const paidAmount = 4080000;
  const balancePayable = 3300000; // Pending for September

  const sampleAuditLogs: AuditLog[] = [
    {
      id: 'aud-pay-1',
      entityId: 'pay-01',
      entityType: 'Payment',
      action: 'Created',
      createdBy: 'CA Rajesh Sharma',
      createdDate: '2026-09-20 14:10:00',
      previousValue: 'Status: Pending',
      updatedValue: 'Status: Paid (CIN: SBI789021345)',
      ipAddress: '103.24.112.45',
      device: 'Desktop / Chrome',
      remarks: 'Payment cleared via SBI Corporate Netbanking. BRN generated.',
    },
  ];

  const columns: ColumnDef<PaymentEntry>[] = [
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.paymentDate)}</span>,
    },
    {
      key: 'challanNo',
      header: 'Challan No / CPIN',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-slate-900">{row.challanNo}</div>
          <div className="text-[10px] text-slate-400 font-mono">Bank: {row.bankName}</div>
        </div>
      ),
    },
    {
      key: 'taxPeriod',
      header: 'Tax Period',
      render: (row) => <span className="font-medium text-slate-800">{row.taxPeriod}</span>,
    },
    {
      key: 'igst',
      header: 'IGST',
      align: 'right',
      render: (row) => <span className="font-mono">{formatINR(row.igst)}</span>,
    },
    {
      key: 'cgst',
      header: 'CGST',
      align: 'right',
      render: (row) => <span className="font-mono">{formatINR(row.cgst)}</span>,
    },
    {
      key: 'sgst',
      header: 'SGST',
      align: 'right',
      render: (row) => <span className="font-mono">{formatINR(row.sgst)}</span>,
    },
    {
      key: 'cess',
      header: 'Cess',
      align: 'right',
      render: (row) => <span className="font-mono">{formatINR(row.cess)}</span>,
    },
    {
      key: 'total',
      header: 'Total Paid',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-purple-700">{formatINR(row.total)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      sortable: false,
      render: (row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setSelectedAuditPayment(row)}
            className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100"
            title="Audit Trail"
          >
            <History className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => alert(`Downloading PMT-06 GST Challan receipt for CPIN: ${row.challanNo}`)}
            className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-slate-100"
            title="Download PMT-06 Receipt"
          >
            <Download className="w-[18px] h-[18px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 KPI CARDS (Requested exact titles) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Total Liability"
          value={formatINR(totalLiability, { compact: true })}
          percentage="Gross GSTR-3B"
          isPositive={true}
          comparisonText="Sep 2026"
          icon={CreditCard}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <KpiCard
          title="Paid Amount"
          value={formatINR(paidAmount, { compact: true })}
          percentage="Settled via bank"
          isPositive={true}
          comparisonText="Prior tax period"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <KpiCard
          title="Balance Payable"
          value={formatINR(balancePayable, { compact: true })}
          percentage="Due 20 Oct"
          isPositive={false}
          comparisonText="September cash dues"
          icon={Clock}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <KpiCard
          title="ITC Utilized"
          value={formatINR(itcUtilized, { compact: true })}
          percentage="Electronic Ledger"
          isPositive={true}
          comparisonText="Saved cash outflow"
          icon={FileText}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <KpiCard
          title="Cash Paid"
          value={formatINR(cashPaid, { compact: true })}
          percentage="Electronic Cash Ledger"
          isPositive={true}
          comparisonText="Net of ITC offset"
          icon={Building}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
        />
      </div>

      {/* Main Payment Tracking Table */}
      <DataTable
        title="GST Payment & PMT-06 Challan Register"
        subtitle="Historical CPIN challans, Bank Reference Numbers (BRN) and electronic cash ledger reconciliations"
        data={payments}
        columns={columns}
        searchPlaceholder="Search challan, CPIN, bank, tax period..."
        searchFields={['challanNo', 'taxPeriod', 'bankName', 'status']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Partially Paid', value: 'Partially Paid' },
            ],
          },
        ]}
        actions={
          <button
            onClick={() => setShowGenerateChallanModal(true)}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-[18px] h-[18px]" />
            Create PMT-06 Challan
          </button>
        }
        exportFileName="GST_Payment_Register"
      />

      {/* Generate Challan Modal */}
      {showGenerateChallanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-[20px] border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900">Generate PMT-06 GST Payment Challan</h3>
            <p className="text-xs text-slate-500">
              Prepare draft CPIN for payment through NEFT/RTGS or Authorized Netbanking.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tax Period</label>
                <input type="text" readOnly value="September 2026" className="w-full p-2 bg-slate-50 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">IGST Cash</label>
                  <input type="text" defaultValue="₹ 14,20,000" className="w-full p-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CGST + SGST</label>
                  <input type="text" defaultValue="₹ 18,80,000" className="w-full p-2 border rounded-lg font-mono" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Mode</label>
                <select className="w-full p-2 border rounded-lg bg-white">
                  <option>NEFT/RTGS (State Bank of India)</option>
                  <option>Internet Banking (HDFC Bank)</option>
                  <option>Over the Counter (OTC)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowGenerateChallanModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('PMT-06 Challan #23102000210492 created successfully and recorded in PostgreSQL.');
                  setShowGenerateChallanModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
              >
                Generate CPIN & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {selectedAuditPayment && (
        <AuditModal
          isOpen={true}
          onClose={() => setSelectedAuditPayment(null)}
          entityTitle={`Payment Challan: ${selectedAuditPayment.challanNo} (${selectedAuditPayment.taxPeriod})`}
          auditTrail={sampleAuditLogs}
        />
      )}
    </div>
  );
};
