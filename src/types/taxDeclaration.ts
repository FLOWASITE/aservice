export type TaxDeclarationStatus =
  | "not_synced"
  | "submitted"
  | "overdue"
  | "processing"
  | "completed"
  | "not_required";

export interface TaxPeriodCell {
  deadline: string | null;
  status: TaxDeclarationStatus;
  statusLabel: string;
  submittedDate: string | null;
  notes: string;
}

export interface TaxDeclarationRow {
  id: string;
  clientId: string;
  clientName: string;
  clientInitial: string;
  clientColor: string;
  assignedStaff: string;
  [key: string]: string | TaxPeriodCell;
}

export interface TaxDeclarationResponse {
  total: number;
  page: number;
  limit: number;
  taxType: string;
  year: number;
  items: TaxDeclarationRow[];
}

export interface TaxType {
  id: string;
  name: string;
}

export type TaxView = "quarterly" | "monthly";
