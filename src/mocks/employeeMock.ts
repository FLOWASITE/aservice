import type { Employee, EmployeeStats, EmployeeTabCount, EmployeeClient, EmployeeStatus, EmployeeTotals, Group } from "@/types/employee";
import { mockContracts, clientTaxCodes, clientGroups } from "@/mocks/contractMock";

const COLORS = [
  "hsl(215 70% 42%)", "hsl(152 60% 42%)", "hsl(0 72% 51%)",
  "hsl(280 60% 50%)", "hsl(38 92% 50%)", "hsl(195 70% 45%)",
  "hsl(340 65% 50%)", "hsl(160 50% 40%)",
];

const EMPLOYEES_RAW: Omit<Employee, "id" | "stt" | "avatar_color" | "trang_thai">[] = [
  { ma: "THUYLN", ho_ten: "Lê Ngọc Thuỷ", email: "lengocthuyct343@gmail.com", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2024-01-15", tham_nien: { years: 2, months: 4 }, so_luong_dv_ke_toan: 12, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 23716667, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "NTAN", ho_ten: "Nguyễn Thành An", email: "thanhan050901nta@gmail.com", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2023-07-20", tham_nien: { years: 2, months: 10 }, so_luong_dv_ke_toan: 14, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 33483333, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "NTKO", ho_ten: "Nguyễn Thị Kim Oanh", email: "ntkimoanh220501@gmail.com", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2022-11-01", tham_nien: { years: 3, months: 4 }, so_luong_dv_ke_toan: 13, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 24366667, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "0012", ho_ten: "Phạm Thị Mỹ Duyên", email: "phamduyen5500@gmail.com", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2023-03-10", tham_nien: { years: 3, months: 0 }, so_luong_dv_ke_toan: 16, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 35900000, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "PTMD", ho_ten: "Phạm Thị Thu Thảo", email: "pttt@aservice.vn", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2022-06-15", tham_nien: { years: 3, months: 9 }, so_luong_dv_ke_toan: 22, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 55000000, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "0013", ho_ten: "Trần Thị Thanh Hằng", email: "ttth@aservice.vn", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2023-05-01", tham_nien: { years: 2, months: 10 }, so_luong_dv_ke_toan: 16, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 38000000, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "PVP", ho_ten: "Phạm Văn Phúc", email: "pvp@aservice.vn", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2025-01-01", tham_nien: { years: 1, months: 3 }, so_luong_dv_ke_toan: 13, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 267200000, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "TNYN", ho_ten: "Trần Nguyễn Yến Nhi", email: "tnyn@aservice.vn", chuc_vu: "Thực tập", nhom: "—", nhom_id: 0, ngay_bat_dau: "2024-09-01", tham_nien: { years: 0, months: 6 }, so_luong_dv_ke_toan: 0, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 0, doanh_thu_dv_khac: 0, cong_no: 0 },
  { ma: "TTTH", ho_ten: "Nguyễn Thị Diệu Hương", email: "ntdh@aservice.vn", chuc_vu: "Kế toán", nhom: "—", nhom_id: 0, ngay_bat_dau: "2023-09-15", tham_nien: { years: 2, months: 6 }, so_luong_dv_ke_toan: 13, so_luong_dv_khac: 0, doanh_thu_dv_ke_toan: 15999443, doanh_thu_dv_khac: 0, cong_no: 0 },
];

function buildEmployees(status: EmployeeStatus, items: typeof EMPLOYEES_RAW): Employee[] {
  return items.map((e, i) => ({
    ...e,
    id: i + 1,
    stt: i + 1,
    avatar_color: COLORS[i % COLORS.length],
    trang_thai: status,
  }));
}

const employeesByStatus: Record<string, Employee[]> = {
  dang_lam_viec: buildEmployees("dang_lam_viec", EMPLOYEES_RAW),
  nghi_thai_san: buildEmployees("nghi_thai_san", EMPLOYEES_RAW.slice(0, 2)),
  khac: [],
};

export function getMockEmployeeStats(): EmployeeStats {
  return {
    khach_hang_phu_trach: 133,
    cong_no: 0,
    doanh_thu_dv_ke_toan: 838242311,
    doanh_thu_khac: 45600000,
    tong_doanh_thu_nam: 9748898309,
  };
}

export function getMockEmployeeTabCounts(): EmployeeTabCount {
  return {
    dang_lam_viec: 9,
    nghi_thai_san: 2,
    khac: 21,
  };
}

export function getMockEmployees(status: EmployeeStatus, search?: string): Employee[] {
  let list = employeesByStatus[status] || [];
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (e) =>
        e.ho_ten.toLowerCase().includes(q) ||
        e.ma.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getMockEmployeeTotals(): EmployeeTotals {
  return {
    total_clients: 119,
    total_so_luong_dv_ke_toan: 119,
    total_so_luong_dv_khac: 0,
    total_doanh_thu_dv_ke_toan: 493666110,
    total_doanh_thu_dv_khac: 0,
    total_cong_no: 0,
  };
}

// Mapping from employee numeric ID to contract staffId
const employeeToStaffId: Record<number, string> = {
  1: "emp_001", // Lê Ngọc Thuỷ
  2: "emp_007", // Nguyễn Thành An
  3: "emp_006", // Nguyễn Thị Kim Oanh
  4: "emp_004", // Phạm Thị Mỹ Duyên
  5: "emp_005", // Phạm Thị Thu Thảo (was emp_001 in old contract mock)
  6: "emp_002", // Trần Thị Thanh Hằng
  7: "emp_008", // Phạm Văn Phúc
  8: "emp_009", // Trần Nguyễn Yến Nhi
  9: "emp_003", // Nguyễn Thị Diệu Hương
};

export function getMockEmployeeClients(employeeId: number): EmployeeClient[] {
  const { clientTaxCodes, clientGroups } = require("@/mocks/contractMock");
  const staffId = employeeToStaffId[employeeId];
  if (!staffId) return [];

  // Group contracts by clientId for this employee
  const clientMap: Record<string, {
    clientName: string;
    clientInitial: string;
    clientInitialColor: string;
    totalValue: number;
    supportStaff: { initial: string; color: string }[];
  }> = {};

  mockContracts.forEach(c => {
    if (c.staffId !== staffId) return;
    if (!clientMap[c.clientId]) {
      clientMap[c.clientId] = {
        clientName: c.clientName,
        clientInitial: c.clientInitial,
        clientInitialColor: c.clientInitialColor,
        totalValue: 0,
        supportStaff: [],
      };
    }
    clientMap[c.clientId].totalValue += c.contractValue;
    c.supportStaff.forEach(s => {
      if (!clientMap[c.clientId].supportStaff.find(ss => ss.initial === s.initial)) {
        clientMap[c.clientId].supportStaff.push({ initial: s.initial, color: s.color });
      }
    });
  });

  return Object.entries(clientMap).map(([clientId, info], i) => ({
    id: i + 1,
    ten: info.clientName,
    ma_so_thue: clientTaxCodes[clientId] || "0000000000",
    nhom_khach_hang: clientGroups[clientId] || "—",
    gia_tri_hop_dong: info.totalValue,
    nhan_vien_ho_tro: info.supportStaff[0]?.initial || "—",
    nhan_vien_ho_tro_color: info.supportStaff[0]?.color || COLORS[0],
    avatar_color: info.clientInitialColor,
  }));
}

export const mockGroups: Group[] = [
  { id: 1, ten: "NỘI BỘ", truong_nhom: "Lê Ngọc Thùy", truong_nhom_id: 1, so_thanh_vien: 3, mo_ta: "Nhóm nội bộ công ty" },
  { id: 2, ten: "KẾ TOÁN TAF", truong_nhom: "Trần Thị Thanh Hằng", truong_nhom_id: 6, so_thanh_vien: 4, mo_ta: "Nhóm kế toán TAF" },
  { id: 3, ten: "KIỂM TOÁN TAF", truong_nhom: "Phạm Văn Phúc", truong_nhom_id: 7, so_thanh_vien: 2, mo_ta: "Nhóm kiểm toán TAF" },
  { id: 4, ten: "KẾ TOÁN KHÁC", truong_nhom: "Nguyễn Thị Kim Oanh", truong_nhom_id: 3, so_thanh_vien: 5, mo_ta: "Nhóm kế toán khác" },
  { id: 5, ten: "TƯ VẤN", truong_nhom: "Nguyễn Thành An", truong_nhom_id: 2, so_thanh_vien: 3, mo_ta: "Nhóm tư vấn" },
];
