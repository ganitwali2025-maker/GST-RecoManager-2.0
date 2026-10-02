import re

def process_file():
    filepath = r"c:\Users\lr690\OneDrive\GST 2.0\src\components\layout\Header.tsx"
    
    new_header_code = """import React, { useState } from 'react';
import { 
  Calendar, 
  Bell, 
  ChevronDown,
  User,
  LogOut,
  PieChart
} from 'lucide-react';
import { Company } from '../../types/gst';

interface HeaderProps {
  pageTitle: string;
  breadcrumb: string[];
  companies: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
  selectedFy: string;
  onSelectFy: (fy: string) => void;
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onOpenImport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  breadcrumb,
  selectedFy,
  onSelectFy,
  selectedMonth,
  onSelectMonth,
  unreadNotificationsCount,
  onOpenNotifications,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2 (Jul-Sep)');

  const months = [
    'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December', 'January', 'February', 'March'
  ];

  const quarters = ['Q1 (Apr-Jun)', 'Q2 (Jul-Sep)', 'Q3 (Oct-Dec)', 'Q4 (Jan-Mar)'];
  const financialYears = ['FY 2026-27', 'FY 2025-26', 'FY 2024-25'];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E5E7EB] h-[64px] px-6 flex items-center justify-between border-l-[4px] border-l-[#6D28D9]">
      {/* Left: Title & Breadcrumbs */}
      <div className="flex flex-col justify-center h-full">
        <div className="flex items-center gap-2 text-[12px] text-[#6B7280] font-medium leading-tight">
          <span>GST RecoManager</span>
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[#6B7280]">/</span>
              <span className={idx === breadcrumb.length - 1 ? 'text-[#6D28D9] font-bold' : ''}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center mt-1">
          <h1 className="text-[20px] font-bold text-[#1F2937] leading-none tracking-tight">{pageTitle}</h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 h-full">
        
        {/* Date Selectors Group */}
        <div className="flex items-center gap-3 border-r border-[#E5E7EB] pr-4">
          {/* Financial Year Selector */}
          <div className="relative group">
            <select
              value={selectedFy}
              onChange={(e) => onSelectFy(e.target.value)}
              className="appearance-none bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] hover:text-[#6D28D9] rounded-[8px] pl-10 pr-8 text-[13px] font-semibold text-[#1F2937] focus:outline-none cursor-pointer h-[40px] transition-colors"
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy}>{fy}</option>
              ))}
            </select>
            <Calendar className="w-[18px] h-[18px] text-[#6D28D9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
            <ChevronDown className="w-[16px] h-[16px] text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
          </div>

          {/* Quarter Selector */}
          <div className="relative group">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="appearance-none bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] hover:text-[#6D28D9] rounded-[8px] pl-10 pr-8 text-[13px] font-semibold text-[#1F2937] focus:outline-none cursor-pointer h-[40px] transition-colors"
            >
              {quarters.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <PieChart className="w-[18px] h-[18px] text-[#6D28D9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
            <ChevronDown className="w-[16px] h-[16px] text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
          </div>

          {/* Month Selector */}
          <div className="relative group">
            <select
              value={selectedMonth}
              onChange={(e) => onSelectMonth(e.target.value)}
              className="appearance-none bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F5F3FF] hover:border-[#6D28D9] hover:text-[#6D28D9] rounded-[8px] pl-10 pr-8 text-[13px] font-semibold text-[#1F2937] focus:outline-none cursor-pointer h-[40px] transition-colors"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m} 2026</option>
              ))}
            </select>
            <Calendar className="w-[18px] h-[18px] text-[#6D28D9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
            <ChevronDown className="w-[16px] h-[16px] text-[#6B7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-[#6D28D9] transition-colors" />
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[8px] border border-[#E5E7EB] text-[#6B7280] hover:text-[#6D28D9] hover:bg-[#F5F3FF] hover:border-[#6D28D9] transition-colors"
            title="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-[#EF4444] rounded-full border-2 border-[#FFFFFF] text-[8px] font-bold text-white flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Profile Dropdown Button */}
          <button className="flex items-center gap-2 h-[40px] px-3 rounded-[8px] border border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F5F3FF] hover:border-[#6D28D9] transition-colors group">
            <div className="w-[24px] h-[24px] rounded-full bg-[#F5F3FF] flex items-center justify-center text-[#6D28D9]">
              <User className="w-[14px] h-[14px]" />
            </div>
            <span className="text-[13px] font-bold text-[#1F2937] group-hover:text-[#6D28D9] transition-colors">CA Rajesh Sharma</span>
            <ChevronDown className="w-[16px] h-[16px] text-[#6B7280] group-hover:text-[#6D28D9] transition-colors ml-1" />
          </button>
          
          {/* Logout Button */}
          <button 
            className="flex items-center justify-center w-[40px] h-[40px] rounded-[8px] bg-[#FFFFFF] border border-[#E5E7EB] text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#EF4444] transition-colors" 
            title="Logout"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_header_code)
        
    print("Header rewritten successfully to match exact specs.")

if __name__ == '__main__':
    process_file()
