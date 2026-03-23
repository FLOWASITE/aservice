import type { Contract, DropdownOption } from "@/types/contract";

export const mockClients: DropdownOption[] = [
  { id: 1, ten: "CÔNG TY TNHH MỘT THÀNH VIÊN LÂM HÀ PHÚ QUỐC" },
  { id: 2, ten: "CÔNG TY TNHH NBC 1 VIETNAM" },
  { id: 3, ten: "CÔNG TY TNHH MONOPOWER HOLDINGS" },
  { id: 4, ten: "CÔNG TY ĐẦU TƯ VÀ XÂY DỰNG COSEVCO PHƯƠNG NAM" },
  { id: 5, ten: "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH" },
  { id: 6, ten: "CÔNG TY TNHH FVTOURIST" },
  { id: 7, ten: "Công Ty Tnhh Harmony Necklaces" },
  { id: 8, ten: "CÔNG TY TNHH KIM'S HOLDINGS" },
];

export const mockServices: DropdownOption[] = [
  { id: 1, ten: "Dịch vụ kế toán thuế" },
  { id: 2, ten: "Dịch vụ kế toán" },
  { id: 3, ten: "DV QTT giải thể" },
  { id: 4, ten: "Dịch vụ quyết toán thuế" },
  { id: 5, ten: "Tạm dừng hoạt động" },
  { id: 6, ten: "Dịch vụ kế toán tổng hợp" },
];

export const mockEmployees: DropdownOption[] = [
  { id: 1, ten: "Phạm Thị Thu Thảo" },
  { id: 2, ten: "Trần Thị Thanh Hằng" },
  { id: 3, ten: "Nguyễn Thị Diệu Hương" },
  { id: 4, ten: "Phạm Thị Mỹ Duyên" },
  { id: 5, ten: "Lê Ngọc Thùy" },
  { id: 6, ten: "Nguyễn Thị Thanh Bình" },
  { id: 7, ten: "Nguyễn Thành An" },
];

export const mockApplications: DropdownOption[] = [
  { id: 1, ten: "Aketoan Basic" },
  { id: 2, ten: "Aketoan Pro" },
  { id: 3, ten: "Aketoan Enterprise" },
];

const staffColors = ["#E91E63", "#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#00BCD4"];
function getInitial(name: string): string {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1]?.[0]?.toUpperCase() || "?";
}
function getColor(idx: number) { return staffColors[idx % staffColors.length]; }

// Employee ID mapping: emp_001=5(Thảo), emp_002=6(Hằng), emp_003=9(Hương), emp_004=4(Duyên), emp_005=1(Thuỷ), emp_006=3(Oanh), emp_007=2(An), emp_008=7(Phúc), emp_009=8(Nhi)
// clientId maps: cli_001..cli_020

export const clientTaxCodes: Record<string, string> = {
  cli_001: "0317505793", cli_002: "0316365906", cli_003: "0311961221",
  cli_004: "0318056822", cli_005: "4101580900", cli_006: "0316079493",
  cli_007: "0317892165", cli_008: "0314160068", cli_009: "0317881445",
  cli_010: "0315234567", cli_011: "0319876543", cli_012: "0312345678",
  cli_013: "0310987654", cli_014: "0313456789", cli_015: "0316543210",
  cli_016: "0318765432", cli_017: "0311234567", cli_018: "0319012345",
  cli_019: "0314567890", cli_020: "0317654321",
};

export const clientGroups: Record<string, string> = {
  cli_001: "KẾ TOÁN TAF", cli_002: "KẾ TOÁN TAF", cli_003: "KẾ TOÁN TAF",
  cli_004: "KẾ TOÁN KHÁC", cli_005: "KẾ TOÁN TAF", cli_006: "KẾ TOÁN TAF",
  cli_007: "NỘI BỘ", cli_008: "KẾ TOÁN TAF", cli_009: "KẾ TOÁN KHÁC",
  cli_010: "KIỂM TOÁN TAF", cli_011: "KẾ TOÁN TAF", cli_012: "NỘI BỘ",
  cli_013: "KẾ TOÁN TAF", cli_014: "TƯ VẤN", cli_015: "KẾ TOÁN TAF",
  cli_016: "KẾ TOÁN KHÁC", cli_017: "KẾ TOÁN TAF", cli_018: "NỘI BỘ",
  cli_019: "KẾ TOÁN TAF", cli_020: "TƯ VẤN",
};

export const mockContracts: Contract[] = [
  {
    id: "con_001", clientId: "cli_001",
    clientName: "CÔNG TY TNHH MỘT THÀNH VIÊN LÂM HÀ PHÚ QUỐC",
    clientInitial: "L", clientInitialColor: "#4CAF50",
    contractNumber: "004/HDKT/2025/TAF", startDate: "2023-01-01", endDate: "2028-03-31",
    contractValue: 500000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_004", name: "Phạm Thị Mỹ Duyên", initial: "D", color: "#2196F3" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 2000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_002", clientId: "cli_002",
    clientName: "CÔNG TY TNHH NBC 1 VIETNAM",
    clientInitial: "N", clientInitialColor: "#FF5722",
    contractNumber: "", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 3300000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_006", name: "Nguyễn Thị Kim Oanh", initial: "O", color: "#FF9800" }],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "khac",
    applications: [], salaryType: "theo_gia_tri_hop_dong", salaryAmount: 0, notes: "", createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "con_003", clientId: "cli_003",
    clientName: "CÔNG TY TNHH FVTOURIST",
    clientInitial: "F", clientInitialColor: "#9C27B0",
    contractNumber: "HD-2025-003", startDate: "2025-01-15", endDate: "2027-01-14",
    contractValue: 1000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_004", name: "Phạm Thị Mỹ Duyên", initial: "D", color: "#2196F3" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 2500000, notes: "", createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "con_004", clientId: "cli_004",
    clientName: "CÔNG TY TNHH CONNECTX TECHNOLOGY",
    clientInitial: "C", clientInitialColor: "#2196F3",
    contractNumber: "HD-2025-004", startDate: "2025-03-01", endDate: "2025-06-30",
    contractValue: 500000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [],
    serviceId: "svc_03", serviceName: "DV QTT giải thể", software: "khac",
    applications: [], salaryType: "co_dinh", salaryAmount: 5000000, notes: "", createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "con_005", clientId: "cli_005",
    clientName: "CÔNG TY TNHH XÂY DỰNG VÀ DỊCH VỤ NGỌC XUÂN",
    clientInitial: "X", clientInitialColor: "#00BCD4",
    contractNumber: "HD-2025-005", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 1000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_002", name: "Trần Thị Thanh Hằng", initial: "H", color: "#FF5722" }],
    serviceId: "svc_04", serviceName: "Dịch vụ quyết toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "theo_gia_tri_hop_dong", salaryAmount: 0, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_006", clientId: "cli_006",
    clientName: "CÔNG TY TNHH JOY LIFE",
    clientInitial: "J", clientInitialColor: "#FF9800",
    contractNumber: "HD-2025-006", startDate: "2024-06-01", endDate: null,
    contractValue: 3000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_003", name: "Nguyễn Thị Diệu Hương", initial: "H", color: "#4CAF50" }],
    serviceId: "svc_05", serviceName: "Tạm dừng hoạt động", software: "khac",
    applications: [], salaryType: "co_dinh", salaryAmount: 0, notes: "", createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "con_007", clientId: "cli_007",
    clientName: "CÔNG TY TNHH XUẤT NHẬP KHẨU UYÊN THƯ",
    clientInitial: "U", clientInitialColor: "#E91E63",
    contractNumber: "HD-2025-007", startDate: "2025-02-01", endDate: "2025-12-31",
    contractValue: 700000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [],
    serviceId: "svc_06", serviceName: "Dịch vụ kế toán tổng hợp", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 1500000, notes: "", createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "con_008", clientId: "cli_008",
    clientName: "TRƯỜNG MẦM NON HỌC VIỆN SÀI GÒN",
    clientInitial: "T", clientInitialColor: "#4CAF50",
    contractNumber: "HD-2025-008", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 6000000, feeType: "yearly", feeTypeLabel: "Năm", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_006", name: "Nguyễn Thị Kim Oanh", initial: "O", color: "#FF9800" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 3000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_009", clientId: "cli_009",
    clientName: "CÔNG TY TNHH LUCKY VN STAR",
    clientInitial: "L", clientInitialColor: "#9C27B0",
    contractNumber: "HD-2025-009", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 1000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 1000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_010", clientId: "cli_010",
    clientName: "CÔNG TY TNHH TM DV HOÀNG PHÚC GIA",
    clientInitial: "H", clientInitialColor: "#FF5722",
    contractNumber: "HD-2025-010", startDate: "2025-02-01", endDate: "2025-12-31",
    contractValue: 2000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_007", name: "Nguyễn Thành An", initial: "A", color: "#2196F3" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 1500000, notes: "", createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "con_011", clientId: "cli_011",
    clientName: "CÔNG TY TNHH SẢN XUẤT BAO BÌ TÂN PHÁT",
    clientInitial: "T", clientInitialColor: "#00BCD4",
    contractNumber: "HD-2025-011", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 1500000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "khac",
    applications: [], salaryType: "co_dinh", salaryAmount: 1000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_012", clientId: "cli_012",
    clientName: "CÔNG TY TNHH THƯƠNG MẠI MINH ĐẠT",
    clientInitial: "M", clientInitialColor: "#FF9800",
    contractNumber: "HD-2025-012", startDate: "2025-03-01", endDate: "2025-12-31",
    contractValue: 800000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_005", staffName: "Phạm Thị Thu Thảo", staffInitial: "T", staffInitialColor: "#E91E63",
    supportStaff: [{ id: "emp_009", name: "Nguyễn Thị Diệu Hương", initial: "H", color: "#4CAF50" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 800000, notes: "", createdAt: "2025-03-01T00:00:00Z",
  },
  // emp_007 = Nguyễn Thành An (employee id=2)
  {
    id: "con_013", clientId: "cli_013",
    clientName: "CÔNG TY TNHH ĐẦU TƯ & THƯƠNG MẠI HƯNG VẠN PHÁT",
    clientInitial: "H", clientInitialColor: "#4CAF50",
    contractNumber: "HD-2025-013", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 2500000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_007", staffName: "Nguyễn Thành An", staffInitial: "A", staffInitialColor: "#FF5722",
    supportStaff: [{ id: "emp_005", name: "Phạm Thị Thu Thảo", initial: "T", color: "#E91E63" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 2000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "con_014", clientId: "cli_014",
    clientName: "CÔNG TY CỔ PHẦN CÔNG NGHỆ & XÂY DỰNG QUANG MINH",
    clientInitial: "Q", clientInitialColor: "#2196F3",
    contractNumber: "HD-2025-014", startDate: "2025-02-01", endDate: "2026-01-31",
    contractValue: 4000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_007", staffName: "Nguyễn Thành An", staffInitial: "A", staffInitialColor: "#FF5722",
    supportStaff: [],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 2500000, notes: "", createdAt: "2025-02-01T00:00:00Z",
  },
  // emp_006 = Nguyễn Thị Kim Oanh (employee id=3)
  {
    id: "con_015", clientId: "cli_015",
    clientName: "CÔNG TY TNHH XÂY DỰNG CƠ ĐIỆN PHONG VIỆT",
    clientInitial: "P", clientInitialColor: "#E91E63",
    contractNumber: "HD-2025-015", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 1800000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_006", staffName: "Nguyễn Thị Kim Oanh", staffInitial: "O", staffInitialColor: "#FF9800",
    supportStaff: [{ id: "emp_005", name: "Phạm Thị Thu Thảo", initial: "T", color: "#E91E63" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 1500000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  // emp_004 = Phạm Thị Mỹ Duyên (employee id=4)
  {
    id: "con_016", clientId: "cli_016",
    clientName: "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH",
    clientInitial: "Đ", clientInitialColor: "#9C27B0",
    contractNumber: "HD-2025-016", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 3500000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_004", staffName: "Phạm Thị Mỹ Duyên", staffInitial: "D", staffInitialColor: "#2196F3",
    supportStaff: [{ id: "emp_007", name: "Nguyễn Thành An", initial: "A", color: "#FF5722" }],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 2000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  // emp_002 = Trần Thị Thanh Hằng (employee id=6)
  {
    id: "con_017", clientId: "cli_017",
    clientName: "CÔNG TY VẠN THƯƠNG MẠI DỊCH VỤ CÔNG NGHỆ DMT",
    clientInitial: "D", clientInitialColor: "#00BCD4",
    contractNumber: "HD-2025-017", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 2200000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_002", staffName: "Trần Thị Thanh Hằng", staffInitial: "H", staffInitialColor: "#FF5722",
    supportStaff: [],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 1500000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  // emp_008 = Phạm Văn Phúc (employee id=7)
  {
    id: "con_018", clientId: "cli_018",
    clientName: "CÔNG TY TNHH MỘT THÀNH VIÊN XÂY DỰNG HUY ĐẶNG",
    clientInitial: "H", clientInitialColor: "#FF9800",
    contractNumber: "HD-2025-018", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 1200000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_008", staffName: "Phạm Văn Phúc", staffInitial: "P", staffInitialColor: "#4CAF50",
    supportStaff: [{ id: "emp_005", name: "Phạm Thị Thu Thảo", initial: "T", color: "#E91E63" }],
    serviceId: "svc_02", serviceName: "Dịch vụ kế toán", software: "khac",
    applications: [], salaryType: "co_dinh", salaryAmount: 1000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
  // emp_003 = Nguyễn Thị Diệu Hương (employee id=9)
  {
    id: "con_019", clientId: "cli_019",
    clientName: "CÔNG TY TNHH KIÊN KỲ THƯƠNG MẠI",
    clientInitial: "K", clientInitialColor: "#E91E63",
    contractNumber: "HD-2025-019", startDate: "2025-02-01", endDate: "2025-12-31",
    contractValue: 900000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_003", staffName: "Nguyễn Thị Diệu Hương", staffInitial: "H", staffInitialColor: "#4CAF50",
    supportStaff: [],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 800000, notes: "", createdAt: "2025-02-01T00:00:00Z",
  },
  // emp_001 = Lê Ngọc Thuỷ (employee id=1) — was emp_005 before, now adding dedicated contracts
  {
    id: "con_020", clientId: "cli_020",
    clientName: "CÔNG TY TNHH MONOPOWER HOLDINGS",
    clientInitial: "M", clientInitialColor: "#9C27B0",
    contractNumber: "HD-2025-020", startDate: "2025-01-01", endDate: "2025-12-31",
    contractValue: 5000000, feeType: "monthly", feeTypeLabel: "Tháng", status: "active",
    staffId: "emp_001", staffName: "Lê Ngọc Thuỷ", staffInitial: "T", staffInitialColor: "#9C27B0",
    supportStaff: [{ id: "emp_004", name: "Phạm Thị Mỹ Duyên", initial: "D", color: "#2196F3" }],
    serviceId: "svc_01", serviceName: "Dịch vụ kế toán thuế", software: "aketoan",
    applications: ["aketoan"], salaryType: "co_dinh", salaryAmount: 3000000, notes: "", createdAt: "2025-01-01T00:00:00Z",
  },
];
