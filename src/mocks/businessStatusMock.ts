import type {
  VatSummary, RevenueChartItem, CredentialItem, AnnualTaxItem,
  ClientServiceInfo, TaxDeclarationInfo, BusinessStatusData, ClientDropdownItem,
} from "@/types/businessStatus";

export const mockClientDropdown: ClientDropdownItem[] = [
  { id: 1, ten: "CÔNG TY CỔ PHẦN HTV.BT VIỆT NAM", ma_so_thue: "0316336599", avatar_color: "hsl(215 70% 42%)", ten_viet_tat: "H" },
  { id: 2, ten: "CÔNG TY TNHH NBC 1 VIETNAM", ma_so_thue: "0312456789", avatar_color: "hsl(152 60% 42%)", ten_viet_tat: "N" },
  { id: 3, ten: "CÔNG TY TNHH MONOPOWER HOLDINGS", ma_so_thue: "0309876543", avatar_color: "hsl(0 72% 51%)", ten_viet_tat: "M" },
  { id: 4, ten: "CÔNG TY ĐẦU TƯ VÀ XÂY DỰNG COSEVCO", ma_so_thue: "0301234567", avatar_color: "hsl(280 60% 50%)", ten_viet_tat: "C" },
  { id: 5, ten: "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH", ma_so_thue: "0315678901", avatar_color: "hsl(38 92% 50%)", ten_viet_tat: "Đ" },
];

export function getMockRevenueChart(): RevenueChartItem[] {
  return [
    { quarter: "Quý 1", revenue: 245000000, expense: 180000000 },
    { quarter: "Quý 2", revenue: 312000000, expense: 198000000 },
    { quarter: "Quý 3", revenue: 289000000, expense: 210000000 },
    { quarter: "Quý 4", revenue: 356000000, expense: 225000000 },
  ];
}

export function getMockVatSummary(): VatSummary {
  return { inputVat: 12500000, outputVat: 18700000, payableVat: 6200000 };
}

export function getMockCredentials(): CredentialItem[] {
  return [
    { id: 1, type: "Hóa đơn điện tử", account: "admin_htv", password: "P@ss1234", url: "https://hoadondientu.gdt.gov.vn/" },
    { id: 2, type: "Thuế điện tử", account: "0316336599", password: "Tax@2026", url: "https://thuedientu.gdt.gov.vn/" },
    { id: 3, type: "Bảo hiểm xã hội", account: "BHXH_HTV", password: "Bhxh@123" },
    { id: 4, type: "Cổng HĐĐT của GĐT", account: "admin_gdt", password: "Gdt@2026", url: "https://hoadondientu.gdt.gov.vn/" },
    { id: 5, type: "Email nhận hóa đơn", account: "invoice@htv.vn", password: "Email@123" },
    { id: 6, type: "Email gửi hóa đơn", account: "send@htv.vn", password: "Send@123" },
    { id: 7, type: "Chữ ký số", account: "CKS_HTV_2026", password: "Cks@2026" },
  ];
}

export function getMockServiceInfo(): ClientServiceInfo {
  return {
    assignedStaff: "Phạm Thị Thu Thảo",
    serviceFee: 3200000,
    feePeriod: "Hàng tháng",
    currentDebt: 0,
    establishmentDate: "29/06/2020",
    charterCapital: 5000000000,
    appliedCircular: "Thông tư 200",
    email: "contact@htv.vn",
  };
}

export function getMockTaxDeclaration(): TaxDeclarationInfo {
  return {
    hasMonthly: false,
    hasQuarterly: true,
    description: "Công ty không có kỳ khai thuế theo tháng, kê khai thuế theo quý",
  };
}

export function getMockAnnualTax(): AnnualTaxItem[] {
  return [
    { type: "Thuế môn bài", status: "submitted" },
    { type: "Báo cáo tài chính", status: "not_submitted" },
    { type: "Quyết toán thuế TNDN", status: "not_submitted" },
    { type: "Quyết toán thuế TNCN", status: "submitted" },
  ];
}

const pv = (m = 0, q = 0, y = 0) => ({ month: m, quarter: q, ytd: y });

export function getMockBusinessStatus(): BusinessStatusData {
  return {
    year: 2026,
    purchasing: {
      "Số lượng hóa đơn mua vào": pv(12, 35, 142),
      "Số lượng giao dịch": pv(18, 52, 210),
      "Tổng giá trị mua hàng": pv(45000000, 132000000, 528000000),
      "Tổng trị giá cung cấp": pv(42000000, 125000000, 498000000),
      "Số dư phải trả cuối kỳ": pv(15000000, 15000000, 15000000),
      "Số lượng nhà cung cấp giao dịch": pv(8, 15, 32),
    },
    sales: {
      "Số lượng hóa đơn bán ra": pv(25, 72, 298),
      "Số lượng giao dịch": pv(30, 85, 340),
      "Tổng giá trị bán": pv(89000000, 256000000, 1024000000),
      "Tổng bán thu": pv(85000000, 248000000, 990000000),
      "Số dư phải thu cuối kỳ": pv(22000000, 22000000, 22000000),
      "Số lượng khách hàng giao dịch": pv(15, 28, 65),
    },
    vat: {
      "Thuế đầu vào": pv(4500000, 13200000, 52800000),
      "Thuế đầu ra": pv(8900000, 25600000, 102400000),
      "Thuế được khấu trừ": pv(4500000, 13200000, 52800000),
      "Thuế phải nộp": pv(4400000, 12400000, 49600000),
      "Tình trạng nợ thuế": pv(0, 0, 0),
    },
    payroll: {
      "Số lượng nhân sự": pv(25, 25, 25),
      "Chi phí lương": pv(125000000, 375000000, 1500000000),
      "Chi phí BHXH thuộc DN": pv(26250000, 78750000, 315000000),
      "Nhân sự mới": pv(2, 5, 12),
      "Nhân sự nghỉ việc": pv(0, 1, 3),
      "BHXH đã nộp": pv(26250000, 78750000, 315000000),
    },
    fixedAssets: {
      "Số lượng giao dịch": pv(3, 8, 24),
      "Tổng nguyên giá": pv(150000000, 450000000, 1800000000),
      "Tổng khấu hao": pv(12500000, 37500000, 150000000),
      "Tổng giá trị còn lại": pv(137500000, 412500000, 1650000000),
    },
    allocatedAssets: {
      "Số lượng giao dịch": pv(2, 5, 18),
      "Tổng nguyên giá": pv(45000000, 135000000, 540000000),
      "Tổng khấu hao": pv(7500000, 22500000, 90000000),
      "Tổng giá trị còn lại": pv(37500000, 112500000, 450000000),
    },
    generalAccounting: {
      "Số lượng giao dịch": pv(48, 138, 550),
      "Doanh thu": pv(89000000, 256000000, 1024000000),
      "Giá vốn": pv(45000000, 132000000, 528000000),
      "Chi phí bán hàng và QLDN": pv(18000000, 52000000, 208000000),
      "Lợi nhuận trước thuế": pv(26000000, 72000000, 288000000),
      "Thuế TNDN": pv(5200000, 14400000, 57600000),
    },
    bankDeposits: {
      "Số lượng giao dịch": pv(35, 98, 392),
      "Tổng thu": pv(85000000, 248000000, 990000000),
      "Tổng chi": pv(72000000, 210000000, 840000000),
      "Số dư": pv(156000000, 156000000, 156000000),
    },
  };
}
