export type ContractStatus = "active" | "suspended" | "stopped";
export type FeeType = "monthly" | "yearly";
export type SoftwareType = "aketoan" | "khac";
export type SalaryConfig = "co_dinh" | "theo_gia_tri_hop_dong";

export interface StaffInfo {
  id: string;
  name: string;
  initial: string;
  color: string;
}

export interface Contract {
  id: string;
  clientId: string;
  clientName: string;
  clientInitial: string;
  clientInitialColor: string;
  contractNumber: string;
  startDate: string;
  endDate: string | null;
  contractValue: number;
  feeType: FeeType;
  feeTypeLabel: string;
  status: ContractStatus;
  staffId: string;
  staffName: string;
  staffInitial: string;
  staffInitialColor: string;
  supportStaff: StaffInfo[];
  serviceId: string;
  serviceName: string;
  software: SoftwareType;
  applications: string[];
  salaryType: SalaryConfig;
  salaryAmount: number;
  notes: string;
  createdAt: string;
}

export interface ContractCreatePayload {
  clientId: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  contractValue: number;
  feeType: FeeType;
  status: ContractStatus;
  staffId: string;
  supportStaffIds: string[];
  serviceId: string;
  software: SoftwareType;
  applications: string[];
  salaryType: SalaryConfig;
  salaryAmount: number;
  notes: string;
  fileHopDong: File | null;
}

export interface DropdownOption {
  id: number;
  ten: string;
}
