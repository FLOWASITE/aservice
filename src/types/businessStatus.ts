export interface PeriodValues {
  month: number;
  quarter: number;
  ytd: number;
}

export interface StatusTableRow {
  label: string;
  values: PeriodValues;
}

export interface StatusTableData {
  title: string;
  icon: string;
  rows: StatusTableRow[];
}

export interface VatSummary {
  inputVat: number;
  outputVat: number;
  payableVat: number;
}

export interface RevenueChartItem {
  quarter: string;
  revenue: number;
  expense: number;
}

export interface CredentialItem {
  id: number;
  type: string;
  account: string;
  password: string;
  url?: string;
}

export interface AnnualTaxItem {
  type: string;
  status: "submitted" | "not_submitted";
}

export interface ClientServiceInfo {
  assignedStaff: string;
  serviceFee: number;
  feePeriod: string;
  currentDebt: number;
  establishmentDate: string;
  charterCapital: number;
  appliedCircular: string;
  email: string;
}

export interface TaxDeclarationInfo {
  hasMonthly: boolean;
  hasQuarterly: boolean;
  description: string;
}

export interface BusinessStatusData {
  year: number;
  purchasing: Record<string, PeriodValues>;
  sales: Record<string, PeriodValues>;
  vat: Record<string, PeriodValues>;
  payroll: Record<string, PeriodValues>;
  fixedAssets: Record<string, PeriodValues>;
  allocatedAssets: Record<string, PeriodValues>;
  generalAccounting: Record<string, PeriodValues>;
  bankDeposits: Record<string, PeriodValues>;
}

export interface ClientDropdownItem {
  id: number;
  ten: string;
  ma_so_thue: string;
  avatar_color: string;
  ten_viet_tat: string;
}
