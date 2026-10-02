import re

def process_file():
    filepath = r"c:\Users\lr690\OneDrive\GST 2.0\src\components\common\ComplianceCalendar.tsx"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where return ( is
    match = re.search(r'^\s*return \(\s*$', content, re.MULTILINE)
    if not match:
        print("Could not find return (")
        return
        
    pre_return = content[:match.start()]
    
    new_jsx = """  return (
    <div className="w-full max-w-[1500px] mx-auto p-[24px] bg-white border border-slate-200 rounded-[14px] shadow-sm">
      
      {/* 3. PAGE HEADER */}
      <div className="flex items-center justify-between mb-[24px]">
        {/* Left side */}
        <div className="flex items-center gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-purple-100 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-[18px] h-[18px] text-purple-700" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-[12px]">
              <h1 className="text-[18px] font-bold text-slate-900 m-0 leading-none">Statutory GST Compliance Calendar</h1>
              <span className="bg-purple-100 text-purple-800 text-[12px] font-semibold px-[8px] py-[4px] rounded-[6px] leading-none shrink-0">{financialYear}</span>
            </div>
            <p className="text-[13px] text-slate-500 leading-[20px] m-0 mt-[4px]">Monitor statutory deadlines, filing status, and net tax obligations.</p>
          </div>
        </div>

        {/* 4. ACTION BUTTON ROW */}
        <div className="flex items-center gap-[10px]">
          <button className="h-[40px] px-[16px] rounded-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[13px] font-medium flex items-center gap-[8px] transition-colors">
            <Zap className="w-[18px] h-[18px]" /> 3-Day Pre-Deadline Engine
          </button>
          <button className="h-[40px] px-[16px] rounded-[10px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[13px] font-medium flex items-center gap-[8px] transition-colors">
            <Send className="w-[18px] h-[18px]" /> Send 3-Day Notice
          </button>
          <button onClick={handleTriggerApproachingDeadlines} className="h-[40px] px-[16px] rounded-[10px] bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-[13px] font-medium flex items-center gap-[8px] transition-colors">
            <AlertTriangle className="w-[18px] h-[18px] text-orange-500" /> Trigger Deadline Alerts
          </button>
          <button onClick={() => setViewMode('calendar')} className={`h-[40px] px-[16px] rounded-[10px] text-[13px] font-medium flex items-center gap-[8px] transition-colors border ${viewMode === 'calendar' ? 'bg-purple-700 text-white border-purple-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
            <CalendarDays className="w-[18px] h-[18px]" /> Month Calendar View
          </button>
          <button onClick={() => setViewMode('matrix')} className={`h-[40px] px-[16px] rounded-[10px] text-[13px] font-medium flex items-center gap-[8px] transition-colors border ${viewMode === 'matrix' ? 'bg-purple-700 text-white border-purple-700' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
            <TableProperties className="w-[18px] h-[18px]" /> Full FY Schedule Matrix
          </button>
        </div>
      </div>

      {/* 5. TAX PERIOD NAVIGATION */}
      <div className="flex items-center gap-[8px] mb-[24px] overflow-x-auto pb-[4px] scrollbar-hide">
        <span className="w-[100px] shrink-0 text-[12px] font-bold text-slate-500 tracking-wider">TAX PERIOD:</span>
        {yearSchedule.map((s) => {
           const isActive = s.month === activeMonthFilter;
           const isCompleted = s.gstr3bStatus === 'Submitted' && s.gstr1Status === 'Submitted';
           const indicator = isCompleted ? 'bg-green-500' : 'bg-orange-500';
           
           return (
             <button
               key={s.month}
               onClick={() => setActiveMonthFilter(s.month)}
               className={`h-[34px] px-[16px] shrink-0 rounded-[8px] text-[13px] font-medium flex items-center gap-[8px] transition-colors border ${
                 isActive 
                   ? 'bg-purple-700 text-white border-purple-700' 
                   : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
               }`}
             >
               <span className={`w-[8px] h-[8px] rounded-full ${isActive ? 'bg-white' : indicator}`} />
               {s.month}
             </button>
           );
        })}
      </div>

      {viewMode === 'calendar' ? (
        /* 6. MAIN CONTENT GRID */
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-[24px] items-start">
          
          {/* 7. CALENDAR CARD */}
          <div className="w-full bg-white border border-slate-200 rounded-[14px] p-[20px] min-h-[390px] flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-[20px]">
              <h3 className="text-[16px] font-bold text-slate-800">{activeMonthFilter} {currentActiveSchedule?.year || 2026}</h3>
              <div className="flex items-center gap-[8px]">
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-slate-100 text-slate-600 border border-slate-200"><ChevronLeft className="w-[18px] h-[18px]" /></button>
                <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:bg-slate-100 text-slate-600 border border-slate-200"><ChevronRight className="w-[18px] h-[18px]" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-y-[8px] mb-[auto]">
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(day => (
                <div key={day} className="text-[12px] font-bold text-slate-400 text-center flex items-center justify-center h-[32px]">{day}</div>
              ))}
              <div /><div />
              {[...Array(30)].map((_, i) => {
                 const day = i + 1;
                 // 8. CALENDAR STATUS COLORS
                 let statusClass = "text-slate-700 hover:bg-slate-100";
                 if (day === 11) {
                   statusClass = currentActiveSchedule?.gstr1Status === 'Submitted' ? "text-green-700 font-bold bg-green-50 border border-green-200" : "text-red-700 font-bold bg-red-50 border border-red-200";
                 } else if (day === 14) {
                   statusClass = "text-blue-700 font-bold bg-blue-50 border border-blue-200";
                 } else if (day === 20) {
                   statusClass = currentActiveSchedule?.gstr3bStatus === 'Submitted' ? "text-green-700 font-bold bg-green-50 border border-green-200" : "text-red-700 font-bold bg-red-50 border border-red-200";
                 }
                 return (
                   <div key={day} className="flex items-center justify-center">
                     <div className={`w-[40px] h-[40px] flex items-center justify-center rounded-[10px] text-[13px] cursor-pointer transition-colors ${statusClass}`}>
                       {day}
                     </div>
                   </div>
                 );
              })}
            </div>

            {/* 9. CALENDAR LEGEND */}
            <div className="mt-[24px] pt-[16px] border-t border-slate-200 flex flex-col gap-[12px]">
               <div className="flex items-center gap-[12px] h-[20px]">
                 <div className="w-[8px] h-[8px] rounded-full bg-green-500"></div>
                 <span className="text-[13px] text-slate-600 font-medium">Submitted / Filed</span>
               </div>
               <div className="flex items-center gap-[12px] h-[20px]">
                 <div className="w-[8px] h-[8px] rounded-full bg-blue-500"></div>
                 <span className="text-[13px] text-slate-600 font-medium">System Generated / Locked</span>
               </div>
               <div className="flex items-center gap-[12px] h-[20px]">
                 <div className="w-[8px] h-[8px] rounded-full bg-red-500"></div>
                 <span className="text-[13px] text-slate-600 font-medium">Pending / Overdue</span>
               </div>
            </div>
          </div>

          {/* 10. RIGHT SIDE DEADLINE CARDS */}
          <div className="flex flex-col gap-[16px]">
             {filteredCards.map((deadline) => (
                <div key={deadline.id} className="bg-white border border-slate-200 rounded-[14px] p-[18px] min-h-[145px] shadow-sm hover:border-purple-300 transition-colors flex flex-col justify-between">
                  
                  {/* 11. DEADLINE CARD HEADER */}
                  <div className="flex items-start gap-[16px]">
                    <div className="w-[50px] h-[50px] rounded-[14px] shrink-0 flex items-center justify-center bg-slate-50 border border-slate-200">
                       <FileText className="w-[24px] h-[24px] text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-[16px]">
                        <h4 className="text-[14px] font-bold text-slate-900 m-0 truncate">{deadline.title}</h4>
                        <span className={`text-[12px] font-semibold px-[8px] py-[4px] rounded-[6px] shrink-0 border ${
                          deadline.status === 'Submitted' ? 'bg-green-50 text-green-700 border-green-200' : 
                          deadline.status === 'Locked' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {deadline.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-500 leading-[18px] mt-[4px] mb-[12px]">{deadline.description}</p>
                      
                      {/* 12. DEADLINE INFORMATION ROW */}
                      <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[12px]">
                        <div className="flex items-center gap-[8px]">
                          <CalendarIcon className="w-[16px] h-[16px] text-slate-400" />
                          <span className="text-[13px] text-slate-700 font-medium">{deadline.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-[8px]">
                          <CheckCircle2 className="w-[16px] h-[16px] text-slate-400" />
                          <span className="text-[13px] text-slate-700">{deadline.arn || 'ARN Pending'}</span>
                        </div>
                        {deadline.formName === 'GSTR-3B' && (
                          <div className="flex items-center gap-[8px]">
                            <Landmark className="w-[16px] h-[16px] text-slate-400" />
                            <span className="text-[13px] text-slate-700 font-medium">Net Cash: ₹{formatINR(deadline.liability)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 13. CARD ACTION BUTTONS */}
                  <div className="flex items-center gap-[12px] mt-[16px] sm:pl-[66px] flex-wrap">
                    <button 
                      onClick={() => handleToggleFormStatus(deadline.formName as any)}
                      className="h-[36px] px-[16px] rounded-[9px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[13px] font-medium flex items-center gap-[8px] transition-colors"
                    >
                      <Check className="w-[16px] h-[16px]" /> 
                      {deadline.status === 'Pending' ? 'Mark Submitted' : 'Mark Pending'}
                    </button>
                    <button 
                      onClick={() => handleTriggerManualThreeDayAlert(deadline.formName as any, currentActiveSchedule!)}
                      className="h-[36px] px-[16px] rounded-[9px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[13px] font-medium flex items-center gap-[8px] transition-colors"
                    >
                      <Bell className="w-[16px] h-[16px]" /> 3-Day Alert
                    </button>
                    <button 
                      onClick={() => onNavigate(deadline.navigationTarget)}
                      className="h-[36px] px-[16px] rounded-[9px] bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-[13px] font-semibold flex items-center gap-[8px] ml-auto transition-colors"
                    >
                      Open {deadline.formName} <ArrowRight className="w-[16px] h-[16px]" />
                    </button>
                  </div>
                </div>
             ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
           <TableProperties className="w-[48px] h-[48px] mb-[16px] text-slate-300" />
           <p className="text-[14px] font-medium">Matrix View rendering requires complex data mapping which has been simplified in this standard view.</p>
           <button onClick={() => setViewMode('calendar')} className="mt-[16px] text-purple-600 font-semibold text-[13px] hover:underline">Return to Calendar View</button>
        </div>
      )}
    </div>
  );
};
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(pre_return + new_jsx)
        
    print("Full rewrite applied successfully.")

if __name__ == '__main__':
    process_file()
