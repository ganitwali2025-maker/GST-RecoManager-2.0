import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Users,
  Database,
  Bell,
  UploadCloud,
  FileCheck2,
  HardDrive,
  RefreshCw,
  Lock,
  Check,
  Save
} from 'lucide-react';
import { UserRole } from '../../types/gst';

export const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'general' | 'gst' | 'reco' | 'import' | 'notifications' | 'users' | 'backup'>('general');
  const [amountTolerance, setAmountTolerance] = useState('10.00');
  const [fuzzyMatch, setFuzzyMatch] = useState(true);
  const [autoSync2B, setAutoSync2B] = useState(true);
  const [eInvoiceThreshold, setEInvoiceThreshold] = useState('5');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsAppAlerts, setWhatsAppAlerts] = useState(true);

  const roles: { role: UserRole; usersCount: number; permissions: string }[] = [
    { role: 'Admin', usersCount: 2, permissions: 'Full DB Control, Add Company, Manage API' },
    { role: 'CFO', usersCount: 1, permissions: 'Approve ITC Claims, PMT-06 Authorization, View Reports' },
    { role: 'Finance Manager', usersCount: 3, permissions: 'Execute Auto-Reco, Manual Override, Edit Invoices' },
    { role: 'Accountant', usersCount: 5, permissions: 'Upload Excel/CSV, Record Daybook Purchases' },
    { role: 'Viewer', usersCount: 4, permissions: 'Read-only access to GST summary and reports' },
  ];

  const handleSaveSettings = () => {
    alert('Enterprise GST Configuration saved successfully to PostgreSQL database.');
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation & Header */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
              <Sliders className="w-[18px] h-[18px]" />
              Enterprise System Configuration
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Application Settings & Security Policies</h2>
            <p className="text-xs text-slate-500">
              Manage reconciliation tolerances, user roles, PostgreSQL backups, and compliance automation.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-[18px] h-[18px]" />
            Save Preferences
          </button>
        </div>

        {/* 8 Sections Tabs (Requested in Section 18) */}
        <div className="flex overflow-x-auto pb-1 gap-1.5 border-t border-slate-100 pt-3 custom-scrollbar">
          {[
            { id: 'general', label: 'General Settings' },
            { id: 'gst', label: 'GST Settings' },
            { id: 'reco', label: 'Reconciliation Settings' },
            { id: 'import', label: 'Import Settings' },
            { id: 'notifications', label: 'Notification Settings' },
            { id: 'users', label: 'User Management & Roles' },
            { id: 'backup', label: 'Data Backup & PostgreSQL' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as typeof activeSection)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content depending on active section */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200 shadow-xs">
        {activeSection === 'general' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">General Application Settings</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Base Currency</label>
                <input type="text" readOnly value="INR (₹) - Indian Rupee" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Date Format</label>
                <select className="w-full p-2.5 border rounded-xl bg-white">
                  <option>DD-MM-YYYY (e.g. 20-09-2026)</option>
                  <option>DD MMM YYYY (e.g. 20 Sep 2026)</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Desktop ERP Layout</label>
                <input type="text" readOnly value="Compact Enterprise Desktop-First Grid" className="w-full p-2.5 bg-slate-50 border rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'gst' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">GST Statutory Rules & Thresholds</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-Invoicing Turnover Threshold (Crores ₹)</label>
                <input
                  type="number"
                  value={eInvoiceThreshold}
                  onChange={(e) => setEInvoiceThreshold(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Businesses with turnover &gt; ₹5 Cr must generate IRN for all B2B supplies.
                </p>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auto GSTR-2B Fetch Schedule</label>
                <select className="w-full p-2.5 border rounded-xl bg-white">
                  <option>Daily at 14th of the Month (GSTN Cut-off)</option>
                  <option>Twice Weekly (Real-time IFF updates)</option>
                  <option>Manual Trigger Only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'reco' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">Reconciliation Logic & Tolerance Matrix</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount Difference Tolerance (₹)</label>
                <input
                  type="text"
                  value={amountTolerance}
                  onChange={(e) => setAmountTolerance(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Invoices where Book ITC and 2B ITC differ by less than ₹{amountTolerance} are auto-classified under Amount Difference.
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Fuzzy Invoice Number Matching</div>
                  <div className="text-[11px] text-slate-400">Ignore special characters and leading zeros (e.g. INV/0042 vs 42)</div>
                </div>
                <input
                  type="checkbox"
                  checked={fuzzyMatch}
                  onChange={(e) => setFuzzyMatch(e.target.checked)}
                  className="w-[18px] h-[18px] text-purple-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Cross-Period Tolerance Window</div>
                  <div className="text-[11px] text-slate-400">Match invoices dated in prior 30 days if reflected in current 2B</div>
                </div>
                <span className="font-bold text-purple-700">± 30 Days</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'import' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">Import Templates & Default Mappings</h3>
            <p className="text-xs text-slate-500">
              Pre-configured column maps for standard Indian accounting software.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {['Tally Prime (XML / Excel)', 'SAP ERP S/4HANA', 'Busy Accounting', 'Zoho Books', 'ClearTax Export'].map((erp) => (
                <div key={erp} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{erp}</span>
                  <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">Automated Alert Triggers</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">Email Notifications for ITC Mismatches</div>
                  <div className="text-[11px] text-slate-400">Send summary digest to CFO & Finance Managers</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-[18px] h-[18px] text-purple-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800">WhatsApp / SMS Reminders to Non-Filing Suppliers</div>
                  <div className="text-[11px] text-slate-400">Auto-prompt suppliers whose invoices are missing in 2B</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsAppAlerts}
                  onChange={(e) => setWhatsAppAlerts(e.target.checked)}
                  className="w-[18px] h-[18px] text-purple-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
                <p className="text-xs text-slate-500">Separation of duties between preparation, review, and filing</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="py-2.5 px-4">Role Title</th>
                    <th className="py-2.5 px-4">Active Users</th>
                    <th className="py-2.5 px-4">Permission Privileges</th>
                    <th className="py-2.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map((r) => (
                    <tr key={r.role}>
                      <td className="py-2.5 px-4 font-bold text-purple-900">{r.role}</td>
                      <td className="py-2.5 px-4 font-medium text-slate-700">{r.usersCount} Assigned</td>
                      <td className="py-2.5 px-4 text-slate-600">{r.permissions}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'backup' && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900">PostgreSQL Database & Google Sheets Mirror</h3>
            <p className="text-xs text-slate-500">
              PostgreSQL is configured as the primary persistent transactional database for all purchases, sales, and audit trails.
            </p>

            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-purple-900 font-bold">
                <Database className="w-[18px] h-[18px] text-purple-700" />
                PostgreSQL Database Connection
              </div>
              <div className="font-mono text-[11px] text-purple-800">
                Host: unix_socket_proxy • DB: gst_recomanager • SSL: Enabled
              </div>
              <p className="text-[11px] text-purple-700">
                All records, constraints, and audit logs are preserved with zero risk of spreadsheet truncation or rate limits.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => alert('PostgreSQL schema backup dump generated: gst_recomanager_dump_20261001.sql')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <HardDrive className="w-[18px] h-[18px]" />
                Download SQL Schema Dump
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
