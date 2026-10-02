export type MatchStatus = 
  | 'MATCHED'
  | 'AMOUNT MISMATCH'
  | 'GST MISMATCH'
  | 'NOT IN 2B'
  | 'DUPLICATE'
  | 'NOT CLAIMED'
  | 'REVERSED';

export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';

export type UserRole = 'Admin' | 'CFO' | 'Finance Manager' | 'Accountant' | 'Viewer';

export interface Company {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  cin: string;
  address: string;
  state: string;
  stateCode: string;
  financialYear: string;
  registrationType: 'Regular' | 'Composition' | 'SEZ Unit' | 'SEZ Developer';
  contactPerson: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Inactive';
}

export interface ReconciledInvoice {
  id: string;
  invoiceDate: string;
  supplierName: string;
  supplierGstin: string;
  invoiceNo: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  totalTax: number;
  bookItc: number;
  twoBItc: number;
  difference: number;
  matchStatus: MatchStatus;
  remarks?: string;
  financialYear: string;
  month: string;
  eligibleItc: boolean;
  reverseCharge: boolean;
  itcClaimedMonth?: string;
  auditTrail?: AuditLog[];
}

export interface Gstr2BEntry {
  id: string;
  gstin: string;
  supplierName: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceType: 'B2B' | 'B2BA' | 'CDNR' | 'CDNRA' | 'ISD';
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  totalTax: number;
  itcEligibility: 'Yes' | 'No';
  reasonIneligible?: string;
  source: 'GSTR-1' | 'IFF' | 'GSTR-5' | 'GSTR-6';
  filingDate: string;
  month: string;
  financialYear: string;
}

export interface Gstr1Entry {
  id: string;
  invoiceDate: string;
  customerName: string;
  customerGstin: string;
  invoiceNo: string;
  invoiceType: 'B2B' | 'B2CL' | 'B2CS' | 'CDNR' | 'CDNUR' | 'EXPWP' | 'EXPWOP' | 'NIL' | 'EXEMPT';
  placeOfSupply: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  totalInvoiceValue: number;
  irn?: string;
  eWayBill?: string;
  status: 'Draft' | 'Uploaded' | 'Filed' | 'Failed';
  hsnCode?: string;
  rate: number;
  month: string;
  financialYear: string;
}

export interface RcmEntry {
  id: string;
  date: string;
  vendorName: string;
  vendorGstin: string;
  invoiceNo: string;
  natureOfSupply: 'GTA Services' | 'Legal Services by Advocate' | 'Security Personnel Services' | 'Director Remuneration' | 'Import of Services' | 'Renting of Motor Vehicle';
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalRcm: number;
  paymentStatus: PaymentStatus;
  itcEligible: boolean;
  month: string;
  financialYear: string;
}

export interface PaymentEntry {
  id: string;
  paymentDate: string;
  challanNo: string;
  cpin: string;
  taxPeriod: string;
  igst: number;
  cgst: number;
  sgst: number;
  cess: number;
  total: number;
  status: PaymentStatus;
  bankName: string;
  brn: string;
  mode: 'NEFT/RTGS' | 'Internet Banking' | 'Over the Counter';
}

export interface MonthlySummary {
  month: string;
  sales: number;
  taxableSales: number;
  igstSales: number;
  cgstSales: number;
  sgstSales: number;
  purchases: number;
  itcAvailable: number;
  itcClaimed: number;
  rcmLiability: number;
  netLiability: number;
  paidAmount: number;
}

export interface AuditLog {
  id: string;
  entityId: string;
  entityType: 'Invoice' | 'Payment' | 'RCM' | 'GSTR-1' | 'Company' | 'Reconciliation';
  action: 'Created' | 'Modified' | 'Reconciled' | 'Claimed' | 'Deleted' | 'Exported';
  createdBy: string;
  createdDate: string;
  previousValue?: string;
  updatedValue?: string;
  ipAddress: string;
  device: string;
  remarks: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'success' | 'danger' | 'info';
  read: boolean;
  actionUrl?: string;
}

export interface ImportPreviewRow {
  id: string;
  rowNumber: number;
  supplierName: string;
  gstin: string;
  invoiceNo: string;
  invoiceDate: string;
  taxableValue: number;
  igst: number;
  cgst: number;
  sgst: number;
  status: 'valid' | 'invalid' | 'duplicate';
  errors: string[];
}

export interface ComplianceDeadline {
  id: string;
  formName: 'GSTR-1' | 'GSTR-2B' | 'GSTR-3B' | 'IFF' | 'GSTR-9' | 'PMT-06';
  title: string;
  dueDate: string;
  dayNumber: number;
  period: string;
  description: string;
  status: 'Pending' | 'Submitted';
  criticality: 'High' | 'Medium' | 'Informational';
  arn?: string;
  filingDate?: string;
  liabilityAmount?: number;
  navigationTarget: string;
}
