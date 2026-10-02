import React from 'react';
import { History, Calendar, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { ReconciledInvoice } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';

interface OldItcProps {
  invoices: ReconciledInvoice[];
  onClaimOldItc?: (id: string) => void;
}

export const OldItc: React.FC<OldItcProps> = ({ invoices }) => {
  // Sample old ITC invoices from previous periods
  const oldItcData: ReconciledInvoice[] = [
    {
      id: 'old-01',
      invoiceDate: '2026-05-18',
      supplierName: 'Bharat Electronics Limited',
      supplierGstin: '29AAACB1102A1Z4',
      invoiceNo: 'BEL/2627/0412',
      taxableValue: 1200000,
      igst: 216000,
      cgst: 0,
      sgst: 0,
      cess: 0,
      totalTax: 216000,
      bookItc: 216000,
      twoBItc: 216000,
      difference: 0,
      matchStatus: 'MATCHED',
      financialYear: 'FY 2026-27',
      month: 'May',
      eligibleItc: true,
      reverseCharge: false,
      itcClaimedMonth: 'September 2026',
      remarks: 'Originally delayed due to material quality inspection at Mandideep. Claimed in Sep 3B.',
    },
    {
      id: 'old-02',
      invoiceDate: '2026-06-25',
      supplierName: 'Tata Motors Fleet Logistics Ltd',
      supplierGstin: '27AAACT2727Q1ZB',
      invoiceNo: 'TMFL/PUN/26/891',
      taxableValue: 850000,
      igst: 153000,
      cgst: 0,
      sgst: 0,
      cess: 0,
      totalTax: 153000,
      bookItc: 153000,
      twoBItc: 153000,
      difference: 0,
      matchStatus: 'MATCHED',
      financialYear: 'FY 2026-27',
      month: 'June',
      eligibleItc: true,
      reverseCharge: false,
      itcClaimedMonth: 'September 2026',
      remarks: 'Supplier filed quarterly in IFF. Reflected in GSTR-2B of August, claimed in September.',
    },
    {
      id: 'old-03',
      invoiceDate: '2026-04-12',
      supplierName: 'ABB India Limited',
      supplierGstin: '29AAACA2748F1ZX',
      invoiceNo: 'ABB/BLR/26/1029',
      taxableValue: 1800000,
      igst: 324000,
      cgst: 0,
      sgst: 0,
      cess: 0,
      totalTax: 324000,
      bookItc: 324000,
      twoBItc: 324000,
      difference: 0,
      matchStatus: 'MATCHED',
      financialYear: 'FY 2026-27',
      month: 'April',
      eligibleItc: true,
      reverseCharge: false,
      itcClaimedMonth: 'August 2026',
      remarks: 'Capital goods installment credit (50% upfront, remainder carried forward).',
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
      key: 'totalTax',
      header: 'Total ITC',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-purple-800">{formatINR(row.totalTax)}</span>,
    },
    {
      key: 'itcClaimedMonth',
      header: 'Claimed Month',
      render: (row) => (
        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
          {row.itcClaimedMonth || 'Pending Claim'}
        </span>
      ),
    },
    {
      key: 'matchStatus',
      header: 'Status',
      render: (row) => <StatusBadge status={row.matchStatus} size="sm" />,
    },
    {
      key: 'remarks',
      header: 'Remarks',
      render: (row) => <span className="text-slate-500 text-[11px]">{row.remarks}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <History className="w-[18px] h-[18px]" />
            Previous Period ITC Tracking
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">Old ITC Carry-Forward Register</h2>
          <p className="text-xs text-slate-500">
            Compliant tracking under Section 16(4) of the CGST Act — ensure all prior period unclaimed ITC is availed before the 30th November deadline.
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs">
          <span className="text-purple-700 block font-semibold">Total Prior Period ITC Availed</span>
          <span className="text-base font-bold text-purple-950">₹ 6,93,000</span>
        </div>
      </div>

      <DataTable
        title="Prior Months Inward Supplies Availed in Current Financial Year"
        subtitle="Manage aging invoices and cross-period GSTR-3B Table 4(A)(5) claims"
        data={oldItcData}
        columns={columns}
        searchPlaceholder="Search old invoices, vendors, GSTIN..."
        searchFields={['supplierName', 'supplierGstin', 'invoiceNo', 'remarks']}
        filters={[
          {
            key: 'month',
            label: 'Original Month',
            options: [
              { label: 'April', value: 'April' },
              { label: 'May', value: 'May' },
              { label: 'June', value: 'June' },
            ],
          },
        ]}
        exportFileName="Old_ITC_Register"
      />
    </div>
  );
};
