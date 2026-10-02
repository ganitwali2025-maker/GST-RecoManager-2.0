import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Send,
  Check,
  FileText,
  TableProperties,
  CalendarDays,
  CalendarCheck,
  AlertCircle,
  Info,
  HelpCircle,
  Landmark,
  Scale,
  ShieldAlert,
  Zap,
  Timer
} from 'lucide-react';
import { ComplianceDeadline, NotificationItem } from '../../types/gst';
import { formatINR } from '../../utils/formatters';

interface ComplianceCalendarProps {
  financialYear?: string;
  selectedMonth?: string;
  onNavigate: (page: string) => void;
  onAddNotification?: (notification: NotificationItem) => void;
}

interface MonthlyFilingSchedule {
  month: string;
  year: number;
  taxPeriod: string;
  gstr1DueDate: string;
  gstr1Status: 'Submitted' | 'Pending';
  gstr1Arn?: string;
  gstr2bDueDate: string;
  gstr2bStatus: 'Submitted' | 'Pending';
  gstr3bDueDate: string;
  gstr3bStatus: 'Submitted' | 'Pending';
  gstr3bLiability: number;
  daysRemainingFor3B: number;
}

interface DeadlineAuthorityDetails {
  authority: string;
  originalDueDate: string;
  gracePeriod: string;
  governingRule: string;
  lateFeePenalty: string;
  impactOnCompliance: string;
}

export const STATUTORY_AUTHORITY_INFO: Record<'GSTR-1' | 'GSTR-2B' | 'GSTR-3B', DeadlineAuthorityDetails> = {
  'GSTR-1': {
    authority: 'Central Board of Indirect Taxes & Customs (CBIC) / GSTN',
    originalDueDate: '11th of succeeding month (Rule 59 of CGST Rules, 2017)',
    gracePeriod: 'No statutory grace period under Section 47. Late fee accrues from the 12th. Note: IFF window for QRMP quarterly filers closes on the 13th.',
    governingRule: 'Section 37 of CGST Act, 2017 read with Rule 59',
    lateFeePenalty: '₹50 per day (₹25 CGST + ₹25 SGST) up to maximum ₹10,000 per return. ₹20 per day for Nil returns.',
    impactOnCompliance: 'Delayed filing prevents counterparties from availing input tax credit in their GSTR-2B statement for the current tax period.'
  },
  'GSTR-2B': {
    authority: 'GSTN Central Automated Processing System',
    originalDueDate: '14th of succeeding month (Rule 60(7) of CGST Rules)',
    gracePeriod: 'Non-extendable automated engine lock. Invoices filed by suppliers after 11th (or 13th for IFF) roll over to next month\'s GSTR-2B.',
    governingRule: 'Section 38 of CGST Act, 2017 read with Rule 60(7)',
    lateFeePenalty: 'System-generated statement. No direct monetary fine on recipient, but unreflected ITC cannot be legally claimed in GSTR-3B under Rule 36(4).',
    impactOnCompliance: 'Frozen snapshot used to validate eligible credit under Section 16(2)(aa) before GSTR-3B filing.'
  },
  'GSTR-3B': {
    authority: 'CBIC & State Tax Enforcement Authorities',
    originalDueDate: '20th of succeeding month (Rule 61(1) of CGST Rules, 2017)',
    gracePeriod: 'No statutory grace period. If 20th falls on a Gazetted Bank Holiday, extended to the next banking working day. Late fee & 18% p.a. interest start on 21st.',
    governingRule: 'Section 39 of CGST Act, 2017 read with Rule 61(1)',
    lateFeePenalty: '₹50 per day late fee (Max ₹10,000 per return) + Interest @ 18% per annum under Section 50(1) on net cash liability.',
    impactOnCompliance: 'Mandatory return. Failure to file for 2 consecutive tax periods leads to automatic E-Way Bill generation blocking under Rule 138E.'
  }
};

export const ComplianceCalendar: React.FC<ComplianceCalendarProps> = ({
  financialYear = 'FY 2026-27',
  selectedMonth = 'September',
  onNavigate,
  onAddNotification,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'matrix'>('calendar');
  const [activeMonthFilter, setActiveMonthFilter] = useState<string>(selectedMonth);
  const [selectedFormFilter, setSelectedFormFilter] = useState<'ALL' | 'GSTR-1' | 'GSTR-2B' | 'GSTR-3B'>('ALL');
  const [alertSuccessId, setAlertSuccessId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [autoThreeDayAlertsEnabled, setAutoThreeDayAlertsEnabled] = useState<boolean>(true);
  const [dispatchedThreeDayCount, setDispatchedThreeDayCount] = useState<number>(0);

  // Set of dispatched alert tracking keys to prevent duplicate alert spamming
  const dispatchedThreeDayAlertsRef = useRef<Set<string>>(new Set());

  // Parse start year from financial year string e.g. "FY 2026-27" -> 2026
  const startYear = useMemo(() => {
    const match = financialYear.match(/\d{4}/);
    return match ? parseInt(match[0], 10) : 2026;
  }, [financialYear]);

  // Full 12-month Statutory Compliance Deadlines for the selected Financial Year (April - March)
  const [yearSchedule, setYearSchedule] = useState<MonthlyFilingSchedule[]>([
    {
      month: 'April',
      year: startYear,
      taxPeriod: `April ${startYear}`,
      gstr1DueDate: `11 May ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2304260184910',
      gstr2bDueDate: `14 May ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 May ${startYear}`,
      gstr3bStatus: 'Submitted',
      gstr3bLiability: 0,
      daysRemainingFor3B: -140,
    },
    {
      month: 'May',
      year: startYear,
      taxPeriod: `May ${startYear}`,
      gstr1DueDate: `11 June ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2305260199120',
      gstr2bDueDate: `14 June ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 June ${startYear}`,
      gstr3bStatus: 'Submitted',
      gstr3bLiability: 0,
      daysRemainingFor3B: -110,
    },
    {
      month: 'June',
      year: startYear,
      taxPeriod: `June ${startYear}`,
      gstr1DueDate: `11 July ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2306260210450',
      gstr2bDueDate: `14 July ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 July ${startYear}`,
      gstr3bStatus: 'Submitted',
      gstr3bLiability: 0,
      daysRemainingFor3B: -80,
    },
    {
      month: 'July',
      year: startYear,
      taxPeriod: `July ${startYear}`,
      gstr1DueDate: `11 August ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2307260228941',
      gstr2bDueDate: `14 August ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 August ${startYear}`,
      gstr3bStatus: 'Submitted',
      gstr3bLiability: 0,
      daysRemainingFor3B: -50,
    },
    {
      month: 'August',
      year: startYear,
      taxPeriod: `August ${startYear}`,
      gstr1DueDate: `11 September ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2308260241982',
      gstr2bDueDate: `14 September ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 September ${startYear}`,
      gstr3bStatus: 'Submitted',
      gstr3bLiability: 0,
      daysRemainingFor3B: -20,
    },
    {
      month: 'September',
      year: startYear,
      taxPeriod: `September ${startYear}`,
      gstr1DueDate: `11 October ${startYear}`,
      gstr1Status: 'Submitted',
      gstr1Arn: 'AA2309260194812',
      gstr2bDueDate: `14 October ${startYear}`,
      gstr2bStatus: 'Submitted',
      gstr3bDueDate: `20 October ${startYear}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3300000,
      daysRemainingFor3B: 3,
    },
    {
      month: 'October',
      year: startYear,
      taxPeriod: `October ${startYear}`,
      gstr1DueDate: `11 November ${startYear}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 November ${startYear}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 November ${startYear}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3150000,
      daysRemainingFor3B: 40,
    },
    {
      month: 'November',
      year: startYear,
      taxPeriod: `November ${startYear}`,
      gstr1DueDate: `11 December ${startYear}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 December ${startYear}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 December ${startYear}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3200000,
      daysRemainingFor3B: 70,
    },
    {
      month: 'December',
      year: startYear,
      taxPeriod: `December ${startYear}`,
      gstr1DueDate: `11 January ${startYear + 1}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 January ${startYear + 1}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 January ${startYear + 1}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3400000,
      daysRemainingFor3B: 101,
    },
    {
      month: 'January',
      year: startYear + 1,
      taxPeriod: `January ${startYear + 1}`,
      gstr1DueDate: `11 February ${startYear + 1}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 February ${startYear + 1}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 February ${startYear + 1}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3100000,
      daysRemainingFor3B: 132,
    },
    {
      month: 'February',
      year: startYear + 1,
      taxPeriod: `February ${startYear + 1}`,
      gstr1DueDate: `11 March ${startYear + 1}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 March ${startYear + 1}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 March ${startYear + 1}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3250000,
      daysRemainingFor3B: 160,
    },
    {
      month: 'March',
      year: startYear + 1,
      taxPeriod: `March ${startYear + 1}`,
      gstr1DueDate: `11 April ${startYear + 1}`,
      gstr1Status: 'Pending',
      gstr2bDueDate: `14 April ${startYear + 1}`,
      gstr2bStatus: 'Pending',
      gstr3bDueDate: `20 April ${startYear + 1}`,
      gstr3bStatus: 'Pending',
      gstr3bLiability: 3600000,
      daysRemainingFor3B: 191,
    },
  ]);

  // Current active period object
  const currentActiveSchedule = useMemo(() => {
    return yearSchedule.find(s => s.month.toLowerCase() === activeMonthFilter.toLowerCase()) || yearSchedule[5];
  }, [yearSchedule, activeMonthFilter]);

  // Transform active period into visual deadline cards
  const activeMonthDeadlines: ComplianceDeadline[] = useMemo(() => {
    return [
      {
        id: `g1-${currentActiveSchedule.month}`,
        formName: 'GSTR-1',
        title: `GSTR-1 Outward Supplies (${currentActiveSchedule.taxPeriod})`,
        dueDate: currentActiveSchedule.gstr1DueDate,
        dayNumber: 11,
        period: currentActiveSchedule.taxPeriod,
        description: 'Monthly statement of outward supplies for registered B2B and B2C sales.',
        status: currentActiveSchedule.gstr1Status,
        criticality: 'High',
        arn: currentActiveSchedule.gstr1Arn,
        filingDate: currentActiveSchedule.gstr1Status === 'Submitted' ? `${currentActiveSchedule.gstr1DueDate} (Recorded)` : undefined,
        liabilityAmount: 4309000,
        navigationTarget: 'gstr-1',
      },
      {
        id: `2b-${currentActiveSchedule.month}`,
        formName: 'GSTR-2B',
        title: `GSTR-2B Auto-Drafted ITC Snapshot (${currentActiveSchedule.taxPeriod})`,
        dueDate: currentActiveSchedule.gstr2bDueDate,
        dayNumber: 14,
        period: currentActiveSchedule.taxPeriod,
        description: 'Static government statement freezing input tax credit availed from counterparties.',
        status: currentActiveSchedule.gstr2bStatus,
        criticality: 'Informational',
        filingDate: currentActiveSchedule.gstr2bStatus === 'Submitted' ? `${currentActiveSchedule.gstr2bDueDate} (Generated)` : undefined,
        liabilityAmount: 3982000,
        navigationTarget: 'books-reco-2b',
      },
      {
        id: `3b-${currentActiveSchedule.month}`,
        formName: 'GSTR-3B',
        title: `GSTR-3B Summary Return & Tax Payment (${currentActiveSchedule.taxPeriod})`,
        dueDate: currentActiveSchedule.gstr3bDueDate,
        dayNumber: 20,
        period: currentActiveSchedule.taxPeriod,
        description: 'Statutory self-assessment summary return and electronic cash ledger tax settlement.',
        status: currentActiveSchedule.gstr3bStatus,
        criticality: 'High',
        liabilityAmount: currentActiveSchedule.gstr3bLiability,
        navigationTarget: 'payment-dashboard',
      },
    ];
  }, [currentActiveSchedule]);

  // Toggle single status for a form
  const handleToggleFormStatus = (form: 'GSTR-1' | 'GSTR-2B' | 'GSTR-3B') => {
    setYearSchedule(prev =>
      prev.map(item => {
        if (item.month.toLowerCase() === activeMonthFilter.toLowerCase()) {
          if (form === 'GSTR-1') {
            const nextStatus = item.gstr1Status === 'Pending' ? 'Submitted' : 'Pending';
            dispatchStatusNotif('GSTR-1', item.taxPeriod, nextStatus);
            return { ...item, gstr1Status: nextStatus, gstr1Arn: nextStatus === 'Submitted' ? `AA23${Date.now().toString().slice(-8)}` : undefined };
          }
          if (form === 'GSTR-2B') {
            const nextStatus = item.gstr2bStatus === 'Pending' ? 'Submitted' : 'Pending';
            dispatchStatusNotif('GSTR-2B', item.taxPeriod, nextStatus);
            return { ...item, gstr2bStatus: nextStatus };
          }
          if (form === 'GSTR-3B') {
            const nextStatus = item.gstr3bStatus === 'Pending' ? 'Submitted' : 'Pending';
            dispatchStatusNotif('GSTR-3B', item.taxPeriod, nextStatus);
            return { ...item, gstr3bStatus: nextStatus };
          }
        }
        return item;
      })
    );
  };

  const dispatchStatusNotif = (form: string, period: string, status: string) => {
    if (onAddNotification) {
      onAddNotification({
        id: `notif-stat-${Date.now()}`,
        title: `${form} Marked as ${status}`,
        message: `Statutory compliance status for ${period} ${form} has been updated to ${status}.`,
        timestamp: 'Just now',
        type: status === 'Submitted' ? 'success' : 'warning',
        read: false,
        actionUrl: form === 'GSTR-1' ? 'gstr-1' : form === 'GSTR-2B' ? 'books-reco-2b' : 'payment-dashboard',
      });
    }
  };

  // Trigger alert integration
  const handleTriggerAlert = (deadline: ComplianceDeadline) => {
    if (onAddNotification) {
      onAddNotification({
        id: `notif-alert-${Date.now()}`,
        title: `⚠ Statutory GST Deadline Approaching: ${deadline.formName}`,
        message: `Reminder: ${deadline.title} is due on ${deadline.dueDate}. Current Status: ${deadline.status.toUpperCase()}.`,
        timestamp: 'Just now',
        type: deadline.status === 'Pending' ? 'warning' : 'info',
        read: false,
        actionUrl: deadline.navigationTarget,
      });

      setAlertSuccessId(deadline.id);
      setToastMessage(`Deadline alert for ${deadline.formName} sent to Notification Center!`);
      setTimeout(() => {
        setAlertSuccessId(null);
        setToastMessage(null);
      }, 3000);
    }
  };

  // Scan & trigger all approaching deadlines in FY
  const handleTriggerApproachingDeadlines = () => {
    if (onAddNotification) {
      const approaching = yearSchedule.filter(s => s.daysRemainingFor3B >= 0 && s.daysRemainingFor3B <= 30 && s.gstr3bStatus === 'Pending');

      if (approaching.length === 0) {
        setToastMessage('All current period returns are submitted or up-to-date.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      approaching.forEach((item, idx) => {
        setTimeout(() => {
          onAddNotification({
            id: `notif-urgent-${Date.now()}-${idx}`,
            title: `🚨 Urgent: GSTR-3B Payment Due in ${item.daysRemainingFor3B} Days`,
            message: `Tax period ${item.taxPeriod} due on ${item.gstr3bDueDate}. Cash liability: ₹ ${formatINR(item.gstr3bLiability)}. Avail matched ITC to offset liability.`,
            timestamp: 'Just now',
            type: 'danger',
            read: false,
            actionUrl: 'payment-dashboard',
          });
        }, idx * 120);
      });

      setToastMessage(`Dispatched ${approaching.length} urgent deadline alert(s) to the Notification System.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const filteredCards = activeMonthDeadlines.filter(d => {
    if (selectedFormFilter === 'ALL') return true;
    return d.formName === selectedFormFilter;
  });

  // Automated 3-Day Pre-Deadline Monitoring Engine
  useEffect(() => {
    if (!autoThreeDayAlertsEnabled || !onAddNotification) return;

    // Scan tax periods for deadlines due within 3 days (<= 3 days remaining and >= 0)
    const approachingThreeDayPeriods = yearSchedule.filter(
      s => (s.gstr3bStatus === 'Pending' || s.gstr1Status === 'Pending') && s.daysRemainingFor3B <= 3 && s.daysRemainingFor3B >= 0
    );

    approachingThreeDayPeriods.forEach((period) => {
      // 3-day pre-deadline logic for GSTR-3B
      if (period.gstr3bStatus === 'Pending' && period.daysRemainingFor3B <= 3 && period.daysRemainingFor3B >= 0) {
        const alertKey = `auto-3day-gstr3b-${period.month}-${period.year}`;
        if (!dispatchedThreeDayAlertsRef.current.has(alertKey)) {
          dispatchedThreeDayAlertsRef.current.add(alertKey);
          setDispatchedThreeDayCount(prev => prev + 1);

          onAddNotification({
            id: `notif-3day-3b-${period.month}-${Date.now()}`,
            title: `🚨 3-Day Deadline Alert: GSTR-3B Due in 3 Days (${period.gstr3bDueDate})`,
            message: `Automated 3-Day Pre-Deadline Alert: GSTR-3B summary return and net tax settlement of ₹ ${formatINR(period.gstr3bLiability)} for ${period.taxPeriod} is due in 3 days on ${period.gstr3bDueDate}. Reconcile Book ITC and settle PMT-06 cash challan to prevent 18% p.a. interest under Section 50(1).`,
            timestamp: '3-Day Advance Reminder',
            type: 'danger',
            read: false,
            actionUrl: 'payment-dashboard',
          });
        }
      }

      // 3-day pre-deadline logic for GSTR-1
      if (period.gstr1Status === 'Pending' && period.daysRemainingFor3B <= 3 && period.daysRemainingFor3B >= 0) {
        const alertKey = `auto-3day-gstr1-${period.month}-${period.year}`;
        if (!dispatchedThreeDayAlertsRef.current.has(alertKey)) {
          dispatchedThreeDayAlertsRef.current.add(alertKey);
          setDispatchedThreeDayCount(prev => prev + 1);

          onAddNotification({
            id: `notif-3day-g1-${period.month}-${Date.now()}`,
            title: `⚠ 3-Day Deadline Alert: GSTR-1 Outward Due in 3 Days (${period.gstr1DueDate})`,
            message: `Automated 3-Day Pre-Deadline Alert: GSTR-1 for ${period.taxPeriod} is due in 3 days on ${period.gstr1DueDate}. File all B2B sales invoices to ensure counterparty buyers receive eligible ITC in GSTR-2B.`,
            timestamp: '3-Day Advance Reminder',
            type: 'warning',
            read: false,
            actionUrl: 'gstr-1',
          });
        }
      }
    });
  }, [autoThreeDayAlertsEnabled, onAddNotification, yearSchedule]);

  const handleTriggerManualThreeDayAlert = (form: 'GSTR-1' | 'GSTR-2B' | 'GSTR-3B', periodSchedule: MonthlyFilingSchedule) => {
    if (!onAddNotification) return;

    const dueDate = form === 'GSTR-1' ? periodSchedule.gstr1DueDate : form === 'GSTR-2B' ? periodSchedule.gstr2bDueDate : periodSchedule.gstr3bDueDate;
    const actionUrl = form === 'GSTR-1' ? 'gstr-1' : form === 'GSTR-2B' ? 'books-reco-2b' : 'payment-dashboard';
    const liabilityInfo = form === 'GSTR-3B' ? `Cash obligation: ₹ ${formatINR(periodSchedule.gstr3bLiability)}.` : form === 'GSTR-2B' ? 'Static ITC snapshot.' : 'Outward supplies.';

    onAddNotification({
      id: `notif-3day-manual-${form}-${Date.now()}`,
      title: `🚨 3-Day Advance Alert: ${form} Due in 3 Days (${dueDate})`,
      message: `Statutory 3-Day Deadline Notice: ${form} for ${periodSchedule.taxPeriod} is due in 3 days on ${dueDate}. ${liabilityInfo} Complete statutory steps immediately.`,
      timestamp: '3-Day Advance Reminder',
      type: form === 'GSTR-3B' ? 'danger' : 'warning',
      read: false,
      actionUrl,
    });

    setToastMessage(`3-Day advance alert for ${form} triggered and dispatched to Notification Drawer!`);
    setTimeout(() => setToastMessage(null), 3500);
  };
  return (
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
        <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)] gap-[24px] items-start">
          
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
