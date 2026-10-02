import React from 'react';
import {
  TrendingUp,
  Scale,
  Receipt,
  Landmark,
  Percent,
  CreditCard,
  ArrowRight,
  ShieldAlert,
  Download,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { KpiCard } from '../common/KpiCard';
import { formatINR } from '../../utils/formatters';

interface LiabilityDashboardProps {
  onNavigate: (page: string) => void;
}

export const LiabilityDashboard: React.FC<LiabilityDashboardProps> = ({ onNavigate }) => {
  // Chart data
  const monthlyLiabilityData = [
    { month: 'Apr', sales: 2.45, outputGst: 38.5, inputGst: 35.2, netPayable: 3.3, rcm: 2.1 },
    { month: 'May', sales: 2.62, outputGst: 40.2, inputGst: 36.8, netPayable: 3.4, rcm: 2.0 },
    { month: 'Jun', sales: 2.38, outputGst: 37.1, inputGst: 34.5, netPayable: 2.6, rcm: 1.9 },
    { month: 'Jul', sales: 2.75, outputGst: 42.0, inputGst: 38.2, netPayable: 3.8, rcm: 2.2 },
    { month: 'Aug', sales: 2.58, outputGst: 39.4, inputGst: 36.5, netPayable: 2.9, rcm: 2.0 },
    { month: 'Sep', sales: 2.84, outputGst: 43.09, inputGst: 39.82, netPayable: 3.27, rcm: 2.14 },
  ];

  const taxHeadData = [
    { name: 'IGST Liability', value: 18.45, color: '#6D28D9' },
    { name: 'CGST Liability', value: 12.32, color: '#3B82F6' },
    { name: 'SGST Liability', value: 12.32, color: '#10B981' },
    { name: 'RCM Liability', value: 2.14, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 border border-purple-900/50">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold text-purple-200 border border-purple-400/20">
            <Scale className="w-[18px] h-[18px] text-purple-300" />
            Statutory GSTR-3B Liability Determination
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Tax Liability & Set-off Dashboard</h2>
          <p className="text-xs text-slate-300">
            Automated liability calculation with cross-utilization of IGST, CGST, and SGST input tax credits as per Section 49B of the CGST Act.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('payment-dashboard')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs text-white flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <CreditCard className="w-[18px] h-[18px]" />
            Proceed to GST Challan Payment
          </button>
        </div>
      </div>

      {/* 6 TOP KPI CARDS (Requested exact numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Sales"
          value="₹ 2.84 Cr"
          percentage="↑ 10.1%"
          isPositive={true}
          comparisonText="Gross turnover"
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />

        <KpiCard
          title="Taxable Sales"
          value="₹ 2.41 Cr"
          percentage="84.8%"
          isPositive={true}
          comparisonText="Net of exempt"
          icon={Receipt}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />

        <KpiCard
          title="IGST Liability"
          value="₹ 18.45 L"
          percentage="Interstate"
          isPositive={true}
          comparisonText="To be set off 1st"
          icon={Percent}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />

        <KpiCard
          title="CGST Liability"
          value="₹ 12.32 L"
          percentage="Intrastate"
          isPositive={true}
          comparisonText="Central tax"
          icon={Scale}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <KpiCard
          title="SGST Liability"
          value="₹ 12.32 L"
          percentage="Intrastate"
          isPositive={true}
          comparisonText="State tax"
          icon={Landmark}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
        />

        <KpiCard
          title="RCM Liability"
          value="₹ 2.14 L"
          percentage="Pay in Cash"
          isPositive={false}
          comparisonText="GTA + Legal services"
          icon={ShieldAlert}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* GST LIABILITY SUMMARY (Tax Computation Matrix) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-[20px] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">GST Liability & Set-off Summary (September 2026)</h3>
            <p className="text-xs text-slate-400">Order of utilization of ITC against Output GST liability</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-[18px] h-[18px]" />
            Rule 88A Optimization Applied
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Output GST Liability</span>
            <div className="text-xl font-bold text-slate-900 mt-1">₹ 43.09 L</div>
            <div className="text-[11px] text-slate-400 mt-1">IGST: ₹18.45L • CGST: ₹12.32L • SGST: ₹12.32L</div>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/70">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Eligible Input GST (ITC)</span>
            <div className="text-xl font-bold text-emerald-800 mt-1">₹ 39.82 L</div>
            <div className="text-[11px] text-emerald-600 mt-1">Matched 2B ITC utilized for offset</div>
          </div>

          <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200/70">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Net GST Payable (Cash)</span>
            <div className="text-xl font-bold text-purple-900 mt-1">₹ 3.27 L</div>
            <div className="text-[11px] text-purple-600 mt-1">Balance after full ITC credit utilization</div>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">RCM Cash Liability</span>
            <div className="text-xl font-bold text-amber-900 mt-1">₹ 2.14 L</div>
            <div className="text-[11px] text-amber-600 mt-1">Mandatory cash payment (Cannot use ITC)</div>
          </div>
        </div>

        {/* Set-off Grid Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Tax Description</th>
                <th className="py-2.5 px-4 text-right">Output Liability</th>
                <th className="py-2.5 px-4 text-right">Paid via IGST ITC</th>
                <th className="py-2.5 px-4 text-right">Paid via CGST ITC</th>
                <th className="py-2.5 px-4 text-right">Paid via SGST ITC</th>
                <th className="py-2.5 px-4 text-right font-bold text-purple-700">Balance Cash Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">Integrated Tax (IGST)</td>
                <td className="py-2.5 px-4 text-right">₹ 18,45,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 18,45,000</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹ 0</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹ 0</td>
                <td className="py-2.5 px-4 text-right font-bold text-emerald-700">₹ 0</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">Central Tax (CGST)</td>
                <td className="py-2.5 px-4 text-right">₹ 12,32,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 1,84,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 8,84,500</td>
                <td className="py-2.5 px-4 text-right text-slate-400">-</td>
                <td className="py-2.5 px-4 text-right font-bold text-purple-800">₹ 1,63,500</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">State Tax (SGST)</td>
                <td className="py-2.5 px-4 text-right">₹ 12,32,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 1,84,000</td>
                <td className="py-2.5 px-4 text-right text-slate-400">-</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 8,84,500</td>
                <td className="py-2.5 px-4 text-right font-bold text-purple-800">₹ 1,63,500</td>
              </tr>
              <tr className="bg-purple-50/40 font-semibold">
                <td className="py-2.5 px-4 font-sans text-purple-900 font-bold">Total Forward Charge Liability</td>
                <td className="py-2.5 px-4 text-right text-slate-900 font-bold">₹ 43,09,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 22,13,000</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 8,84,500</td>
                <td className="py-2.5 px-4 text-right text-emerald-700">₹ 8,84,500</td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-bold">₹ 3,27,000</td>
              </tr>
              <tr className="bg-amber-50/40 font-semibold">
                <td className="py-2.5 px-4 font-sans text-amber-900 font-bold">Reverse Charge (RCM) Payable in Cash</td>
                <td className="py-2.5 px-4 text-right text-slate-900 font-bold">₹ 2,14,000</td>
                <td colSpan={3} className="py-2.5 px-4 text-center text-slate-400 font-sans italic">ITC Inapplicable for RCM payment</td>
                <td className="py-2.5 px-4 text-right text-amber-900 font-bold">₹ 2,14,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Output GST */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Liability & Net Cash Trend</h3>
          <p className="text-xs text-slate-400 mb-4">Comparing Gross Output GST vs Eligible Input GST (Lakhs ₹)</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLiabilityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${Number(val || 0).toFixed(2)} Lakhs`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="outputGst" name="Output GST Liability" stroke="#7C3AED" fillOpacity={1} fill="url(#colorOutput)" strokeWidth={2} />
                <Area type="monotone" dataKey="inputGst" name="Input GST (ITC)" stroke="#10B981" fillOpacity={1} fill="url(#colorInput)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Head Breakup Pie */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Tax Head Liability Distribution</h3>
            <p className="text-xs text-slate-400">IGST, CGST, SGST & RCM proportion</p>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={taxHeadData} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                  {taxHeadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹ ${Number(val || 0).toFixed(2)} Lakhs`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {taxHeadData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">₹{item.value} L</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
