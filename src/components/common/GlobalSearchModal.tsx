import React, { useState } from 'react';
import { X, Search, FileText, ShoppingBag, ArrowUpRight, Scale, Tag, ArrowRight } from 'lucide-react';
import { ReconciledInvoice, Gstr1Entry, RcmEntry, Gstr2BEntry } from '../../types/gst';
import { formatINR } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  invoices: ReconciledInvoice[];
  gstr1: Gstr1Entry[];
  rcm: RcmEntry[];
  twoB: Gstr2BEntry[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  invoices,
  gstr1,
  rcm,
  twoB,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase().trim();

  // Search filtered results
  const matchedInvoices = term ? invoices.filter(inv =>
    inv.supplierName.toLowerCase().includes(term) ||
    inv.supplierGstin.toLowerCase().includes(term) ||
    inv.invoiceNo.toLowerCase().includes(term) ||
    inv.taxableValue.toString().includes(term)
  ) : [];

  const matchedSales = term ? gstr1.filter(s =>
    s.customerName.toLowerCase().includes(term) ||
    s.customerGstin.toLowerCase().includes(term) ||
    s.invoiceNo.toLowerCase().includes(term) ||
    s.taxableValue.toString().includes(term)
  ) : [];

  const matchedRcm = term ? rcm.filter(r =>
    r.vendorName.toLowerCase().includes(term) ||
    r.invoiceNo.toLowerCase().includes(term) ||
    r.natureOfSupply.toLowerCase().includes(term)
  ) : [];

  const matched2B = term ? twoB.filter(b =>
    b.supplierName.toLowerCase().includes(term) ||
    b.gstin.toLowerCase().includes(term) ||
    b.invoiceNo.toLowerCase().includes(term)
  ) : [];

  const totalResults = matchedInvoices.length + matchedSales.length + matchedRcm.length + matched2B.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200/80 flex items-center gap-3 bg-white">
          <Search className="w-[18px] h-[18px] text-purple-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across Purchases, 2B, Sales, GSTR-1, RCM by GSTIN, Invoice #, Vendor..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 text-xs">
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!searchTerm ? (
            <div className="py-10 text-center text-slate-400 text-xs space-y-2">
              <Search className="w-8 h-8 mx-auto text-purple-300" />
              <p className="font-semibold text-slate-600">Quick Global GST Query Engine</p>
              <p>Type GSTIN (e.g. 23AAB...), Supplier/Customer name, or Invoice #</p>
              <div className="flex justify-center gap-2 pt-2">
                <span className="px-2 py-1 bg-slate-100 rounded-md text-[11px] text-slate-600 font-mono">Tata Steel</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md text-[11px] text-slate-600 font-mono">23AAACU</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md text-[11px] text-slate-600 font-mono">TSL/26-27</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No GST records found matching &ldquo;<span className="text-purple-600 font-semibold">{searchTerm}</span>&rdquo;.
            </div>
          ) : (
            <>
              {/* Purchases / Reco */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-[18px] h-[18px]" /> Book Purchases & Reco ({matchedInvoices.length})
                    </span>
                    <button
                      onClick={() => { onNavigate('final-reco-report'); onClose(); }}
                      className="text-purple-600 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      View All in Reco <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {matchedInvoices.slice(0, 3).map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => { onNavigate('final-reco-report'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{inv.supplierName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Inv: {inv.invoiceNo} • GSTIN: {inv.supplierGstin}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{formatINR(inv.taxableValue)}</div>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                            {inv.matchStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GSTR-1 Sales */}
              {matchedSales.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-[18px] h-[18px]" /> GSTR-1 Outward Sales ({matchedSales.length})
                    </span>
                    <button
                      onClick={() => { onNavigate('gstr-1'); onClose(); }}
                      className="text-blue-600 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      View in GSTR-1 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {matchedSales.slice(0, 3).map(s => (
                      <div
                        key={s.id}
                        onClick={() => { onNavigate('gstr-1'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{s.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Inv: {s.invoiceNo} • GSTIN: {s.customerGstin}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{formatINR(s.totalInvoiceValue)}</div>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {s.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RCM */}
              {matchedRcm.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-[18px] h-[18px]" /> Reverse Charge ({matchedRcm.length})
                    </span>
                    <button
                      onClick={() => { onNavigate('rcm'); onClose(); }}
                      className="text-amber-600 hover:underline flex items-center gap-0.5 text-[11px]"
                    >
                      View in RCM <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {matchedRcm.slice(0, 2).map(r => (
                      <div
                        key={r.id}
                        onClick={() => { onNavigate('rcm'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-amber-50/60 border border-slate-100 hover:border-amber-200 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{r.vendorName}</div>
                          <div className="text-[11px] text-slate-500">{r.natureOfSupply}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-800">{formatINR(r.totalRcm)}</div>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            {r.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Searches PostgreSQL indexes on indexed columns</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
