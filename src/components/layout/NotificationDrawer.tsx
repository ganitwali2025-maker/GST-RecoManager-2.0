import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, AlertOctagon, Info, Check, Trash2, ExternalLink } from 'lucide-react';
import { NotificationItem } from '../../types/gst';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (page: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-[18px] h-[18px] text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" />;
      case 'danger':
        return <AlertOctagon className="w-[18px] h-[18px] text-rose-600" />;
      default:
        return <Info className="w-[18px] h-[18px] text-blue-600" />;
    }
  };

  const getBg = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'success':
        return 'bg-emerald-50 border-emerald-200';
      case 'danger':
        return 'bg-rose-50 border-rose-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-purple-50/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Bell className="w-[18px] h-[18px]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Compliance Notifications
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">Automated GST Audit & Deadline Alerts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{notifications.length} Total Alerts</span>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 hover:underline"
              >
                <Check className="w-[18px] h-[18px]" /> Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                No active notifications.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    item.read ? 'bg-white border-slate-200/80 opacity-75' : `${getBg(item.type)} shadow-xs`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-white shrink-0 shadow-xs border border-slate-100">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex items-center justify-between text-xs">
                        {item.actionUrl ? (
                          <button
                            onClick={() => {
                              onNavigate(item.actionUrl!);
                              onClose();
                            }}
                            className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1 text-[11px]"
                          >
                            Resolve Now <ExternalLink className="w-3 h-3" />
                          </button>
                        ) : <span />}

                        {!item.read && (
                          <button
                            onClick={() => onMarkAsRead(item.id)}
                            className="text-slate-400 hover:text-purple-600 text-[11px]"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
            GST RecoManager Notification Service • Connected
          </div>
        </div>
      </div>
    </div>
  );
};
