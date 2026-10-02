import React from 'react';
import {
  LayoutDashboard,
  Scale,
  CreditCard,
  FileSpreadsheet,
  ArrowLeftRight,
  Layers,
  History,
  AlertCircle,
  CalendarRange,
  Building2,
  Landmark,
  BookOpen,
  ReceiptText,
  Sliders,
  RotateCw,
  Sparkles,
  ChevronRight,
  Database
} from 'lucide-react';

export type SidebarPage = 
  | 'itc-dashboard'
  | 'liability-dashboard'
  | 'payment-dashboard'
  | 'gst-summary'
  | 'final-reco-report'
  | 'books-reco-2b'
  | 'old-itc'
  | 'itc-not-claimed'
  | '2b-all-months'
  | '2b-gov'
  | 'rcm'
  | 'books-itc'
  | 'gstr-1'
  | 'company-gstin'
  | 'settings';

interface SidebarProps {
  currentPage: SidebarPage;
  onSelectPage: (page: SidebarPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: SidebarPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
}) => {
  const sections: NavSection[] = [
    {
      title: 'MAIN MENU',
      items: [
        { id: 'itc-dashboard', label: 'ITC Dashboard', icon: LayoutDashboard },
        { id: 'liability-dashboard', label: 'Liability Dashboard', icon: Scale },
        { id: 'payment-dashboard', label: 'Payment Dashboard', icon: CreditCard },
        { id: 'gst-summary', label: 'GST Summary', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'GST RECO STEP',
      items: [
        { id: 'final-reco-report', label: 'Final Reconciliation Report', icon: ArrowLeftRight },
      ],
    },
    {
      title: 'BOOKS RECO',
      items: [
        { id: 'books-reco-2b', label: 'Books Reco with 2B', icon: Layers },
        { id: 'old-itc', label: 'Old ITC', icon: History },
        { id: 'itc-not-claimed', label: 'ITC Not Claimed', icon: AlertCircle },
      ],
    },
    {
      title: 'GSTR-2B',
      items: [
        { id: '2b-all-months', label: '2B All Months', icon: CalendarRange },
        { id: '2b-gov', label: '2B GOV', icon: Building2 },
      ],
    },
    {
      title: 'GST & TAX',
      items: [
        { id: 'rcm', label: 'RCM', icon: Landmark },
        { id: 'books-itc', label: 'Books ITC', icon: BookOpen },
        { id: 'gstr-1', label: 'GST R-1', icon: ReceiptText },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'company-gstin', label: 'Company / GSTIN', icon: Building2 },
        { id: 'settings', label: 'Settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-gradient-to-b from-[#5B21B6] via-[#4C1D95] to-[#3B0764] text-white flex flex-col transition-all duration-300 shadow-2xl select-none ${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      }`}
    >
      {/* Top Header */}
      <div className="h-[64px] px-4 border-b border-purple-400/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner group cursor-pointer">
            <Sparkles className="w-[18px] h-[18px] text-purple-200 group-hover:rotate-12 transition-transform" />
          </div>

          {!collapsed && (
            <div className="flex flex-col truncate leading-tight">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                GST RecoManager
              </span>
              <span className="text-[10px] text-purple-200 font-medium tracking-wide truncate">
                Smart GST Reco & Compliance
              </span>
            </div>
          )}
        </div>

        {/* Circular Arrow Collapse Button (Matching Reference) */}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-purple-200 hover:text-white transition-all shadow-xs shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <RotateCw className={`w-[18px] h-[18px] transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-hide">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {/* Section Header */}
            {!collapsed ? (
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-widest text-purple-300/80 uppercase font-mono">
                {section.title}
              </div>
            ) : (
              <div className="h-px bg-purple-400/20 my-2 mx-2" />
            )}

            {/* Menu Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => onSelectPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-white text-[#6D28D9] font-bold shadow-md shadow-purple-950/20 translate-x-0.5'
                          : 'text-purple-100 hover:text-white hover:bg-white/10 active:scale-[0.98]'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                          isActive ? 'text-[#6D28D9]' : 'text-purple-200 group-hover:text-white'
                        }`}
                      />

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between truncate text-left">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-purple-500/30 text-purple-200 border border-purple-300/20'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>

                    {/* Tooltip on Collapsed */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 flex items-center gap-2 border border-slate-700">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-purple-600 px-1.5 py-0.2 rounded text-white font-bold">
                            {item.badge}
                          </span>
                        )}
                        <span className="w-1.5 h-1.5 bg-slate-900 absolute -left-1 top-1/2 -translate-y-1/2 rotate-45 border-l border-b border-slate-700" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info / DB Status */}
      <div className="p-3 border-t border-purple-400/20 bg-purple-950/30 shrink-0">
        {!collapsed ? (
          <div className="bg-purple-900/40 rounded-xl p-2.5 border border-purple-400/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-none">PostgreSQL Sync</span>
                <span className="text-[9px] text-purple-200 mt-0.5">Audit Trail Active</span>
              </div>
            </div>
            <span className="text-[10px] text-purple-300 font-mono">v3.4</span>
          </div>
        ) : (
          <div className="flex justify-center" title="PostgreSQL Live Sync Active">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
