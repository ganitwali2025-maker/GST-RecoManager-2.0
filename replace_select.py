import re

def process_file():
    filepath = r"c:\Users\lr690\OneDrive\GST 2.0\src\components\layout\Header.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_selectors = """        {/* Date Selectors Group */}
        <div className="flex items-center gap-3 border-r border-[#E5E7EB] pr-4">
          
          {/* Financial Year Selector */}
          <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] rounded-[10px] cursor-pointer group transition-colors min-w-[145px]">
            <div className="flex items-center gap-[9px] min-w-0">
              <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
              <span className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#6D28D9] whitespace-nowrap overflow-hidden text-ellipsis">{selectedFy}</span>
            </div>
            <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280] group-hover:text-[#6D28D9]" />
            <select
              value={selectedFy}
              onChange={(e) => onSelectFy(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
          </div>

          {/* Quarter Selector */}
          <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] rounded-[10px] cursor-pointer group transition-colors min-w-[155px]">
            <div className="flex items-center gap-[9px] min-w-0">
              <PieChart className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
              <span className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#6D28D9] whitespace-nowrap overflow-hidden text-ellipsis">{selectedQuarter}</span>
            </div>
            <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280] group-hover:text-[#6D28D9]" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {quarters.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="relative flex items-center justify-between gap-[12px] h-[40px] px-[14px] bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] rounded-[10px] cursor-pointer group transition-colors min-w-[165px]">
            <div className="flex items-center gap-[9px] min-w-0">
              <Calendar className="w-[18px] h-[18px] shrink-0 text-[#6D28D9]" />
              <span className="text-[13px] font-semibold text-[#1F2937] group-hover:text-[#6D28D9] whitespace-nowrap overflow-hidden text-ellipsis">{selectedMonth} 2026</span>
            </div>
            <ChevronDown className="w-[16px] h-[16px] shrink-0 text-[#6B7280] group-hover:text-[#6D28D9]" />
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m} 2026</option>
              ))}
            </select>
          </div>
        </div>"""

    # We need to replace everything from {/* Date Selectors Group */} to the end of its div.
    # We can use regex.
    content = re.sub(
        r'\{\/\* Date Selectors Group \*\/\}.*?\{\/\* User Profile & Actions \*\/\}',
        new_selectors + "\n\n        {/* User Profile & Actions */}",
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Replaced date selectors successfully.")

if __name__ == '__main__':
    process_file()
