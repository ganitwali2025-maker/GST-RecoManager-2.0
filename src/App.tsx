import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarPage } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ImportCenterModal } from './components/common/ImportCenterModal';

// Views
import { ItcDashboard } from './components/views/ItcDashboard';
import { LiabilityDashboard } from './components/views/LiabilityDashboard';
import { PaymentDashboard } from './components/views/PaymentDashboard';
import { GstSummary } from './components/views/GstSummary';
import { FinalRecoReport } from './components/views/FinalRecoReport';
import { BooksRecoWith2B } from './components/views/BooksRecoWith2B';
import { OldItc } from './components/views/OldItc';
import { ItcNotClaimed } from './components/views/ItcNotClaimed';
import { Gstr2bAllMonths } from './components/views/Gstr2bAllMonths';
import { Gstr2bGov } from './components/views/Gstr2bGov';
import { RcmView } from './components/views/RcmView';
import { BooksItc } from './components/views/BooksItc';
import { Gstr1View } from './components/views/Gstr1View';
import { CompanyGstinView } from './components/views/CompanyGstinView';
import { SettingsView } from './components/views/SettingsView';

// Mock Initial Data
import {
  INITIAL_COMPANIES,
  INITIAL_RECONCILED_INVOICES,
  INITIAL_GSTR2B_ENTRIES,
  INITIAL_GSTR1_ENTRIES,
  INITIAL_RCM_ENTRIES,
  INITIAL_PAYMENT_ENTRIES,
  INITIAL_MONTHLY_SUMMARIES,
  INITIAL_NOTIFICATIONS,
} from './data/mockGstData';

import { Company, ReconciledInvoice, Gstr2BEntry, Gstr1Entry, RcmEntry, PaymentEntry, NotificationItem, ImportPreviewRow } from './types/gst';

export default function App() {
  const [currentPage, setCurrentPage] = useState<SidebarPage>('itc-dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Global Context State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState<Company>(INITIAL_COMPANIES[0]);
  const [selectedFy, setSelectedFy] = useState<string>('FY 2026-27');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');

  // Transactions State
  const [invoices, setInvoices] = useState<ReconciledInvoice[]>(INITIAL_RECONCILED_INVOICES);
  const [gstr2bEntries, setGstr2bEntries] = useState<Gstr2BEntry[]>(INITIAL_GSTR2B_ENTRIES);
  const [gstr1Entries, setGstr1Entries] = useState<Gstr1Entry[]>(INITIAL_GSTR1_ENTRIES);
  const [rcmEntries, setRcmEntries] = useState<RcmEntry[]>(INITIAL_RCM_ENTRIES);
  const [payments, setPayments] = useState<PaymentEntry[]>(INITIAL_PAYMENT_ENTRIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Ctrl+K Global Search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateInvoice = (updated: ReconciledInvoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleImportSuccess = (importedRows: ImportPreviewRow[]) => {
    const newInvoices: ReconciledInvoice[] = importedRows.map((row) => ({
      id: `imported-${Date.now()}-${row.rowNumber}`,
      invoiceDate: row.invoiceDate,
      supplierName: row.supplierName,
      supplierGstin: row.gstin,
      invoiceNo: row.invoiceNo,
      taxableValue: row.taxableValue,
      igst: row.igst,
      cgst: row.cgst,
      sgst: row.sgst,
      cess: 0,
      totalTax: row.igst + row.cgst + row.sgst,
      bookItc: row.igst + row.cgst + row.sgst,
      twoBItc: row.igst + row.cgst + row.sgst, // Matched
      difference: 0,
      matchStatus: 'MATCHED',
      financialYear: selectedFy,
      month: selectedMonth,
      eligibleItc: true,
      reverseCharge: false,
      remarks: 'Imported via Data Import Center to PostgreSQL',
    }));

    setInvoices((prev) => [...newInvoices, ...prev]);

    // Add alert notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Data Ingestion Succeeded',
      message: `Successfully imported ${newInvoices.length} purchase invoices into PostgreSQL database.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
      actionUrl: 'books-itc',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Determine current page title and breadcrumb
  const pageMetadata: Record<SidebarPage, { title: string; breadcrumb: string[] }> = {
    'itc-dashboard': { title: 'ITC Dashboard', breadcrumb: ['Main Menu', 'ITC Dashboard'] },
    'liability-dashboard': { title: 'Liability Dashboard', breadcrumb: ['Main Menu', 'Liability Dashboard'] },
    'payment-dashboard': { title: 'Payment Dashboard', breadcrumb: ['Main Menu', 'Payment Dashboard'] },
    'gst-summary': { title: 'GST Summary', breadcrumb: ['Main Menu', 'GST Summary'] },
    'final-reco-report': { title: 'Final Reconciliation Report', breadcrumb: ['GST Reco Step', 'Final Reco Report'] },
    'books-reco-2b': { title: 'Books Reco with GSTR-2B', breadcrumb: ['Books Reco', 'Books Reco with 2B'] },
    'old-itc': { title: 'Old ITC Register', breadcrumb: ['Books Reco', 'Old ITC'] },
    'itc-not-claimed': { title: 'ITC Not Claimed Register', breadcrumb: ['Books Reco', 'ITC Not Claimed'] },
    '2b-all-months': { title: 'GSTR-2B All Months', breadcrumb: ['GSTR-2B', '2B All Months'] },
    '2b-gov': { title: 'GSTR-2B GOV Sync', breadcrumb: ['GSTR-2B', '2B GOV'] },
    'rcm': { title: 'Reverse Charge Mechanism (RCM)', breadcrumb: ['GST & Tax', 'RCM'] },
    'books-itc': { title: 'Books ITC Register', breadcrumb: ['GST & Tax', 'Books ITC'] },
    'gstr-1': { title: 'GST R-1 Register', breadcrumb: ['GST & Tax', 'GST R-1'] },
    'company-gstin': { title: 'Company / GSTIN Master', breadcrumb: ['Settings', 'Company Master'] },
    'settings': { title: 'Application Settings', breadcrumb: ['Settings', 'System Config'] },
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-slate-800 flex font-sans antialiased selection:bg-purple-600 selection:text-white">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
        }`}
      >
        {/* Top Header */}
        <Header
          pageTitle={pageMetadata[currentPage]?.title || 'GST RecoManager'}
          breadcrumb={pageMetadata[currentPage]?.breadcrumb || ['Dashboard']}
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
          selectedFy={selectedFy}
          onSelectFy={setSelectedFy}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          unreadNotificationsCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenImport={() => setIsImportOpen(true)}
        />

        {/* View Content Container */}
        <main className="flex-1 p-[24px] max-w-[1700px] w-full mx-auto space-y-6">
          {currentPage === 'itc-dashboard' && (
            <ItcDashboard
              invoices={invoices}
              financialYear={selectedFy}
              selectedMonth={selectedMonth}
              onNavigate={(page) => setCurrentPage(page as SidebarPage)}
              onOpenImport={() => setIsImportOpen(true)}
              onAddNotification={(newNotif) => setNotifications((prev) => [newNotif, ...prev])}
            />
          )}

          {currentPage === 'liability-dashboard' && (
            <LiabilityDashboard onNavigate={(page) => setCurrentPage(page as SidebarPage)} />
          )}

          {currentPage === 'payment-dashboard' && (
            <PaymentDashboard
              payments={payments}
              onAddPayment={(newP) => setPayments((prev) => [newP, ...prev])}
            />
          )}

          {currentPage === 'gst-summary' && (
            <GstSummary monthlySummaries={INITIAL_MONTHLY_SUMMARIES} />
          )}

          {currentPage === 'final-reco-report' && (
            <FinalRecoReport
              invoices={invoices}
              onUpdateInvoice={handleUpdateInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          )}

          {currentPage === 'books-reco-2b' && (
            <BooksRecoWith2B
              invoices={invoices}
              onOpenImport={() => setIsImportOpen(true)}
              onNavigate={(page) => setCurrentPage(page as SidebarPage)}
            />
          )}

          {currentPage === 'old-itc' && (
            <OldItc invoices={invoices} />
          )}

          {currentPage === 'itc-not-claimed' && (
            <ItcNotClaimed invoices={invoices} />
          )}

          {currentPage === '2b-all-months' && (
            <Gstr2bAllMonths
              entries={gstr2bEntries}
              selectedMonth={selectedMonth}
              onSelectMonth={setSelectedMonth}
            />
          )}

          {currentPage === '2b-gov' && (
            <Gstr2bGov
              onOpenImport={() => setIsImportOpen(true)}
              onNavigate={(page) => setCurrentPage(page as SidebarPage)}
            />
          )}

          {currentPage === 'rcm' && (
            <RcmView
              rcmEntries={rcmEntries}
              onAddRcm={(newRcm) => setRcmEntries((prev) => [newRcm, ...prev])}
            />
          )}

          {currentPage === 'books-itc' && (
            <BooksItc
              invoices={invoices}
              onOpenImport={() => setIsImportOpen(true)}
            />
          )}

          {currentPage === 'gstr-1' && (
            <Gstr1View
              entries={gstr1Entries}
              onAddGstr1Entry={(newG1) => setGstr1Entries((prev) => [newG1, ...prev])}
            />
          )}

          {currentPage === 'company-gstin' && (
            <CompanyGstinView
              companies={companies}
              selectedCompany={selectedCompany}
              onSelectCompany={setSelectedCompany}
              onAddCompany={(newComp) => setCompanies((prev) => [...prev, newComp])}
            />
          )}

          {currentPage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Search Dialog (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(page) => setCurrentPage(page as SidebarPage)}
        invoices={invoices}
        gstr1={gstr1Entries}
        rcm={rcmEntries}
        twoB={gstr2bEntries}
      />

      {/* Interactive Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNavigate={(page) => setCurrentPage(page as SidebarPage)}
      />

      {/* Full-featured Data Import Center */}
      <ImportCenterModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
