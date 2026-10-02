import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileJson, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  ArrowRight,
  Database,
  Calendar,
  ChevronDown,
  PieChart
} from 'lucide-react';
import { Gstr1Entry } from '../../types/gst';

interface Gstr1ImportModalProps {
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const Gstr1ImportModal: React.FC<Gstr1ImportModalProps> = ({ onClose, onImportSuccess }) => {
  const [step, setStep] = useState(1);
  const [importMethod, setImportMethod] = useState<'upload' | 'paste' | null>(null);
  const [fy, setFy] = useState('');
  const [quarter, setQuarter] = useState('');
  const [month, setMonth] = useState('');
  const [pastedData, setPastedData] = useState('');
  
  const financialYears = ['FY 2026-27', 'FY 2025-26', 'FY 2024-25'];
  const quarters = ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];
  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

  const isPeriodSelected = fy && quarter && month;
  const isDataReady = importMethod === 'paste' ? pastedData.length > 10 : importMethod === 'upload';

  const handleNext = () => {
    if (step === 1 && isPeriodSelected) setStep(2);
    else if (step === 2 && isDataReady) setStep(3);
  };

  const handleImport = () => {
    // Simulate import
    onImportSuccess(125);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6">
      <div className="bg-[#FFFFFF] w-full max-w-4xl max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col border border-[#E5E7EB] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-[20px] font-bold text-[#1F2937] leading-none tracking-tight">Import GSTR-1 Data</h2>
            <p className="text-[13px] text-[#6B7280] mt-1.5">Upload JSON or paste invoice data and map it automatically to the GSTR-1 register.</p>
          </div>
          <button onClick={onClose} className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Wizard Progress */}
        <div className="px-8 py-4 border-b border-[#E5E7EB] shrink-0 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[12px] font-bold ${step >= 1 ? 'bg-[#6D28D9] text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
            <span className={`text-[13px] font-bold ${step >= 1 ? 'text-[#1F2937]' : 'text-slate-400'}`}>Period</span>
            <ArrowRight className="w-[14px] h-[14px] text-slate-300 mx-2" />
            
            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[12px] font-bold ${step >= 2 ? 'bg-[#6D28D9] text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
            <span className={`text-[13px] font-bold ${step >= 2 ? 'text-[#1F2937]' : 'text-slate-400'}`}>Upload Data</span>
            <ArrowRight className="w-[14px] h-[14px] text-slate-300 mx-2" />
            
            <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[12px] font-bold ${step >= 3 ? 'bg-[#6D28D9] text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
            <span className={`text-[13px] font-bold ${step >= 3 ? 'text-[#1F2937]' : 'text-slate-400'}`}>Preview & Import</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          
          {/* STEP 1: PERIOD */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-[#1F2937]">01. Select Reporting Period</h3>
                <p className="text-[13px] text-[#6B7280] mt-1">These settings will be applied automatically to all imported records.</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#1F2937] block">Financial Year <span className="text-[#EF4444]">*</span></label>
                  <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9]">
                    <div className="flex items-center gap-[9px] min-w-0">
                      <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
                      <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">{fy || 'Select FY'}</span>
                    </div>
                    <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
                    <select value={fy} onChange={(e) => setFy(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      <option value="" disabled>Select FY</option>
                      {financialYears.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#1F2937] block">Quarter <span className="text-[#EF4444]">*</span></label>
                  <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9]">
                    <div className="flex items-center gap-[9px] min-w-0">
                      <PieChart className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
                      <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">{quarter || 'Select Qtr'}</span>
                    </div>
                    <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
                    <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      <option value="" disabled>Select Qtr</option>
                      {quarters.map((q) => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#1F2937] block">Month <span className="text-[#EF4444]">*</span></label>
                  <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#6D28D9]">
                    <div className="flex items-center gap-[9px] min-w-0">
                      <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
                      <span className="text-[13px] font-semibold text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">{month || 'Select Month'}</span>
                    </div>
                    <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280]" />
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      <option value="" disabled>Select Month</option>
                      {months.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {isPeriodSelected && (
                <div className="mt-8 p-4 bg-[#F5F3FF] border border-[#E5E7EB] rounded-[12px] flex items-center gap-3">
                  <CheckCircle2 className="w-[20px] h-[20px] text-[#6D28D9]" />
                  <div>
                    <div className="text-[12px] font-bold text-[#6D28D9] uppercase tracking-wider">Import Period Set</div>
                    <div className="text-[14px] font-bold text-[#1F2937] mt-0.5">{fy} / {quarter} / {month}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: UPLOAD DATA */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-[18px] font-bold text-[#1F2937]">02. Select Import Method</h3>
                <p className="text-[13px] text-[#6B7280] mt-1">Choose how you want to import your invoice data.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setImportMethod('upload')}
                  className={`p-6 border-2 rounded-[16px] flex flex-col items-center text-center transition-all ${importMethod === 'upload' ? 'border-[#6D28D9] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#6D28D9]/50'}`}
                >
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center mb-4 ${importMethod === 'upload' ? 'bg-[#6D28D9] text-white' : 'bg-slate-100 text-[#6B7280]'}`}>
                    <FileJson className="w-[24px] h-[24px]" />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1F2937]">Upload JSON File</h4>
                  <p className="text-[13px] text-[#6B7280] mt-2">Upload GST portal generated JSON or ERP JSON payload.</p>
                </button>

                <button 
                  onClick={() => setImportMethod('paste')}
                  className={`p-6 border-2 rounded-[16px] flex flex-col items-center text-center transition-all ${importMethod === 'paste' ? 'border-[#6D28D9] bg-[#F5F3FF]' : 'border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#6D28D9]/50'}`}
                >
                  <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center mb-4 ${importMethod === 'paste' ? 'bg-[#6D28D9] text-white' : 'bg-slate-100 text-[#6B7280]'}`}>
                    <FileText className="w-[24px] h-[24px]" />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1F2937]">Copy / Paste Data</h4>
                  <p className="text-[13px] text-[#6B7280] mt-2">Paste Excel, CSV or tab-separated data directly.</p>
                </button>
              </div>

              {importMethod === 'upload' && (
                <div className="mt-8 border-2 border-dashed border-[#E5E7EB] rounded-[16px] bg-[#FFFFFF] p-10 flex flex-col items-center justify-center">
                  <UploadCloud className="w-[48px] h-[48px] text-[#6B7280] mb-4" />
                  <h4 className="text-[16px] font-bold text-[#1F2937]">Upload GSTR-1 JSON</h4>
                  <p className="text-[13px] text-[#6B7280] mt-1 mb-6">Drag & Drop your JSON file here</p>
                  <button className="h-[40px] px-6 bg-[#FFFFFF] border border-[#E5E7EB] text-[#1F2937] text-[13px] font-bold rounded-[10px] hover:border-[#6D28D9] hover:text-[#6D28D9] transition-colors">
                    Browse File
                  </button>
                  <p className="text-[12px] text-[#6B7280] mt-4 font-mono">Supported format: .JSON</p>
                </div>
              )}

              {importMethod === 'paste' && (
                <div className="mt-8 space-y-4">
                  <h4 className="text-[15px] font-bold text-[#1F2937]">Paste GSTR-1 Data</h4>
                  <textarea 
                    value={pastedData}
                    onChange={(e) => setPastedData(e.target.value)}
                    className="w-full h-[200px] p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] text-[13px] font-mono text-[#1F2937] focus:outline-none focus:border-[#6D28D9] focus:ring-1 focus:ring-[#6D28D9]"
                    placeholder="Paste Excel, CSV, tab-separated or JSON data here...&#10;&#10;GSTIN&#9;Party Name&#9;Invoice Number&#9;Taxable Amount..."
                  />
                  <div className="flex justify-end">
                    <button className="h-[40px] px-6 bg-[#6D28D9] text-white text-[13px] font-bold rounded-[10px] hover:bg-[#5B21B6] transition-colors shadow-lg shadow-[#6D28D9]/20">
                      Parse Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PREVIEW & VALIDATE */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-[#1F2937]">03. Preview & Validate</h3>
                  <p className="text-[13px] text-[#6B7280] mt-1">Review the parsed data and resolve any validation errors.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#FFFFFF] p-2 pr-4 rounded-[12px] border border-[#E5E7EB]">
                  <div className="flex flex-col items-center px-4 border-r border-[#E5E7EB]">
                    <span className="text-[18px] font-bold text-[#1F2937] leading-none">125</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mt-1">Total</span>
                  </div>
                  <div className="flex flex-col items-center px-4 border-r border-[#E5E7EB]">
                    <span className="text-[18px] font-bold text-emerald-600 leading-none flex items-center gap-1"><Check className="w-[14px] h-[14px]"/> 122</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mt-1">Valid</span>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <span className="text-[18px] font-bold text-[#EF4444] leading-none flex items-center gap-1"><AlertTriangle className="w-[14px] h-[14px]"/> 3</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mt-1">Invalid</span>
                  </div>
                </div>
              </div>

              {/* Import Summary Card */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] p-6 shadow-sm">
                <h4 className="text-[14px] font-bold text-[#1F2937] mb-4 flex items-center gap-2">
                  <Database className="w-[18px] h-[18px] text-[#6D28D9]" />
                  Import Summary
                </h4>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wide mb-1">Period</div>
                    <div className="text-[13px] font-bold text-[#1F2937]">{fy} / {quarter} / {month}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wide mb-1">Total Taxable Value</div>
                    <div className="text-[16px] font-bold text-[#1F2937]">₹5,48,20,000</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wide mb-1">Total Tax (IGST+CGST+SGST)</div>
                    <div className="text-[16px] font-bold text-[#1F2937]">₹2,23,84,000</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wide mb-1">Total Invoice Value</div>
                    <div className="text-[16px] font-bold text-[#6D28D9]">₹7,72,04,000</div>
                  </div>
                </div>
              </div>

              {/* Preview Table Placeholder */}
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-[16px] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E5E7EB] bg-slate-50 flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-[#1F2937]">Parsed Records Preview</h4>
                  <div className="flex gap-2">
                     <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded border border-amber-200 flex items-center gap-1"><AlertTriangle className="w-[12px] h-[12px]"/> 2 Duplicates Found</span>
                  </div>
                </div>
                <div className="p-12 text-center text-[#6B7280] text-[13px]">
                  [ Data Grid Preview is generated here showing mapped columns and inline validation errors ]
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-slate-50 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="h-[40px] px-6 rounded-[10px] text-[13px] font-bold text-[#6B7280] hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          
          <div className="flex gap-3">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="h-[40px] px-6 rounded-[10px] text-[13px] font-bold text-[#1F2937] border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 ? !isPeriodSelected : !isDataReady}
                className="h-[40px] px-8 rounded-[10px] text-[13px] font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors shadow-lg shadow-[#6D28D9]/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
              >
                Next Step <ArrowRight className="w-[16px] h-[16px]" />
              </button>
            ) : (
              <button 
                onClick={handleImport}
                className="h-[40px] px-8 rounded-[10px] text-[13px] font-bold text-white bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors shadow-lg shadow-[#6D28D9]/20 flex items-center gap-2"
              >
                <Database className="w-[16px] h-[16px]" /> Submit & Import
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
