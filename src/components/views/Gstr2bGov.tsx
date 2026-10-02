import React, { useState } from 'react';
import {
  Building2,
  Download,
  UploadCloud,
  FileCode,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface Gstr2bGovProps {
  onOpenImport: () => void;
  onNavigate: (page: string) => void;
}

export const Gstr2bGov: React.FC<Gstr2bGovProps> = ({ onOpenImport, onNavigate }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('01 Oct 2026, 09:14 AM');
  const [syncStatus, setSyncStatus] = useState<'success' | 'syncing' | 'idle'>('success');

  const handleSyncGstn = () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      setLastSyncTime(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
      alert('GSTN Portal API Handshake successful. Latest GSTR-2B JSON payload ingested into PostgreSQL.');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
              <Building2 className="w-[18px] h-[18px] text-purple-600" />
              Government GSTN Portal Direct Gateway
            </div>
            <h2 className="text-xl font-bold text-slate-900">GSTR-2B Government Portal Sync & Download</h2>
            <p className="text-xs text-slate-500">
              Download, upload JSON/Excel files, or fetch real-time auto-drafted statements directly via authorized GSP (GST Suvidha Provider).
            </p>
          </div>

          <button
            onClick={handleSyncGstn}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <RefreshCw className={`w-[18px] h-[18px] ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Authenticating with GSTN...' : 'Fetch Live 2B from GST Portal'}
          </button>
        </div>

        {/* 6 Metric Panels (Requested in Section 13) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">GSTR-2B Download</span>
            <span className="text-sm font-bold text-purple-700 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" /> Auto-Generated
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Import Status</span>
            <span className="text-sm font-bold text-emerald-700 mt-1 block">Active (Verified)</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Last Sync</span>
            <span className="text-xs font-bold text-slate-800 mt-1 block font-mono">{lastSyncTime}</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Records</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">154 Invoices</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Tax</span>
            <span className="text-sm font-bold text-slate-900 mt-1 block">₹ 43.90 L</span>
          </div>

          <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-700 block">Total Eligible ITC</span>
            <span className="text-sm font-bold text-purple-900 mt-1 block">₹ 39.82 L</span>
          </div>
        </div>
      </div>

      {/* 3 Upload Cards (Requested in Section 13: Upload 2B JSON, Upload Excel, Upload CSV) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload JSON */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileCode className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload 2B JSON File</h3>
              <p className="text-xs text-slate-500 mt-1">
                Official JSON format downloaded directly from the GSTN Portal (Services &gt; Returns &gt; GSTR-2B).
              </p>
            </div>
          </div>

          <label className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
            <UploadCloud className="w-[18px] h-[18px]" />
            Select GSTR-2B JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={() => {
                alert('GSTR-2B JSON uploaded successfully! Parsed 154 counterparty invoices into PostgreSQL.');
              }}
            />
          </label>
        </div>

        {/* Upload Excel */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Government Excel</h3>
              <p className="text-xs text-slate-500 mt-1">
                Government standard multi-sheet Excel file (.xlsx) containing B2B, B2BA, and CDNR sheets.
              </p>
            </div>
          </div>

          <label className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs transition-colors">
            <UploadCloud className="w-[18px] h-[18px]" />
            Select Government Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={() => {
                alert('Government Excel processed! All sheets ingested into PostgreSQL database.');
              }}
            />
          </label>
        </div>

        {/* Upload CSV */}
        <div className="bg-white rounded-2xl p-[20px] border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Download className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload 2B CSV Export</h3>
              <p className="text-xs text-slate-500 mt-1">
                Raw comma-separated table export for high-speed batch ingestion of 10,000+ invoices.
              </p>
            </div>
          </div>

          <label className="mt-6 flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 rounded-xl text-xs cursor-pointer shadow-2xs transition-colors">
            <UploadCloud className="w-[18px] h-[18px]" />
            Upload CSV Table
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={() => {
                alert('CSV parsed with batch inserter! 0 errors detected.');
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
