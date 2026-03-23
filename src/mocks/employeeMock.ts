import type { Employee, EmployeeStats, EmployeeTabCount, EmployeeClient, EmployeeStatus, Group } from "@/types/employee";

const COLORS = [
  "hsl(215 70% 42%)", "hsl(152 60% 42%)", "hsl(0 72% 51%)",
  "hsl(280 60% 50%)", "hsl(38 92% 50%)", "hsl(195 70% 45%)",
  "hsl(340 65% 50%)", "hsl(160 50% 40%)",
];

const EMPLOYEES_RAW: Omit<Employee, "id" | "stt" | "avatar_color" | "trang_thai">[] = [
  { ma: "THUYLN", ho_ten: "Lê Ngọc Thùy", email: "thuyln@aservice.vn", chuc_vu: "Kế toán trưởng", nhom: "NỘI BỘ", nhom_id: 1, thoi_gian_lam_viec_min: 3, thoi_gian_lam_viec_max: 5, so_luong_dv_ke_toan_min: 12, so_luong_dv_ke_toan_max: 18, so_luong_dv_khac_min: 2, so_luong_dv_khac_max: 5, doanh_thu_dv_ke_toan_min: 23716667, doanh_thu_dv_ke_toan_max: 45000000, doanh_thu_dv_khac_min: 3000000, doanh_thu_dv_khac_max: 8000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "NTAN", ho_ten: "Nguyễn Thành An", email: "ntan@aservice.vn", chuc_vu: "Kế toán viên", nhom: "KẾ TOÁN TAF", nhom_id: 2, thoi_gian_lam_viec_min: 2, thoi_gian_lam_viec_max: 4, so_luong_dv_ke_toan_min: 8, so_luong_dv_ke_toan_max: 15, so_luong_dv_khac_min: 1, so_luong_dv_khac_max: 3, doanh_thu_dv_ke_toan_min: 18500000, doanh_thu_dv_ke_toan_max: 35000000, doanh_thu_dv_khac_min: 2000000, doanh_thu_dv_khac_max: 5000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "NTKO", ho_ten: "Nguyễn Thị Kim Oanh", email: "ntko@aservice.vn", chuc_vu: "Kế toán viên", nhom: "KẾ TOÁN TAF", nhom_id: 2, thoi_gian_lam_viec_min: 1, thoi_gian_lam_viec_max: 3, so_luong_dv_ke_toan_min: 10, so_luong_dv_ke_toan_max: 20, so_luong_dv_khac_min: 0, so_luong_dv_khac_max: 2, doanh_thu_dv_ke_toan_min: 20000000, doanh_thu_dv_ke_toan_max: 40000000, doanh_thu_dv_khac_min: 0, doanh_thu_dv_khac_max: 3000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "0012", ho_ten: "Phạm Thị Mỹ Duyên", email: "ptmd@aservice.vn", chuc_vu: "Trợ lý", nhom: "KIỂM TOÁN TAF", nhom_id: 3, thoi_gian_lam_viec_min: 1, thoi_gian_lam_viec_max: 2, so_luong_dv_ke_toan_min: 5, so_luong_dv_ke_toan_max: 10, so_luong_dv_khac_min: 1, so_luong_dv_khac_max: 4, doanh_thu_dv_ke_toan_min: 12000000, doanh_thu_dv_ke_toan_max: 25000000, doanh_thu_dv_khac_min: 1500000, doanh_thu_dv_khac_max: 4000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "PTMD", ho_ten: "Phạm Thị Thu Thảo", email: "pttt@aservice.vn", chuc_vu: "Kế toán viên", nhom: "NỘI BỘ", nhom_id: 1, thoi_gian_lam_viec_min: 4, thoi_gian_lam_viec_max: 6, so_luong_dv_ke_toan_min: 15, so_luong_dv_ke_toan_max: 22, so_luong_dv_khac_min: 3, so_luong_dv_khac_max: 6, doanh_thu_dv_ke_toan_min: 30000000, doanh_thu_dv_ke_toan_max: 55000000, doanh_thu_dv_khac_min: 5000000, doanh_thu_dv_khac_max: 10000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "0013", ho_ten: "Trần Thị Thanh Hằng", email: "ttth@aservice.vn", chuc_vu: "Kế toán viên", nhom: "KẾ TOÁN TAF", nhom_id: 2, thoi_gian_lam_viec_min: 2, thoi_gian_lam_viec_max: 4, so_luong_dv_ke_toan_min: 9, so_luong_dv_ke_toan_max: 16, so_luong_dv_khac_min: 2, so_luong_dv_khac_max: 4, doanh_thu_dv_ke_toan_min: 19000000, doanh_thu_dv_ke_toan_max: 38000000, doanh_thu_dv_khac_min: 2500000, doanh_thu_dv_khac_max: 6000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "PVP", ho_ten: "Phạm Văn Phúc", email: "pvp@aservice.vn", chuc_vu: "Trưởng nhóm", nhom: "KIỂM TOÁN TAF", nhom_id: 3, thoi_gian_lam_viec_min: 5, thoi_gian_lam_viec_max: 7, so_luong_dv_ke_toan_min: 20, so_luong_dv_ke_toan_max: 28, so_luong_dv_khac_min: 4, so_luong_dv_khac_max: 8, doanh_thu_dv_ke_toan_min: 42000000, doanh_thu_dv_ke_toan_max: 65000000, doanh_thu_dv_khac_min: 7000000, doanh_thu_dv_khac_max: 12000000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "TNYN", ho_ten: "Trần Nguyễn Yến Nhi", email: "tnyn@aservice.vn", chuc_vu: "Kế toán viên", nhom: "NỘI BỘ", nhom_id: 1, thoi_gian_lam_viec_min: 1, thoi_gian_lam_viec_max: 3, so_luong_dv_ke_toan_min: 7, so_luong_dv_ke_toan_max: 14, so_luong_dv_khac_min: 1, so_luong_dv_khac_max: 3, doanh_thu_dv_ke_toan_min: 15000000, doanh_thu_dv_ke_toan_max: 30000000, doanh_thu_dv_khac_min: 1500000, doanh_thu_dv_khac_max: 4500000, cong_no_min: 0, cong_no_max: 0 },
  { ma: "TTTH", ho_ten: "Nguyễn Thị Diệu Hương", email: "ntdh@aservice.vn", chuc_vu: "Kế toán viên", nhom: "KẾ TOÁN TAF", nhom_id: 2, thoi_gian_lam_viec_min: 3, thoi_gian_lam_viec_max: 5, so_luong_dv_ke_toan_min: 11, so_luong_dv_ke_toan_max: 19, so_luong_dv_khac_min: 2, so_luong_dv_khac_max: 5, doanh_thu_dv_ke_toan_min: 22000000, doanh_thu_dv_ke_toan_max: 42000000, doanh_thu_dv_khac_min: 3000000, doanh_thu_dv_khac_max: 7000000, cong_no_min: 0, cong_no_max: 0 },
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

export function getMockEmployeeClients(employeeId: number): EmployeeClient[] {
  return Array.from({ length: 3 + (employeeId % 5) }, (_, i) => ({
    id: i + 1,
    ten: `CÔNG TY TNHH ${["ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON"][i % 5]} ${employeeId}${i}`,
    ma_so_thue: `030${1000000 + employeeId * 10 + i}`,
    phi_dich_vu: [3000000, 5000000, 7000000, 2000000, 10000000][i % 5],
    trang_thai: "Đang thực hiện",
  }));
}

export const mockGroups: Group[] = [
  { id: 1, ten: "NỘI BỘ", truong_nhom: "Lê Ngọc Thùy", truong_nhom_id: 1, so_thanh_vien: 3, mo_ta: "Nhóm nội bộ công ty" },
  { id: 2, ten: "KẾ TOÁN TAF", truong_nhom: "Trần Thị Thanh Hằng", truong_nhom_id: 6, so_thanh_vien: 4, mo_ta: "Nhóm kế toán TAF" },
  { id: 3, ten: "KIỂM TOÁN TAF", truong_nhom: "Phạm Văn Phúc", truong_nhom_id: 7, so_thanh_vien: 2, mo_ta: "Nhóm kiểm toán TAF" },
  { id: 4, ten: "KẾ TOÁN KHÁC", truong_nhom: "Nguyễn Thị Kim Oanh", truong_nhom_id: 3, so_thanh_vien: 5, mo_ta: "Nhóm kế toán khác" },
  { id: 5, ten: "TƯ VẤN", truong_nhom: "Nguyễn Thành An", truong_nhom_id: 2, so_thanh_vien: 3, mo_ta: "Nhóm tư vấn" },
];
