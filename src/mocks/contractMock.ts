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

export const mockContracts: Contract[] = [];
