import React from 'react';
import { MatchStatus, PaymentStatus } from '../../types/gst';

interface StatusBadgeProps {
  status: MatchStatus | PaymentStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let bgClass = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotClass = 'bg-slate-400';

  if (normalized === 'MATCHED' || normalized === 'PAID' || normalized === 'FILED' || normalized === 'YES') {
    bgClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotClass = 'bg-emerald-500';
  } else if (normalized === 'AMOUNT MISMATCH' || normalized === 'GST MISMATCH' || normalized === 'PARTIALLY PAID') {
    bgClass = 'bg-amber-50 text-amber-700 border-amber-200';
    dotClass = 'bg-amber-500';
  } else if (normalized === 'NOT IN 2B' || normalized === 'DUPLICATE' || normalized === 'FAILED') {
    bgClass = 'bg-rose-50 text-rose-700 border-rose-200';
    dotClass = 'bg-rose-500';
  } else if (normalized === 'NOT CLAIMED' || normalized === 'PENDING' || normalized === 'DRAFT') {
    bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
    dotClass = 'bg-blue-500';
  } else if (normalized === 'REVERSED' || normalized === 'NO' || normalized === 'BLOCKED') {
    bgClass = 'bg-purple-50 text-purple-700 border-purple-200';
    dotClass = 'bg-purple-500';
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bgClass} ${sizeClass} tracking-wide`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status}
    </span>
  );
};
