import React, { useState } from 'react';
import {
  ReceiptText,
  TrendingUp,
  FileText,
  Download,
  Plus,
  QrCode,
  Truck,
  UploadCloud,
  Calendar,
  PieChart,
  ChevronDown, Eye, Edit2, Trash2
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
import { DataTable, ColumnDef } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { Gstr1Entry } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';
import { Gstr1ImportModal } from './Gstr1ImportModal';

interface Gstr1ViewProps {
  entries: Gstr1Entry[];
  onAddGstr1Entry?: (entry: Gstr1Entry) => void;
}

export const Gstr1View: React.FC<Gstr1ViewProps> = ({ entries }) => {
  const [activeTab, setActiveTab] = useState<'B2B' | 'B2C' | 'CDNR' | 'CDNUR' | 'EXP' | 'NIL' | 'EXEMPT' | 'HSN'>('B2B');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Computed KPI Cards
  const totalSales = entries.reduce((sum, e) => sum + e.totalInvoiceValue, 0);
  const taxableSales = entries.reduce((sum, e) => sum + e.taxableValue, 0);
  const totalIgst = entries.reduce((sum, e) => sum + e.igst, 0);
  const totalCgst = entries.reduce((sum, e) => sum + e.cgst, 0);
  const totalSgst = entries.reduce((sum, e) => sum + e.sgst, 0);
  const invoiceCount = entries.length;

  const handleGenerateJson = () => {
    alert('GSTR-1 JSON generated and downloaded! Upload this directly to the GST Portal.');
  };

  const columns: ColumnDef<Gstr1Entry>[] = [
    {
      key: 'financialYear',
      header: 'Financial Year',
      render: (row) => <span className="text-slate-600 font-medium">FY 2026-27</span>,
    },
    {
      key: 'quarter',
      header: 'Quarter',
      render: (row) => <span className="text-slate-600 font-medium">Q2 (Jul-Sep)</span>,
    },
    {
      key: 'month',
      header: 'Month',
      render: (row) => <span className="text-slate-600 font-medium">September</span>,
    },
    {
      key: 'invoiceDate',
      header: 'Invoice Date',
      render: (row) => <span className="font-medium text-slate-700">{formatDate(row.invoiceDate)}</span>,
    },
    {
      key: 'customerName',
      header: 'Supplier / Party Name',
      render: (row) => (
        <div>
          <div className="font-bold text-[#1F2937]">{row.customerName}</div>
          <div className="text-[10px] text-[#6D28D9] font-mono">{row.customerGstin}</div>
        </div>
      ),
    },
    {
      key: 'customerGstin',
      header: 'GST No',
      render: (row) => <span className="font-mono text-[#6B7280]">{row.customerGstin}</span>,
    },
    {
      key: 'invoiceNo',
      header: 'Invoice No',
      render: (row) => <span className="font-mono font-bold text-[#1F2937]">{row.invoiceNo}</span>,
    },
    {
      key: 'taxableValue',
      header: 'Taxable Value',
      align: 'right',
      render: (row) => <span className="font-mono font-semibold text-[#1F2937]">{formatINR(row.taxableValue)}</span>,
    },
    {
      key: 'igst',
      header: 'IGST',
      align: 'right',
      render: (row) => <span className="font-mono text-[#6D28D9]">{row.igst > 0 ? formatINR(row.igst) : '₹ 0.00'}</span>,
    },
    {
      key: 'cgst',
      header: 'CGST',
      align: 'right',
      render: (row) => <span className="font-mono text-[#6D28D9]">{row.cgst > 0 ? formatINR(row.cgst) : '₹ 0.00'}</span>,
    },
    {
      key: 'sgst',
      header: 'SGST',
      align: 'right',
      render: (row) => <span className="font-mono text-[#6D28D9]">{row.sgst > 0 ? formatINR(row.sgst) : '₹ 0.00'}</span>,
    },
    {
      key: 'totalTax',
      header: 'Total Tax',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-[#6D28D9]">{formatINR(row.igst + row.cgst + row.sgst)}</span>,
    },
    {
      key: 'totalInvoiceValue',
      header: 'Total Invoice Value',
      align: 'right',
      render: (row) => <span className="font-mono font-bold text-[#6D28D9]">{formatINR(row.totalInvoiceValue)}</span>,
    },
    {key: 'actions', header: 'Actions', align: 'center', render: (row) => (<div className='flex items-center justify-center gap-2'><button className='p-1.5 text-purple-600 bg-purple-50 rounded hover:bg-purple-100 transition-colors' title='View'><Eye className='w-[14px] h-[14px]' /></button><button className='p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors' title='Edit'><Edit2 className='w-[14px] h-[14px]' /></button><button className='p-1.5 text-rose-600 bg-rose-50 rounded hover:bg-rose-100 transition-colors' title='Delete'><Trash2 className='w-[14px] h-[14px]' /></button><button className='p-1.5 text-slate-600 bg-slate-50 rounded hover:bg-slate-100 transition-colors' title='Audit'><FileText className='w-[14px] h-[14px]' /></button></div>)}
  ];

  const leftToolbar = (
    <div className="flex items-end gap-3">
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[#6B7280] block ml-1">Financial Year</label>
        <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9] transition-colors min-w-[145px]">
          <div className="flex items-center gap-[9px] min-w-0">
            <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
            <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">FY 2026-27</span>
          </div>
          <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
          <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            <option>FY 2026-27</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[#6B7280] block ml-1">Quarter</label>
        <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9] transition-colors min-w-[155px]">
          <div className="flex items-center gap-[9px] min-w-0">
            <PieChart className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
            <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">Q2 (Jul-Sep)</span>
          </div>
          <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
          <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            <option>Q2 (Jul-Sep)</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-[#6B7280] block ml-1">Month</label>
        <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9] transition-colors min-w-[165px]">
          <div className="flex items-center gap-[9px] min-w-0">
            <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
            <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">September 2026</span>
          </div>
          <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
          <select className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
            <option>September 2026</option>
          </select>
        </div>
      </div>
    </div>
  );

  const importBtn = (
    <button 
      onClick={() => setIsImportModalOpen(true)}
      className="flex items-center justify-center gap-2 h-[40px] px-4 rounded-[10px] bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[13px] font-bold shadow-lg shadow-[#6D28D9]/20 transition-colors shrink-0"
    >
      <UploadCloud className="w-[18px] h-[18px]" />
      + Import
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* 2. KPI Cards Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Sales"
          value={formatINR(totalSales, { compact: true })}
          percentage="Outward Total"
          isPositive={true}
          comparisonText="Gross supply"
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <KpiCard
          title="Taxable Sales"
          value={formatINR(taxableSales, { compact: true })}
          percentage="84.8% Taxable"
          isPositive={true}
          comparisonText="Excluding nil-rate"
          icon={ReceiptText}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="IGST"
          value={formatINR(totalIgst, { compact: true })}
          percentage="Interstate"
          isPositive={true}
          comparisonText="Integrated tax"
          icon={FileText}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          title="CGST"
          value={formatINR(totalCgst, { compact: true })}
          percentage="Intrastate"
          isPositive={true}
          comparisonText="Central tax"
          icon={FileText}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
        />
        <KpiCard
          title="SGST"
          value={formatINR(totalSgst, { compact: true })}
          percentage="Intrastate"
          isPositive={true}
          comparisonText="State tax"
          icon={FileText}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Invoice Count"
          value={`${invoiceCount} Invoices`}
          percentage="100% E-Invoiced"
          isPositive={true}
          comparisonText="IRN Generated"
          icon={QrCode}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      
      {/* 1. Header & Tabs Block */}
      <div className="bg-[#FFFFFF] rounded-[16px] p-6 border border-[#E5E7EB] shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-[#1F2937]">GSTR-1 Outward Supplies Register</h2>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Tax invoice generation, e-Invoice IRN QR integration, and offline JSON return payload compiler.
            </p>
          </div>

          
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pt-2 custom-scrollbar">
          {[
            { id: 'B2B', label: 'B2B Regular (4A, 4B)' },
            { id: 'B2C', label: 'B2C Large & Small (5, 7)' },
            { id: 'CDNR', label: 'Credit Note (9B Reg)' },
            { id: 'CDNUR', label: 'Debit Note (9B Unreg)' },
            { id: 'EXP', label: 'Exports (6A)' },
            { id: 'NIL', label: 'Nil Rated (8A)' },
            { id: 'EXEMPT', label: 'Exempted (8B)' },
            { id: 'HSN', label: 'HSN Summary (12)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`h-[40px] px-4 rounded-[10px] text-[13px] font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/20'
                  : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280] hover:border-[#6D28D9] hover:text-[#6D28D9] hover:bg-[#F5F3FF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      
      {/* 3. Table Block */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] shadow-sm">
        <DataTable
          data={entries}
          columns={columns}
          searchPlaceholder="Search Financial Year, GSTIN, Party Name, Invoice No..."
          searchFields={['customerName', 'customerGstin', 'invoiceNo', 'financialYear']}
          
          toolbarAction={importBtn}
        />
      </div>

      {isImportModalOpen && (
        <Gstr1ImportModal 
          onClose={() => setIsImportModalOpen(false)} 
          onImportSuccess={(count) => {
            setIsImportModalOpen(false);
            alert(`✅ ${count} records imported successfully.`);
          }}
        />
      )}
    </div>
  );
};

