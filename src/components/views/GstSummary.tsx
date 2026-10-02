import React from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Scale,
  ShieldAlert,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { MonthlySummary } from '../../types/gst';
import { formatINR } from '../../utils/formatters';
import { exportToCSV, exportToExcel, triggerPrint } from '../../utils/exportUtils';

interface GstSummaryProps {
  monthlySummaries: MonthlySummary[];
}

export const GstSummary: React.FC<GstSummaryProps> = ({ monthlySummaries }) => {
  // Aggregate annual figures
  const totalSales = monthlySummaries.reduce((a, b) => a + b.sales, 0);
  const totalPurchases = monthlySummaries.reduce((a, b) => a + b.purchases, 0);
  const totalItcAvailable = monthlySummaries.reduce((a, b) => a + b.itcAvailable, 0);
  const totalRcm = monthlySummaries.reduce((a, b) => a + b.rcmLiability, 0);
  const totalNetLiability = monthlySummaries.reduce((a, b) => a + b.netLiability, 0);
  const totalPaid = monthlySummaries.reduce((a, b) => a + b.paidAmount, 0);

  const handleExportCSV = () => {
    const headers = ['Month', 'Gross Sales', 'Taxable Sales', 'IGST', 'CGST', 'SGST', 'Gross Purchase', 'ITC Available', 'RCM', 'Net Liability'];
    const rows = monthlySummaries.map(m => [
      m.month,
      m.sales,
      m.taxableSales,
      m.igstSales,
      m.cgstSales,
      m.sgstSales,
      m.purchases,
      m.itcAvailable,
      m.rcmLiability,
      m.netLiability
    ]);
    exportToCSV('Annual_GST_Monthly_Summary', headers, rows);
  };

  const handleExportExcel = () => {
    const headers = ['Month', 'Gross Sales', 'Taxable Sales', 'IGST', 'CGST', 'SGST', 'Gross Purchase', 'ITC Available', 'RCM', 'Net Liability'];
    const rows = monthlySummaries.map(m => [
      m.month,
      m.sales,
      m.taxableSales,
      m.igstSales,
      m.cgstSales,
      m.sgstSales,
      m.purchases,
      m.itcAvailable,
      m.rcmLiability,
      m.netLiability
    ]);
    exportToExcel('Annual_GST_Monthly_Summary', 'GST_Summary', headers, rows);
  };

  const handleExportPDF = () => {
    triggerPrint();
  };

  return (
    <div className="space-y-6">
      {/* 6 SUMMARY SECTIONS (Cards requested in Section 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        {/* Sales Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sales Summary</span>
            <TrendingUp className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatINR(totalSales, { compact: true })}</div>
          <p className="text-[11px] text-slate-400 mt-1">YTD Outward Supplies</p>
        </div>

        {/* Purchase Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Purchase Summary</span>
            <ShoppingBag className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatINR(totalPurchases, { compact: true })}</div>
          <p className="text-[11px] text-slate-400 mt-1">YTD Inward Invoices</p>
        </div>

        {/* ITC Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ITC Summary</span>
            <FileSpreadsheet className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-emerald-700">{formatINR(totalItcAvailable, { compact: true })}</div>
          <p className="text-[11px] text-emerald-600 mt-1">Auto-drafted 2B credit</p>
        </div>

        {/* Liability Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Liability Summary</span>
            <Scale className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatINR(totalNetLiability, { compact: true })}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total Net Cash Dues</p>
        </div>

        {/* RCM Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">RCM Summary</span>
            <ShieldAlert className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-amber-800">{formatINR(totalRcm, { compact: true })}</div>
          <p className="text-[11px] text-amber-600 mt-1">Reverse Charge Cash</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Payment Summary</span>
            <CreditCard className="w-[18px] h-[18px]" />
          </div>
          <div className="text-xl font-bold text-teal-800">{formatINR(totalPaid, { compact: true })}</div>
          <p className="text-[11px] text-teal-600 mt-1">Settled via CPIN / Cash</p>
        </div>
      </div>

      {/* MONTHLY COMPARISON TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">FY 2026-27 Monthly GST Performance & Comparison Table</h3>
            <p className="text-xs text-slate-400">Consolidated reconciliation metrics across Sales, Purchases, 2B ITC, and RCM</p>
          </div>

          {/* Export buttons: Excel, PDF, CSV */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-purple-700 shadow-2xs hover:bg-purple-50/50 transition-colors"
            >
              <Download className="w-[18px] h-[18px] text-purple-600" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-50/50 transition-colors"
            >
              <FileText className="w-[18px] h-[18px] text-rose-600" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Download className="w-[18px] h-[18px] text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">Sales</th>
                <th className="py-3 px-4 text-right">Taxable Value</th>
                <th className="py-3 px-4 text-right">IGST</th>
                <th className="py-3 px-4 text-right">CGST</th>
                <th className="py-3 px-4 text-right">SGST</th>
                <th className="py-3 px-4 text-right">Purchase</th>
                <th className="py-3 px-4 text-right">ITC Available</th>
                <th className="py-3 px-4 text-right">RCM</th>
                <th className="py-3 px-4 text-right font-bold text-purple-800">Net Liability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {monthlySummaries.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-slate-800">{m.month} 2026</td>
                  <td className="py-3 px-4 text-right">{formatINR(m.sales)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{formatINR(m.taxableSales)}</td>
                  <td className="py-3 px-4 text-right text-indigo-700">{formatINR(m.igstSales)}</td>
                  <td className="py-3 px-4 text-right text-blue-700">{formatINR(m.cgstSales)}</td>
                  <td className="py-3 px-4 text-right text-teal-700">{formatINR(m.sgstSales)}</td>
                  <td className="py-3 px-4 text-right">{formatINR(m.purchases)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">{formatINR(m.itcAvailable)}</td>
                  <td className="py-3 px-4 text-right text-amber-700">{formatINR(m.rcmLiability)}</td>
                  <td className="py-3 px-4 text-right font-bold text-purple-900 bg-purple-50/30">
                    {formatINR(m.netLiability)}
                  </td>
                </tr>
              ))}
              {/* Total Summary Row */}
              <tr className="bg-purple-50/70 font-bold border-t-2 border-purple-200">
                <td className="py-3.5 px-4 font-sans text-purple-950">YTD Total</td>
                <td className="py-3.5 px-4 text-right text-purple-950">{formatINR(totalSales)}</td>
                <td className="py-3.5 px-4 text-right text-purple-900">{formatINR(monthlySummaries.reduce((a, b) => a + b.taxableSales, 0))}</td>
                <td className="py-3.5 px-4 text-right text-indigo-900">{formatINR(monthlySummaries.reduce((a, b) => a + b.igstSales, 0))}</td>
                <td className="py-3.5 px-4 text-right text-blue-900">{formatINR(monthlySummaries.reduce((a, b) => a + b.cgstSales, 0))}</td>
                <td className="py-3.5 px-4 text-right text-teal-900">{formatINR(monthlySummaries.reduce((a, b) => a + b.sgstSales, 0))}</td>
                <td className="py-3.5 px-4 text-right text-purple-950">{formatINR(totalPurchases)}</td>
                <td className="py-3.5 px-4 text-right text-emerald-900">{formatINR(totalItcAvailable)}</td>
                <td className="py-3.5 px-4 text-right text-amber-900">{formatINR(totalRcm)}</td>
                <td className="py-3.5 px-4 text-right text-purple-950 font-extrabold">{formatINR(totalNetLiability)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
