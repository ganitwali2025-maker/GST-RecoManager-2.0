import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, ClipboardPaste, RefreshCw, CheckCircle2, AlertTriangle, Trash2, Edit3, ArrowRight, Database } from 'lucide-react';
import { ImportPreviewRow } from '../../types/gst';
import { formatINR } from '../../utils/formatters';

interface ImportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (rows: ImportPreviewRow[]) => void;
}

export const ImportCenterModal: React.FC<ImportCenterModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'sheets'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pasteContent, setPasteContent] = useState('');
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit');
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[] | null>(null);
  const [fileName, setFileName] = useState('Purchase_Register_Sep2026.xlsx');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const mockParseData = () => {
    setIsProcessing(true);
    setUploadProgress(20);
    setTimeout(() => setUploadProgress(65), 300);
    setTimeout(() => {
      setUploadProgress(100);
      setIsProcessing(false);
      setPreviewRows([
        {
          id: 'row-1',
          rowNumber: 1,
          supplierName: 'Tata Steel Limited',
          gstin: '20AAACT2702H1ZQ',
          invoiceNo: 'TSL/26-27/09421',
          invoiceDate: '2026-09-04',
          taxableValue: 4850000,
          igst: 873000,
          cgst: 0,
          sgst: 0,
          status: 'valid',
          errors: [],
        },
        {
          id: 'row-2',
          rowNumber: 2,
          supplierName: 'Ultratech Cement Ltd',
          gstin: '23AAACU4221K1ZW',
          invoiceNo: 'UTC/MP/2609/118',
          invoiceDate: '2026-09-08',
          taxableValue: 3200000,
          igst: 0,
          cgst: 448000,
          sgst: 448000,
          status: 'valid',
          errors: [],
        },
        {
          id: 'row-3',
          rowNumber: 3,
          supplierName: 'Apex Machinery Spares',
          gstin: '23ABC999', // invalid
          invoiceNo: 'AMS/09/88',
          invoiceDate: '2026-09-12',
          taxableValue: 120000,
          igst: 21600,
          cgst: 0,
          sgst: 0,
          status: 'invalid',
          errors: ['Invalid GSTIN format (length < 15)'],
        },
        {
          id: 'row-4',
          rowNumber: 4,
          supplierName: 'Blue Dart Express Limited',
          gstin: '27AAACB0446N1ZT',
          invoiceNo: 'BDE/EXP/2026/8941',
          invoiceDate: '2026-09-18',
          taxableValue: 240000,
          igst: 43200,
          cgst: 0,
          sgst: 0,
          status: 'duplicate',
          errors: ['Duplicate invoice already exists in database'],
        },
        {
          id: 'row-5',
          rowNumber: 5,
          supplierName: 'Kalyani Steels & Forgings Ltd',
          gstin: '27AAACK1104D1ZY',
          invoiceNo: 'KSF/PUN/26/1842',
          invoiceDate: '2026-09-24',
          taxableValue: 1450000,
          igst: 261000,
          cgst: 0,
          sgst: 0,
          status: 'valid',
          errors: [],
        },
      ]);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      mockParseData();
    }
  };

  const handleDeleteRow = (id: string) => {
    if (previewRows) {
      setPreviewRows(previewRows.filter(r => r.id !== id));
    }
  };

  const handleDeleteAll = () => {
    setPreviewRows([]);
  };

  const handleConfirmImport = () => {
    if (previewRows) {
      const validOnes = previewRows.filter(r => r.status === 'valid');
      onImportSuccess(validOnes);
      onClose();
    }
  };

  // Document Summary calculations
  const totalRows = previewRows ? previewRows.length : 0;
  const validRows = previewRows ? previewRows.filter(r => r.status === 'valid').length : 0;
  const invalidRows = previewRows ? previewRows.filter(r => r.status === 'invalid').length : 0;
  const duplicateRows = previewRows ? previewRows.filter(r => r.status === 'duplicate').length : 0;
  const totalTaxable = previewRows ? previewRows.reduce((acc, r) => acc + r.taxableValue, 0) : 0;
  const totalGst = previewRows ? previewRows.reduce((acc, r) => acc + (r.igst + r.cgst + r.sgst), 0) : 0;

  const filteredPreview = previewRows?.filter(r => 
    r.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-purple-50/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-[18px] h-[18px]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">GST Data Import Center</h3>
              <p className="text-xs text-slate-500 font-medium">
                Direct ingest into PostgreSQL with schema validation & duplicate prevention
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Tabs & Content */}
        {!previewRows ? (
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Method Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 gap-1 max-w-md">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'upload' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-[18px] h-[18px]" />
                Upload Excel / CSV
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'paste' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardPaste className="w-[18px] h-[18px]" />
                Paste Excel
              </button>
              <button
                onClick={() => setActiveTab('sheets')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'sheets' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-[18px] h-[18px]" />
                Google Sheets
              </button>
            </div>

            {/* Tab: Upload */}
            {activeTab === 'upload' && (
              <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl p-8 text-center transition-colors bg-purple-50/20">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-4 shadow-xs">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Drag and drop your Excel (.xlsx, .xls) or CSV file
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Standard format for Tally Prime, SAP ECC/S4HANA, Busy, Zoho Books, or ClearTax purchase exports.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors">
                  <UploadCloud className="w-[18px] h-[18px]" />
                  Select File from Computer
                  <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileUpload} />
                </label>
                <button
                  type="button"
                  onClick={mockParseData}
                  className="block mx-auto mt-3 text-xs text-purple-600 font-medium hover:underline"
                >
                  Or click here to load sample demo purchase register
                </button>
              </div>
            )}

            {/* Tab: Paste */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Paste rows directly from Microsoft Excel or Google Sheets (Tab-Separated):
                </label>
                <textarea
                  rows={6}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Supplier Name&#9;GSTIN&#9;Invoice No&#9;Invoice Date&#9;Taxable Value&#9;IGST&#9;CGST&#9;SGST..."
                  className="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
                <button
                  onClick={mockParseData}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
                >
                  Parse Pasted Data
                </button>
              </div>
            )}

            {/* Tab: Google Sheets Sync */}
            {activeTab === 'sheets' && (
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Database className="w-[18px] h-[18px] text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Google Sheets Sync Mirror</h5>
                    <p className="text-[11px] text-slate-500">
                      Syncs data from spreadsheet into PostgreSQL. PostgreSQL remains primary single source of truth.
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Enter Google Sheets Sharing Link"
                />
                <button
                  onClick={mockParseData}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <RefreshCw className="w-[18px] h-[18px]" />
                  Sync & Fetch Rows
                </button>
              </div>
            )}

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-700">
                  <span>Validating data integrity against GSTIN rules & DB constraints...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-2 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PREVIEW STAGE */
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Document Summary */}
            <div className="bg-gradient-to-r from-purple-50 via-slate-50 to-purple-50/40 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Document Summary • {fileName}
                </h4>
                <button
                  onClick={() => setPreviewRows(null)}
                  className="text-xs text-purple-700 font-semibold hover:underline"
                >
                  Upload Another File
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Rows</span>
                  <span className="text-lg font-bold text-slate-800">{totalRows}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Valid Rows</span>
                  <span className="text-lg font-bold text-emerald-700">{validRows}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Invalid Rows</span>
                  <span className="text-lg font-bold text-rose-700">{invalidRows}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Duplicates</span>
                  <span className="text-lg font-bold text-amber-700">{duplicateRows}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Taxable Value</span>
                  <span className="text-xs font-bold text-slate-800">{formatINR(totalTaxable, { compact: true })}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-purple-200">
                  <span className="text-[10px] uppercase font-bold text-purple-700 block">Total GST</span>
                  <span className="text-xs font-bold text-purple-800">{formatINR(totalGst, { compact: true })}</span>
                </div>
              </div>
            </div>

            {/* Filter & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplier, GSTIN, invoice..."
                className="text-xs p-2.5 border border-slate-200 rounded-xl w-64 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteAll}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold border border-rose-200 flex items-center gap-1"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Preview Table */}
            <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-60">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Supplier Name</th>
                    <th className="py-2.5 px-3">GSTIN</th>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3 text-right">Taxable</th>
                    <th className="py-2.5 px-3 text-right">Tax Amount</th>
                    <th className="py-2.5 px-3">Validation Note</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPreview?.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{row.rowNumber}</td>
                      <td className="py-2.5 px-3">
                        {row.status === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        )}
                        {row.status === 'invalid' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> Invalid
                          </span>
                        )}
                        {row.status === 'duplicate' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" /> Duplicate
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.supplierName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{row.gstin}</td>
                      <td className="py-2.5 px-3 font-mono">{row.invoiceNo}</td>
                      <td className="py-2.5 px-3 text-right font-medium">{formatINR(row.taxableValue)}</td>
                      <td className="py-2.5 px-3 text-right text-purple-700 font-semibold">{formatINR(row.igst + row.cgst + row.sgst)}</td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {row.errors.length > 0 ? (
                          <span className="text-rose-600 font-medium">{row.errors.join(', ')}</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">Passed schema check</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-[18px] h-[18px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Database className="w-[18px] h-[18px] text-purple-600" />
            <span>Target: PostgreSQL table <code className="text-purple-700 font-mono">gst_purchase_invoices</code></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
            >
              Cancel
            </button>
            {previewRows && (
              <button
                onClick={handleConfirmImport}
                disabled={validRows === 0}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                Import {validRows} Valid Rows to Database
                <ArrowRight className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
