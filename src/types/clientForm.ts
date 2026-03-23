// Extended client types for creation form

export interface DigitalSignature {
  name: string;
  provider: string;
  expiryDate: string;
  status: "active" | "expired" | "revoked";
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  branch: string;
}

export interface CredentialInfo {
  taxCode?: string;
  unitCode?: string;
  provider?: string;
  username: string;
  password: string;
}

export interface ClientDescription {
  general: string;
  businessType: string;
  mainProducts: string;
  mainExpenses: string;
}

export interface ClientCreatePayload {
  // Section 1
  taxCode: string;
  name: string;
  businessType: "company" | "household";
  charterCapital?: number;
  businessField?: string;
  businessSectors: string[];
  establishmentDate?: string;
  address?: string;
  legalRepresentative?: string;

  // Section 2
  appliedCircular: string;
  declarationPeriod: "monthly" | "quarterly";
  groupId?: number;
  assignedStaffId?: number;

  // Section 3
  digitalSignatures: DigitalSignature[];
  bankAccounts: BankAccount[];
  eTax?: CredentialInfo;
  socialInsurance?: CredentialInfo;
  eInvoicePortal?: CredentialInfo;
  invoiceReceivingEmails: string[];
  invoiceSendingEmails: string[];

  // Section 4
  software: "aketoan" | "other";
  applicationId?: number;
  description: ClientDescription;
}

export interface DropdownOption {
  id: number;
  ten: string;
}

export interface TaxLookupResult {
  name: string;
  address: string;
  legalRepresentative: string;
  establishmentDate?: string;
}
