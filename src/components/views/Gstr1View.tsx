import React, { useState, useMemo } from 'react';
import {
  UploadCloud,
  Search,
  X,
  FileText,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  ReceiptText,
  QrCode
} from 'lucide-react';
import { Gstr1Entry } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';
import { Gstr1ImportModal } from './Gstr1ImportModal';
import { KpiCard } from '../common/KpiCard';

interface Gstr1ViewProps {
  entries: Gstr1Entry[];
  onAddGstr1Entry?: (entry: Gstr1Entry) => void;
}

export const Gstr1View: React.FC<Gstr1ViewProps> = ({ entries }) => {
  const [activeTab, setActiveTab] = useState<'B2B' | 'CDNR' | 'HSN'>('B2B');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSheetLocked, setIsSheetLocked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');

  // Computed KPIs
  const totalSales = entries.reduce((sum, e) => sum + e.totalInvoiceValue, 0);
  const taxableSales = entries.reduce((sum, e) => sum + e.taxableValue, 0);
  const totalIgst = entries.reduce((sum, e) => sum + e.igst, 0);
  const totalCgst = entries.reduce((sum, e) => sum + e.cgst, 0);
  const totalSgst = entries.reduce((sum, e) => sum + e.sgst, 0);
  const invoiceCount = entries.length;

  const handleExportCsv = () => {
    alert('Exporting to CSV...');
  };

  const handleExportExcel = () => {
    alert('Exporting to Excel...');
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Apply Search Term
      if (appliedSearchTerm) {
        const term = appliedSearchTerm.toLowerCase();
        const matchesSearch = 
          entry.invoiceNo.toLowerCase().includes(term) ||
          entry.customerName.toLowerCase().includes(term) ||
          entry.customerGstin.toLowerCase().includes(term) ||
          entry.invoiceDate.includes(term) ||
          entry.placeOfSupply.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [entries, appliedSearchTerm]);

  return (
    <div className="flex flex-col flex-1 h-full gap-4 min-w-0">
      
      {/* KPI Cards Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 shrink-0">
        <KpiCard
          title="TOTAL SALES"
          value={formatINR(totalSales, { compact: true })}
          percentage="Outward Total"
          isPositive={true}
          comparisonText="Gross supply"
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <KpiCard
          title="TAXABLE SALES"
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
          title="INVOICE COUNT"
          value={`${invoiceCount} Invoices`}
          percentage="100% E-Invoiced"
          isPositive={true}
          comparisonText="IRN Generated"
          icon={QrCode}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Main Sheet Container (Aligns exactly with KPI cards above) */}
      <div className="flex flex-col flex-1 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden min-h-0 min-w-0">
      
        {/* Top Action Bar & Tabs (Merged into single row) */}
        <div className="bg-white p-3 px-4 flex items-center justify-between gap-3 shrink-0 border-b border-slate-200 overflow-x-auto custom-scrollbar">
        
        {/* Left: Action & Tabs */}
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            disabled={isSheetLocked}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[13px] transition-colors shrink-0 ${
              isSheetLocked 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-md shadow-[#6D28D9]/20'
            }`}
          >
            <UploadCloud className="w-[18px] h-[18px]" />
            Import
            <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 shrink-0"></div>

          <div className="flex items-center gap-2 shrink-0">
            {[
              { id: 'B2B', label: 'B2B (Regular)', icon: <FileText className="w-[16px] h-[16px]" /> },
              { id: 'CDNR', label: 'Credit Note', icon: <FileText className="w-[16px] h-[16px]" /> },
              { id: 'HSN', label: 'HSN Summary', icon: <FileText className="w-[16px] h-[16px]" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 h-[38px] px-4 rounded-lg text-[13px] font-bold whitespace-nowrap transition-all border ${
                  activeTab === tab.id
                    ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20'
                    : 'bg-white border-[#E5E7EB] text-[#6D28D9] hover:bg-[#F5F3FF]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Search & Exports */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="relative w-[220px] xl:w-[280px] shrink-0">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setAppliedSearchTerm(e.target.value);
              }}
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
            />
            {searchTerm ? (
              <X 
                className="w-[16px] h-[16px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-slate-600" 
                onClick={() => { setSearchTerm(''); setAppliedSearchTerm(''); }} 
              />
            ) : (
              <Search className="w-[16px] h-[16px] text-[#6D28D9] absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 shrink-0"></div>

          <button 
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-[13px] transition-colors shadow-md shadow-emerald-500/20"
            title="Export CSV"
          >
            <FileText className="w-[16px] h-[16px]" />
            <span className="hidden xl:inline">Export CSV</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[13px] transition-colors shadow-md shadow-blue-500/20"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-[16px] h-[16px]" />
            <span className="hidden xl:inline">Export Excel</span>
          </button>
          <button 
            onClick={() => setIsSheetLocked(!isSheetLocked)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[13px] transition-all border shadow-sm ${
              isSheetLocked 
                ? 'bg-white border-[#6D28D9] text-[#6D28D9] shadow-[#6D28D9]/10' 
                : 'bg-white border-slate-300 text-[#6D28D9] hover:bg-slate-50'
            }`}
          >
            {isSheetLocked ? <Lock className="w-[16px] h-[16px]" /> : <Unlock className="w-[16px] h-[16px]" />}
            <span className="hidden xl:inline">{isSheetLocked ? 'Locked' : 'Lock'}</span>
            <ChevronDown className="w-4 h-4 opacity-80 hidden xl:inline" />
          </button>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="flex-1 overflow-auto bg-white border-slate-200 shadow-sm custom-scrollbar relative">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-[#F5F3FF] sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
            <tr>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] w-12 text-center">S.N.</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] w-20 text-center">FY</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] w-20 text-center">Quarter</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] w-20 text-center">Month</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] min-w-[120px] whitespace-nowrap cursor-pointer hover:bg-[#EDE9FE] group transition-colors">
                <div className="flex items-center gap-1.5">
                  Invoice Date <ArrowUpDown className="w-3 h-3 text-purple-300 group-hover:text-[#6D28D9]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] min-w-[130px]">Invoice No.</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] min-w-[200px]">Customer / Party Name</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] min-w-[140px]">GSTIN</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] min-w-[130px]">Place of Supply</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[130px]">Invoice Value (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[140px] cursor-pointer hover:bg-[#EDE9FE] group transition-colors">
                <div className="flex items-center justify-end gap-1.5">
                  Taxable Value (₹) <ArrowUpDown className="w-3 h-3 text-purple-300 group-hover:text-[#6D28D9]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[110px]">IGST (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[110px]">CGST (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[110px]">SGST (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[100px]">Cess (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-r border-[#EDE9FE] bg-[#F5F3FF] text-right min-w-[120px]">Total Tax (₹)</th>
              <th className="py-3.5 px-4 font-bold text-[11px] uppercase tracking-wider text-[#5B21B6] border-b border-[#EDE9FE] bg-[#F5F3FF] text-center min-w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => {
              const monthShort = entry.month ? entry.month.substring(0, 3) : 'Sep';
              const fyShort = entry.financialYear ? entry.financialYear.replace('FY ', '') : '2026-27';
              
              return (
                <tr key={entry.id} className="hover:bg-purple-50/50 transition-colors group">
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] text-center font-semibold text-slate-500 bg-white group-hover:bg-purple-50/50">{index + 1}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-700 bg-white group-hover:bg-purple-50/50 text-center">{fyShort}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-700 bg-white group-hover:bg-purple-50/50 text-center">Q2</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-700 bg-white group-hover:bg-purple-50/50 text-center">{monthShort}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-700 whitespace-nowrap">{formatDate(entry.invoiceDate)}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-bold text-slate-800">{entry.invoiceNo}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-800 truncate max-w-[200px]" title={entry.customerName}>{entry.customerName}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-mono font-medium text-slate-600">{entry.customerGstin}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] text-slate-700">{entry.placeOfSupply}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-800 text-right">{entry.totalInvoiceValue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-800 text-right">{entry.taxableValue.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-medium text-slate-600 text-right">{entry.igst > 0 ? entry.igst.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-medium text-slate-600 text-right">{entry.cgst > 0 ? entry.cgst.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-medium text-slate-600 text-right">{entry.sgst > 0 ? entry.sgst.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-medium text-slate-600 text-right">{entry.cess > 0 ? entry.cess.toLocaleString('en-IN') : '0'}</td>
                  <td className="py-3 px-4 border-b border-r border-slate-200 text-[13px] font-bold text-slate-800 text-right">{(entry.igst + entry.cgst + entry.sgst + entry.cess).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 border-b border-slate-200 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button disabled={isSheetLocked} className={`p-1.5 rounded transition-colors ${isSheetLocked ? 'text-slate-300' : 'text-blue-600 hover:bg-blue-50'}`} title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button disabled={isSheetLocked} className={`p-1.5 rounded transition-colors ${isSheetLocked ? 'text-slate-300' : 'text-purple-600 hover:bg-purple-50'}`} title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button disabled={isSheetLocked} className={`p-1.5 rounded transition-colors ${isSheetLocked ? 'text-slate-300' : 'text-rose-600 hover:bg-rose-50'}`} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={18} className="py-16 text-center text-slate-500 bg-white">
                  No records found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* End of Main Sheet Container */}
      </div>

      {isImportModalOpen && (
        <Gstr1ImportModal 
          onClose={() => setIsImportModalOpen(false)} 
          onImportSuccess={(count) => {
            setIsImportModalOpen(false);
            alert(`${count} records imported successfully.`);
          }}
        />
      )}
    </div>
  );
};
