import re

def process_file():
    filepath = r"c:\Users\lr690\OneDrive\GST 2.0\src\components\common\ComplianceCalendar.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. OVERALL CONTAINER
    content = re.sub(
        r'<div className="bg-white rounded-3xl border border-slate-200/90 p-\[20px\] shadow-xs space-y-6">',
        r'<div className="w-full max-w-[1500px] mx-auto p-[24px] bg-white border border-slate-200 rounded-[14px] shadow-sm space-y-[24px]">',
        content
    )

    # 3. PAGE HEADER Title and Subtitle
    content = re.sub(r'<h2 className="text-xl font-bold', r'<h2 className="text-[18px] font-bold', content)
    content = re.sub(r'<p className="text-xs text-slate-500">', r'<p className="text-[13px] text-slate-500 leading-[20px] mt-[4px]">', content)
    # Header calendar icon container
    content = re.sub(r'w-10 h-10 rounded-2xl bg-purple-100', r'w-[40px] h-[40px] rounded-[10px] bg-purple-100', content)

    # 4. ACTION BUTTON ROW
    # Find action buttons at top
    # px-3 py-1.5 rounded-xl text-xs
    content = re.sub(
        r'className="([^"]*)px-3 py-1\.5 rounded-xl text-xs([^"]*)"',
        r'className="\1 h-[40px] px-[16px] rounded-[10px] text-[13px] \2"',
        content
    )
    # also for trigger alert button
    content = re.sub(r'px-4 py-1\.5 rounded-xl text-xs', r'h-[40px] px-[16px] rounded-[10px] text-[13px]', content)
    
    # 5. TAX PERIOD NAVIGATION
    # "TAX PERIOD:" label
    content = re.sub(r'<span className="text-xs font-bold text-purple-700 tracking-wider">', r'<span className="w-[100px] shrink-0 text-[12px] font-bold text-slate-500 tracking-wider">', content)
    # Month buttons
    content = re.sub(
        r'onClick=\{.*?setActiveMonthFilter.*?className={`px-3 py-1\.5 rounded-xl text-xs',
        r'onClick={() => setActiveMonthFilter(s.month)} className={`h-[34px] px-[16px] shrink-0 rounded-[8px] text-[13px]',
        content,
        flags=re.DOTALL
    )

    # 6. MAIN CONTENT GRID
    content = re.sub(
        r'<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">',
        r'<div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)] gap-[24px] items-start">',
        content
    )

    # 7. CALENDAR CARD & 10. RIGHT SIDE CARDS
    content = re.sub(r'lg:col-span-4 ', r'', content)
    content = re.sub(r'lg:col-span-8 ', r'', content)
    content = re.sub(
        r'bg-gradient-to-b from-slate-50 to-purple-50/20 rounded-2xl p-4 border border-slate-200/80',
        r'bg-white border border-slate-200 rounded-[14px] p-[20px] min-h-[390px] shadow-sm',
        content
    )

    # Calendar Cells
    content = re.sub(
        r'className={`h-8 rounded-lg flex flex-col',
        r'className={`h-[40px] w-[40px] mx-auto rounded-[8px] flex flex-col',
        content
    )
    
    # Empty calendar cells
    content = re.sub(r'className="h-8 rounded-lg opacity-20"', r'className="h-[40px] w-[40px] mx-auto rounded-[8px] opacity-20"', content)

    # RIGHT SIDE CARDS
    content = re.sub(
        r'className={`rounded-2xl p-4 border',
        r'className={`min-h-[145px] p-[18px] rounded-[14px] border',
        content
    )

    # CARD HEADER
    # GST badge (Icon container)
    content = re.sub(
        r'<div className="w-10 h-10 rounded-xl bg-slate-50',
        r'<div className="w-[50px] h-[50px] rounded-[14px] shrink-0 bg-slate-50',
        content
    )
    # Title
    content = re.sub(r'<h4 className="font-bold text-slate-800 text-sm truncate">', r'<h4 className="font-bold text-slate-900 text-[14px] truncate">', content)
    # Description
    content = re.sub(r'<p className="text-xs text-slate-500 mt-1 line-clamp-2">', r'<p className="text-[12px] leading-[18px] text-slate-500 mt-[4px] mb-[12px] line-clamp-2">', content)

    # INFORMATION ROW
    content = re.sub(r'gap-4 mt-3 mb-4', r'gap-[16px] mt-0 mb-[16px]', content) # adjust spacing

    # CARD ACTION BUTTONS
    content = re.sub(
        r'py-1\.5 px-3 rounded-lg text-xs font-semibold',
        r'h-[36px] px-[12px] rounded-[9px] text-[13px] font-semibold',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Replacements applied successfully.")

if __name__ == '__main__':
    process_file()
