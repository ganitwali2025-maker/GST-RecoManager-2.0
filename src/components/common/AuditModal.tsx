import React from 'react';
import { X, ShieldCheck, History, Clock, Monitor, UserCheck, CheckCircle2 } from 'lucide-react';
import { AuditLog } from '../../types/gst';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityTitle: string;
  auditTrail: AuditLog[];
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  entityTitle,
  auditTrail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Compliance & Audit Trail</h3>
              <p className="text-xs text-slate-500 font-medium">{entityTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-[18px] h-[18px] text-purple-600 shrink-0" />
            <p className="text-xs text-purple-900 leading-relaxed">
              Every GST action, reconciliation calculation, and ITC claim is cryptographically indexed in the PostgreSQL audit log with immutable timestamps for statutory tax assessment.
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-100">
            {auditTrail.map((log) => (
              <div key={log.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                  <History className="w-3 h-3" />
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/80 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                        {log.action}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <UserCheck className="w-[18px] h-[18px] text-slate-400" />
                        {log.createdBy}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-[18px] h-[18px]" />
                      {log.createdDate}
                    </span>
                  </div>

                  {log.previousValue && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2.5 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Previous Value</span>
                        <span className="text-rose-700 font-medium font-mono">{log.previousValue}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Updated Value</span>
                        <span className="text-emerald-700 font-medium font-mono">{log.updatedValue}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 bg-white/60 p-2 rounded-lg border border-slate-100 mt-2">
                    <span className="font-semibold text-slate-700">Remarks:</span> {log.remarks}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Monitor className="w-3 h-3 text-slate-400" />
                      IP: {log.ipAddress}
                    </span>
                    <span>Device: {log.device}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">Record Verification Hash: 9f8a...4b12</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
