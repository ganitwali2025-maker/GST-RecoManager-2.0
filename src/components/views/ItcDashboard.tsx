import React from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Ban,
  ArrowUpRight,
  Sparkles,
  Download,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { KpiCard } from '../common/KpiCard';
import { ComplianceCalendar } from '../common/ComplianceCalendar';
import { ReconciledInvoice, NotificationItem } from '../../types/gst';
import { formatINR } from '../../utils/formatters';

interface ItcDashboardProps {
  invoices: ReconciledInvoice[];
  financialYear?: string;
  selectedMonth?: string;
  onNavigate: (page: string) => void;
  onOpenImport: () => void;
  onAddNotification?: (notification: NotificationItem) => void;
}

export const ItcDashboard: React.FC<ItcDashboardProps> = ({
  invoices,
  financialYear = 'FY 2026-27',
  selectedMonth = 'September',
  onNavigate,
  onOpenImport,
  onAddNotification,
}) => {
  // Monthly Comparison Chart Data (April to September)
  const monthlyData = [
    { month: 'Apr', bookItc: 42.5, twoBItc: 41.2, claimedItc: 40.8 },
    { month: 'May', bookItc: 44.8, twoBItc: 43.5, claimedItc: 42.9 },
    { month: 'Jun', bookItc: 40.2, twoBItc: 39.8, claimedItc: 39.0 },
    { month: 'Jul', bookItc: 46.1, twoBItc: 44.7, claimedItc: 43.8 },
    { month: 'Aug', bookItc: 45.4, twoBItc: 44.0, claimedItc: 43.1 },
    { month: 'Sep', bookItc: 48.65, twoBItc: 43.9, claimedItc: 39.82 },
  ];

  // Donut chart status breakdown
  const statusPieData = [
    { name: 'Matched', value: 39.82, color: '#10B981' },
    { name: 'Mismatch', value: 4.75, color: '#F59E0B' },
    { name: 'Not in 2B', value: 3.31, color: '#EF4444' },
    { name: 'Not Claimed', value: 2.18, color: '#3B82F6' },
    { name: 'Reversed', value: 1.90, color: '#8B5CF6' },
    { name: 'Blocked', value: 1.12, color: '#EC4899' },
  ];

  // 8 Status Cards data
  const statusCards = [
    { label: 'Matched', count: 148, amount: '₹ 39.82 L', color: 'emerald', target: 'final-reco-report' },
    { label: 'Mismatch', count: 12, amount: '₹ 4.75 L', color: 'amber', target: 'books-reco-2b' },
    { label: 'Invoice Missing', count: 6, amount: '₹ 3.31 L', color: 'rose', target: 'books-reco-2b' },
    { label: 'GSTIN Mismatch', count: 2, amount: '₹ 0.58 L', color: 'purple', target: 'books-reco-2b' },
    { label: 'Amount Difference', count: 4, amount: '₹ 0.85 L', color: 'blue', target: 'books-reco-2b' },
    { label: 'Duplicate Invoice', count: 1, amount: '₹ 0.43 L', color: 'slate', target: 'final-reco-report' },
    { label: 'Not in 2B', count: 5, amount: '₹ 3.31 L', color: 'rose', target: 'itc-not-claimed' },
    { label: 'Not Claimed', count: 3, amount: '₹ 2.18 L', color: 'indigo', target: 'itc-not-claimed' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6 border border-purple-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-purple-200 border border-white/10">
            <Sparkles className="w-[18px] h-[18px] text-yellow-300" />
            September 2026 GSTR-2B Auto-Reconciliation Ready
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Input Tax Credit (ITC) Command Dashboard
          </h2>
          <p className="text-xs text-purple-200 leading-relaxed">
            Real-time multi-level matching between Purchase ERP Books and GSTR-2B. Maximizing eligible credit while enforcing Section 16(2) and Section 17(5) compliance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('books-reco-2b')}
            className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <RefreshCw className="w-[18px] h-[18px]" />
            Run Auto-Reconciliation
          </button>
          <button
            onClick={onOpenImport}
            className="px-4 py-2.5 bg-purple-700/80 hover:bg-purple-600 border border-purple-500/50 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-[18px] h-[18px]" />
            Import Purchase Book
          </button>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-10 -bottom-10 w-[280px] h-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* TOP KPI CARDS (Requested exact numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Book ITC"
          value="₹ 48.65 L"
          percentage="↑ 7.1%"
          isPositive={true}
          comparisonText="vs Aug"
          icon={FileCheck2}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <KpiCard
          title="Matched ITC"
          value="₹ 39.82 L"
          percentage="↑ 8.4%"
          isPositive={true}
          comparisonText="81.8% of Book"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <KpiCard
          title="Mismatch ITC"
          value="₹ 4.75 L"
          percentage="↓ 2.1%"
          isPositive={false}
          comparisonText="Pending supplier fix"
          icon={AlertTriangle}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <KpiCard
          title="ITC Not Claimed"
          value="₹ 2.18 L"
          percentage="Goods in transit"
          isPositive={true}
          comparisonText="Eligible for Oct"
          icon={Clock}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <KpiCard
          title="Reversed ITC"
          value="₹ 1.90 L"
          percentage="Sec 17(5)"
          isPositive={false}
          comparisonText="Blocked in 3B"
          icon={RotateCcw}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
        />

        <KpiCard
          title="Blocked ITC"
          value="₹ 1.12 L"
          percentage="Rule 38/42"
          isPositive={false}
          comparisonText="Permanent loss"
          icon={Ban}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* STATUTORY COMPLIANCE CALENDAR (GSTR-1, GSTR-2B, GSTR-3B) */}
      <ComplianceCalendar
        financialYear={financialYear}
        selectedMonth={selectedMonth}
        onNavigate={onNavigate}
        onAddNotification={onAddNotification}
      />

      {/* 8 STATUS CARDS (Clickable triggers) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reconciliation Category Buckets
          </h3>
          <span className="text-xs text-purple-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('final-reco-report')}>
            View Detailed Reco Matrix →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {statusCards.map((sc, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(sc.target)}
              className="bg-white rounded-xl p-3 border border-slate-200/80 hover:border-purple-300 hover:shadow-sm cursor-pointer transition-all text-center group"
            >
              <div className="text-[11px] font-bold text-slate-500 group-hover:text-purple-700 truncate">
                {sc.label}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">{sc.amount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{sc.count} Invoices</div>
            </div>
          ))}
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart: Book ITC vs 2B ITC vs Claimed ITC */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ITC Reconciliation Overview (FY 2026-27)
              </h3>
              <p className="text-xs text-slate-400">
                Monthly comparison: Book Purchase ITC vs Auto-drafted 2B vs Claimed 3B ITC (in Lakhs ₹)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg">
              Reconciliation Rate: 82.6%
            </span>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${Number(val || 0).toFixed(2)} Lakhs`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="bookItc" name="Book Purchase ITC" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="twoBItc" name="GSTR-2B Available ITC" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claimedItc" name="Claimed in 3B" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Reconciliation Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reconciliation Breakdown</h3>
            <p className="text-xs text-slate-400">September 2026 ITC status distribution</p>
          </div>

          <div className="h-56 w-full my-auto relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹ ${Number(val || 0).toFixed(2)} Lakhs`, 'ITC']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900">81.8%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Matched</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {statusPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">₹{item.value}L</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ITC Trend Line Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">ITC Claim Trend & Efficiency</h3>
            <p className="text-xs text-slate-400">Comparing Book ITC growth against auto-drafted 2B match rate</p>
          </div>
          <button
            onClick={() => onNavigate('final-reco-report')}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            Open Full Reconciliation Report <ExternalLink className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip
                formatter={(val: any) => [`₹ ${Number(val || 0).toFixed(2)} Lakhs`, '']}
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="bookItc" name="Book ITC" stroke="#6D28D9" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="twoBItc" name="2B Matched ITC" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="claimedItc" name="Claimed 3B ITC" stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
