import re

with open("src/components/views/Gstr1View.tsx", "r") as f:
    content = f.read()

new_render = """
  const importBtn = (
    <button 
      onClick={() => setIsImportModalOpen(true)}
      className="flex items-center justify-center gap-2 h-[40px] px-4 rounded-[10px] bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-[13px] font-bold shadow-lg shadow-[#6D28D9]/20 transition-colors shrink-0"
    >
      <UploadCloud className="w-[18px] h-[18px]" />
      Import
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Sales"
          value={formatINR(totalSales, { compact: true })}
          percentage="Outward Total"
          isPositive={true}
          comparisonText="Gross supply"
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <KpiCard
          title="Taxable Sales"
          value={formatINR(taxableSales, { compact: true })}
          percentage="84.8% Taxable"
          isPositive={true}
          comparisonText="Excluding nil-rate"
          icon={ReceiptText}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KpiCard
          title="IGST"
          value={formatINR(totalIgst, { compact: true })}
          percentage="Interstate"
          isPositive={true}
          comparisonText="Integrated tax"
          icon={FileText}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
        />
        <KpiCard
          title="CGST"
          value={formatINR(totalCgst, { compact: true })}
          percentage="Intrastate"
          isPositive={true}
          comparisonText="Central tax"
          icon={FileText}
          iconBgColor="bg-teal-50"
          iconColor="text-teal-600"
        />
        <KpiCard
          title="SGST"
          value={formatINR(totalSgst, { compact: true })}
          percentage="Intrastate"
          isPositive={true}
          comparisonText="State tax"
          icon={FileText}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title="Invoice Count"
          value={`${invoiceCount} Invoices`}
          percentage="100% E-Invoiced"
          isPositive={true}
          comparisonText="IRN Generated"
          icon={QrCode}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 py-1 custom-scrollbar pb-2">
        {[
          { id: 'B2B', label: 'B2B Regular (4A, 4B)', icon: <FileText className="w-4 h-4" /> },
          { id: 'B2C', label: 'B2C Large & Small (5, 7)', icon: <ReceiptText className="w-4 h-4" /> },
          { id: 'CDNR', label: 'Credit Note (9B Reg)', icon: <FileText className="w-4 h-4" /> },
          { id: 'CDNUR', label: 'Debit Note (9B Unreg)', icon: <FileText className="w-4 h-4" /> },
          { id: 'EXP', label: 'Exports (6A)', icon: <UploadCloud className="w-4 h-4" /> },
          { id: 'NIL', label: 'Nil Rated (8A)', icon: <FileText className="w-4 h-4" /> },
          { id: 'EXEMPT', label: 'Exempted (8B)', icon: <FileText className="w-4 h-4" /> },
          { id: 'HSN', label: 'HSN Summary (12)', icon: <TrendingUp className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 h-[42px] px-5 rounded-[12px] text-[13px] font-bold whitespace-nowrap transition-all border shadow-sm ${
              activeTab === tab.id
                ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/20'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#6D28D9] hover:text-[#6D28D9] hover:bg-[#F5F3FF]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Table Block */}
      <div className="bg-[#FFFFFF] rounded-[16px] shadow-sm">
        <DataTable
          data={entries}
          columns={columns}
          searchPlaceholder="Search Financial Year, GSTIN, Party Name, Invoice No..."
          searchFields={['customerName', 'customerGstin', 'invoiceNo', 'financialYear']}
          toolbarAction={importBtn}
        />
      </div>

      {isImportModalOpen && (
        <Gstr1ImportModal 
          onClose={() => setIsImportModalOpen(false)} 
          onImportSuccess={(count) => {
            setIsImportModalOpen(false);
            alert(`${count} records imported successfully.`);
          }}
        />
      )}
    </div>
  );
};
"""

match = re.search(r'(  const columns: ColumnDef<Gstr1Entry>\[\] = \[.*?\];\n)', content, flags=re.DOTALL)
if match:
    prefix = content[:match.end()]
    new_content = prefix + "\n" + new_render
    with open("src/components/views/Gstr1View.tsx", "w") as f:
        f.write(new_content)
    print("Updated successfully")
else:
    print("Could not find columns array.")
