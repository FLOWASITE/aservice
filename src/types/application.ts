export interface AppInfo {
  code: string;
  name: string;
  fullName: string;
  icon: string;
  color: string;
  bgColor: string;
  url: string;
}

export interface ClientAppDetail {
  appCode: string;
  appName: string;
  status: "active" | "inactive";
  accountEmail: string;
  activationDate: string;
  expiryDate?: string;
  package: string;
  accessUrl: string;
  usageStats: {
    transactionsThisMonth: number;
    storageUsed: string;
    lastAccess: string;
  };
  activityHistory: {
    date: string;
    action: string;
    performedBy: string;
  }[];
}

export const APP_LIST: AppInfo[] = [
  {
    code: "aketoan",
    name: "AKeToan",
    fullName: "Phần mềm Kế toán doanh nghiệp",
    icon: "calculator",
    color: "#28a745",
    bgColor: "#e8f5e9",
    url: "https://app.aketoan.com",
  },
  {
    code: "amall",
    name: "AMall",
    fullName: "Phần mềm kế toán Hộ kinh doanh",
    icon: "store",
    color: "#007bff",
    bgColor: "#e3f2fd",
    url: "https://app.amall.com",
  },
  {
    code: "aread",
    name: "ARead",
    fullName: "Phần mềm hóa đơn điện tử",
    icon: "file-text",
    color: "#fd7e14",
    bgColor: "#fff3e0",
    url: "https://app.aread.com",
  },
];
