import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit3,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  FileCheck2,
  Database
} from 'lucide-react';
import { Company } from '../../types/gst';
import { isValidGSTIN } from '../../utils/formatters';

interface CompanyGstinViewProps {
  companies: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
  onAddCompany: (company: Company) => void;
}

export const CompanyGstinView: React.FC<CompanyGstinViewProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  onAddCompany,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    gstin: '',
    pan: '',
    cin: '',
    address: '',
    state: 'Madhya Pradesh',
    stateCode: '23',
    financialYear: 'FY 2026-27',
    registrationType: 'Regular',
    contactPerson: '',
    email: '',
    mobile: '',
    status: 'Active',
  });

  const handleGstinChange = (gstinVal: string) => {
    const val = gstinVal.toUpperCase().trim();
    const panPart = val.length >= 12 ? val.substring(2, 12) : '';
    const stateCodePart = val.length >= 2 ? val.substring(0, 2) : '23';

    setNewCompany({
      ...newCompany,
      gstin: val,
      pan: panPart || newCompany.pan,
      stateCode: stateCodePart || newCompany.stateCode,
    });
  };

  const handleSaveCompany = () => {
    if (!newCompany.name || !newCompany.gstin) {
      alert('Company Name and GSTIN are required.');
      return;
    }

    const companyToSave: Company = {
      id: `comp-${Date.now()}`,
      name: newCompany.name,
      gstin: newCompany.gstin,
      pan: newCompany.pan || newCompany.gstin.substring(2, 12),
      cin: newCompany.cin || 'U14200MP2026PTC999999',
      address: newCompany.address || 'Industrial Estate, India',
      state: newCompany.state || 'Madhya Pradesh',
      stateCode: newCompany.stateCode || '23',
      financialYear: newCompany.financialYear || 'FY 2026-27',
      registrationType: (newCompany.registrationType as any) || 'Regular',
      contactPerson: newCompany.contactPerson || 'Authorized Signatory',
      email: newCompany.email || 'accounts@company.com',
      mobile: newCompany.mobile || '+91 98000 00000',
      status: 'Active',
    };

    onAddCompany(companyToSave);
    setShowAddModal(false);
    alert(`Company entity ${companyToSave.name} successfully registered in PostgreSQL.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-[20px] border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <Building2 className="w-[18px] h-[18px]" />
            Taxpayer Master Directory
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Company & GSTIN Entity Master</h2>
          <p className="text-xs text-slate-500">
            Manage multi-state GST registrations, corporate identifiers (PAN/CIN), and authorized signatory credentials.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-[18px] h-[18px]" />
          Add New Company / GSTIN
        </button>
      </div>

      {/* Grid of Registered Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {companies.map((comp) => {
          const isSelected = comp.id === selectedCompany.id;

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-2xl p-[20px] border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'border-purple-600 shadow-md ring-2 ring-purple-100'
                  : 'border-slate-200 hover:border-purple-300 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-100">
                    <Building2 className="w-[18px] h-[18px]" />
                  </div>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-[18px] h-[18px]" /> Active Entity
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectCompany(comp)}
                      className="px-3 py-1 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 border border-purple-200 transition-colors"
                    >
                      Switch To Entity
                    </button>
                  )}
                </div>

                {/* Company Name & GSTIN */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">{comp.name}</h3>
                  <div className="mt-1 font-mono text-xs font-bold text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg inline-block border border-purple-100">
                    GSTIN: {comp.gstin}
                  </div>
                </div>

                {/* Fields (Section 17: PAN, CIN, Address, State, State Code, Financial Year, Registration Type, Contact Person, Email, Mobile) */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">PAN</span>
                      <span className="font-mono font-semibold text-slate-800">{comp.pan}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">State Code</span>
                      <span className="font-semibold text-slate-800">{comp.stateCode} ({comp.state})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Corporate CIN</span>
                    <span className="font-mono text-slate-600 text-[11px]">{comp.cin}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Address</span>
                    <span className="text-slate-600 leading-tight block">{comp.address}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration Type</span>
                      <span className="font-semibold text-purple-700">{comp.registrationType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Active FY</span>
                      <span className="font-semibold text-slate-800">{comp.financialYear}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <UserCheck className="w-[18px] h-[18px] text-slate-400" />
                      <span className="font-semibold">{comp.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-[18px] h-[18px] text-slate-400" />
                      <span>{comp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-[18px] h-[18px] text-slate-400" />
                      <span>{comp.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-[11px] text-slate-400 font-mono">DB Record: #{comp.id}</span>
                <button
                  onClick={() => alert(`Opening edit profile for ${comp.name}`)}
                  className="p-1 text-slate-400 hover:text-purple-600 rounded flex items-center gap-1 text-xs font-semibold"
                >
                  <Edit3 className="w-[18px] h-[18px]" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Company Modal (Section 17 fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-[20px] border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Company / GSTIN Master</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Passary Minerals Madhya Private Limited"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GSTIN (15 Digits) *</label>
                <input
                  type="text"
                  maxLength={15}
                  placeholder="23AABCP8921K1Z5"
                  value={newCompany.gstin}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PAN (Auto-Extracted)</label>
                <input
                  type="text"
                  value={newCompany.pan}
                  onChange={(e) => setNewCompany({ ...newCompany, pan: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-mono bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate CIN</label>
                <input
                  type="text"
                  placeholder="U14200MP2014PTC032891"
                  value={newCompany.cin}
                  onChange={(e) => setNewCompany({ ...newCompany, cin: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State & Code</label>
                <input
                  type="text"
                  placeholder="Madhya Pradesh (23)"
                  value={`${newCompany.state} (${newCompany.stateCode})`}
                  onChange={(e) => setNewCompany({ ...newCompany, state: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Full Registered Address</label>
                <input
                  type="text"
                  placeholder="Plot No., Industrial Area, City, Pin"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration Type</label>
                <select
                  value={newCompany.registrationType}
                  onChange={(e) => setNewCompany({ ...newCompany, registrationType: e.target.value as any })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="Regular">Regular Taxpayer</option>
                  <option value="Composition">Composition Scheme</option>
                  <option value="SEZ Unit">SEZ Unit</option>
                  <option value="SEZ Developer">SEZ Developer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Financial Year</label>
                <select
                  value={newCompany.financialYear}
                  onChange={(e) => setNewCompany({ ...newCompany, financialYear: e.target.value })}
                  className="w-full p-2.5 border rounded-xl bg-white"
                >
                  <option value="FY 2026-27">FY 2026-27</option>
                  <option value="FY 2025-26">FY 2025-26</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="CA Rajesh Sharma"
                  value={newCompany.contactPerson}
                  onChange={(e) => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  placeholder="accounts@company.com"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98260 12345"
                  value={newCompany.mobile}
                  onChange={(e) => setNewCompany({ ...newCompany, mobile: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCompany}
                className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
              >
                Save Entity to Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
