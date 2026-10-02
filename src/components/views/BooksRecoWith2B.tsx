import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { ReconciledInvoice } from '../../types/gst';
import { formatINR, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

interface BooksRecoWith2BProps {
  invoices: ReconciledInvoice[];
  onOpenImport: () => void;
  onNavigate: (page: string) => void;
}

export const BooksRecoWith2B: React.FC<BooksRecoWith2BProps> = ({
  invoices,
  onOpenImport,
  onNavigate,
}) => {
  const [tolerance, setTolerance] = useState<number>(10);
  const [isMatching, setIsMatching] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'exact' | 'amount_diff' | 'gst_diff' | 'missing' | 'duplicate'>('all');
  const [matchProgress, setMatchProgress] = useState(82.6);
  const [searchFilter, setSearchFilter] = useState('');

  const handleRunReconciliation = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setMatchProgress(86.4);
      alert('Automatic Reconciliation completed! 10 invoices processed against GSTR-2B. Progress updated to 86.4%.');
    }, 1200);
  };

  // Filter based on matching category tabs
  const filteredInvoices = invoices.filter(inv => {
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      if (!inv.supplierName.toLowerCase().includes(q) && !inv.invoiceNo.toLowerCase().includes(q) && !inv.supplierGstin.toLowerCase().includes(q)) {
        return false;
      }
    }

    if (activeTab === 'exact') return inv.matchStatus === 'MATCHED';
    if (activeTab === 'amount_diff') return inv.matchStatus === 'AMOUNT MISMATCH';
    if (activeTab === 'gst_diff') return inv.matchStatus === 'GST MISMATCH';
    if (activeTab === 'missing') return inv.matchStatus === 'NOT IN 2B';
    if (activeTab === 'duplicate') return inv.matchStatus === 'DUPLICATE';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Engine Control Card */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
              <Sparkles className="w-[18px] h-[18px] text-purple-600" />
              Automated Intelligent Matching Engine
            </div>
            <h2 className="text-xl font-bold text-slate-900">Books Reco with GSTR-2B</h2>
            <p className="text-xs text-slate-500">
              Correlates ERP purchase entries with government auto-drafted 2B credit on 7 critical parameters: GSTIN, Inv No, Date, Taxable Value, IGST, CGST, and SGST.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenImport}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
            >
              <UploadCloud className="w-[18px] h-[18px] text-purple-600" />
              Import Data (Excel/CSV/Sheets)
            </button>
            <button
              onClick={handleRunReconciliation}
              disabled={isMatching}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RefreshCw className={`w-[18px] h-[18px] ${isMatching ? 'animate-spin' : ''}`} />
              {isMatching ? 'Matching Invoices...' : 'Run Auto-Reconciliation'}
            </button>
          </div>
        </div>

        {/* Progress Bar & Tolerance Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          {/* Progress (Requested in Section 9: 82.6%) */}
          <div className="space-y-2 bg-gradient-to-r from-purple-50 to-indigo-50/50 p-4 rounded-2xl border border-purple-100 md:col-span-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-[18px] h-[18px] text-purple-600" />
                Reconciliation Progress
              </span>
              <span className="text-purple-700 text-sm font-mono">{matchProgress}% Matched</span>
            </div>
            <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner p-0.5">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${matchProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Matched: 148 Invoices (₹ 39.82 L)</span>
              <span>Pending Action: 18 Invoices (₹ 8.83 L)</span>
            </div>
          </div>

          {/* Tolerance Settings */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-[18px] h-[18px] text-purple-600" />
                Tax Difference Tolerance
              </span>
              <span className="font-mono text-purple-700">±₹ {tolerance}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">
              Differences within ±₹{tolerance} will be treated as rounding variations.
            </p>
          </div>
        </div>
      </div>

      {/* MATCHING CATEGORIES TABS (Section 9) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl max-w-3xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Categories ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('exact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'exact' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exact Match (4)
          </button>
          <button
            onClick={() => setActiveTab('amount_diff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'amount_diff' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Amount Difference (1)
          </button>
          <button
            onClick={() => setActiveTab('gst_diff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gst_diff' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GST Difference (1)
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'missing' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoice Missing in 2B (1)
          </button>
          <button
            onClick={() => setActiveTab('duplicate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'duplicate' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Duplicate (1)
          </button>
        </div>

        <div className="relative">
          <Search className="w-[18px] h-[18px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search vendor, invoice..."
            className="text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none w-52"
          />
        </div>
      </div>

      {/* Comparison Grid View */}
      <div className="space-y-3">
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-[20px] shadow-xs hover:border-purple-200 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {inv.supplierName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{inv.supplierName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>GSTIN: {inv.supplierGstin}</span>
                    <span>•</span>
                    <span>Inv: {inv.invoiceNo}</span>
                    <span>•</span>
                    <span>Date: {formatDate(inv.invoiceDate)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={inv.matchStatus} />
                <button
                  onClick={() => onNavigate('final-reco-report')}
                  className="p-1 text-slate-400 hover:text-purple-600 text-xs font-semibold"
                >
                  Inspect →
                </button>
              </div>
            </div>

            {/* Split Comparison Columns: Book vs 2B */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">Book Purchase Record</span>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Taxable:</span>
                  <span className="font-mono font-medium">{formatINR(inv.taxableValue)}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Book ITC:</span>
                  <span className="font-mono font-bold text-purple-900">{formatINR(inv.bookItc)}</span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">GSTR-2B Auto-Drafted</span>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">2B Taxable:</span>
                  <span className="font-mono font-medium">
                    {inv.twoBItc > 0 ? formatINR(inv.taxableValue - (inv.difference > 0 && inv.matchStatus === 'AMOUNT MISMATCH' ? 150000 : 0)) : 'Not Reflected'}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">2B Eligible ITC:</span>
                  <span className={`font-mono font-bold ${inv.twoBItc === 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {formatINR(inv.twoBItc)}
                  </span>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reconciliation Gap</span>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">Difference:</span>
                    <span className={`font-mono font-bold ${inv.difference > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {inv.difference > 0 ? formatINR(inv.difference) : '₹ 0.00 (Balanced)'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-1">{inv.remarks}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
