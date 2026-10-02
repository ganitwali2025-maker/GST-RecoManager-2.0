import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  percentage?: string;
  isPositive?: boolean;
  comparisonText?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  badgeText?: string;
  onClick?: () => void;
  sparklineData?: number[];
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  percentage,
  isPositive = true,
  comparisonText = 'vs previous month',
  icon: Icon,
  iconBgColor = 'bg-purple-50',
  iconColor = 'text-purple-600',
  badgeText,
  onClick,
  sparklineData = [40, 55, 45, 60, 50, 70, 65, 80],
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-purple-300' : ''
      } relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBgColor} ${iconColor} transition-transform group-hover:scale-105 shadow-xs`}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        {percentage ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md ${
                isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {isPositive ? <TrendingUp className="w-[18px] h-[18px] mr-0.5 inline" /> : <TrendingDown className="w-[18px] h-[18px] mr-0.5 inline" />}
              {percentage}
            </span>
            <span className="text-slate-400 text-[11px]">{comparisonText}</span>
          </div>
        ) : badgeText ? (
          <span className="text-xs text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded-md">
            {badgeText}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">Current Tax Period</span>
        )}

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6 flex items-end justify-between gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
          {sparklineData.map((val, idx) => (
            <div
              key={idx}
              className={`w-1.5 rounded-t-xs ${isPositive ? 'bg-purple-400' : 'bg-rose-400'}`}
              style={{ height: `${Math.max(15, (val / 100) * 100)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
