import React from 'react';
import { Landmark, Scale, ShieldAlert, CheckCircle2, CreditCard, Plus } from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { RcmEntry } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface RcmViewProps {
  rcmEntries: RcmEntry[];
  onAddRcm?: (entry: RcmEntry) => void;
}

export const RcmView: React.FC<RcmViewProps> = ({ rcmEntries }) => {
  // Aggregate RCM cards (Requested in Section 14)
  const rcmPurchases = 18; // count
  const rcmTaxableValue = rcmEntries.reduce((sum, r) => sum + r.taxableValue, 0);
  const rcmIgst = rcmEntries.reduce((sum, r) => sum + r.igst, 0);
  const rcmCgst = rcmEntries.reduce((sum, r) => sum + r.cgst, 0);
  const rcmSgst = rcmEntries.reduce((sum, r) => sum + r.sgst, 0);
  const rcmPaid = rcmEntries.filter(r => r.paymentStatus === 'Paid').reduce((sum, r) => sum + r.totalRcm, 0);

  const columns: ColumnDef<RcmEntry>[] = [
    {
      key: 'date',
      header: 'Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.date)}</span>,
    },
    {
      key: 'vendorName',
      header: 'Vendor Name',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.vendorName}</div>
          <div className="text-[10px] text-purple-700 font-mono">{row.vendorGstin}</div>
        </div>
      ),
    },
    {
      key: 'invoiceNo',
      header: 'Invoice No',
      render: (row) => <span className="font-mono font-bold text-slate-800">{row.invoiceNo}</span>,
    },
    {
      key: 'natureOfSupply',
      header: 'Nature of Supply',
      render: (row) => (
        <span className="font-medium text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md text-[11px] border border-purple-200">
          {row.natureOfSupply}
        </span>
      ),
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
      key: 'totalRcm',
      header: 'Total RCM',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-amber-700">{formatINR(row.totalRcm)}</span>,
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (row) => <StatusBadge status={row.paymentStatus} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 6 TOP DASHBOARD CARDS (Requested in Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        <KpiCard
          title="RCM Purchases"
          value={`${rcmPurchases} Invoices`}
          percentage="Notified Supplies"
          isPositive={true}
          comparisonText="Sec 9(3) & 9(4)"
          icon={Landmark}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <KpiCard
          title="RCM Taxable Value"
          value={formatINR(rcmTaxableValue, { compact: true })}
          percentage="Expenses Incurred"
          isPositive={true}
          comparisonText="Freight & Legal fees"
          icon={Scale}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <KpiCard
          title="RCM IGST"
          value={formatINR(rcmIgst, { compact: true })}
          percentage="Import of services"
          isPositive={true}
          comparisonText="Interstate RCM"
          icon={ShieldAlert}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <KpiCard
          title="RCM CGST"
          value={formatINR(rcmCgst, { compact: true })}
          percentage="Central portion"
          isPositive={true}
          comparisonText="Intrastate supply"
          icon={Landmark}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <KpiCard
          title="RCM SGST"
          value={formatINR(rcmSgst, { compact: true })}
          percentage="State portion"
          isPositive={true}
          comparisonText="Intrastate supply"
          icon={Landmark}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
        />

        <KpiCard
          title="RCM Paid"
          value={formatINR(rcmPaid, { compact: true })}
          percentage="Cash Deposited"
          isPositive={true}
          comparisonText="In Electronic Cash Ledger"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Main RCM Table */}
      <DataTable
        title="Reverse Charge Mechanism Register (Section 9(3) & 9(4))"
        subtitle="GTA consignments, Legal advocate fees, Security personnel, and Director remuneration subject to compulsory cash payment"
        data={rcmEntries}
        columns={columns}
        searchPlaceholder="Search vendor, nature of supply, invoice..."
        searchFields={['vendorName', 'vendorGstin', 'natureOfSupply', 'invoiceNo']}
        filters={[
          {
            key: 'paymentStatus',
            label: 'Payment Status',
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
            ],
          },
          {
            key: 'natureOfSupply',
            label: 'Supply Nature',
            options: [
              { label: 'GTA Services', value: 'GTA Services' },
              { label: 'Legal Services by Advocate', value: 'Legal Services by Advocate' },
              { label: 'Security Personnel Services', value: 'Security Personnel Services' },
              { label: 'Director Remuneration', value: 'Director Remuneration' },
            ],
          },
        ]}
        actions={
          <button
            onClick={() => alert('New RCM self-invoice generator opened.')}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-[18px] h-[18px]" />
            Add RCM Inward Supply
          </button>
        }
        exportFileName="GST_RCM_Register"
      />
    </div>
  );
};
