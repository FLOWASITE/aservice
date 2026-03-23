export type EmployeeStatus = "dang_lam_viec" | "nghi_thai_san" | "nghi_viec" | "khac";

export interface Employee {
  id: number;
  stt: number;
  ma: string;
  ho_ten: string;
  email: string;
  chuc_vu: string;
  nhom: string;
  nhom_id: number;
  avatar_color: string;
  thoi_gian_lam_viec_min: number;
  thoi_gian_lam_viec_max: number;
  so_luong_dv_ke_toan_min: number;
  so_luong_dv_ke_toan_max: number;
  so_luong_dv_khac_min: number;
  so_luong_dv_khac_max: number;
  doanh_thu_dv_ke_toan_min: number;
  doanh_thu_dv_ke_toan_max: number;
  doanh_thu_dv_khac_min: number;
  doanh_thu_dv_khac_max: number;
  cong_no_min: number;
  cong_no_max: number;
  trang_thai: EmployeeStatus;
  ngay_sinh?: string;
  noi_sinh?: string;
  gioi_tinh?: string;
  cccd?: string;
  ma_so_thue_tncn?: string;
  dia_chi?: string;
  ngay_bat_dau?: string;
  luong_co_ban?: number;
}

export interface EmployeeStats {
  khach_hang_phu_trach: number;
  cong_no: number;
  doanh_thu_dv_ke_toan: number;
  doanh_thu_khac: number;
  tong_doanh_thu_nam: number;
}

export interface EmployeeTabCount {
  dang_lam_viec: number;
  nghi_thai_san: number;
  khac: number;
}

export interface EmployeeClient {
  id: number;
  ten: string;
  ma_so_thue: string;
  phi_dich_vu: number;
  trang_thai: string;
}

export interface EmployeeCreatePayload {
  ma: string;
  ho_ten: string;
  chuc_vu?: string;
  ngay_sinh?: string;
  noi_sinh?: string;
  gioi_tinh?: string;
  cccd?: string;
  ma_so_thue_tncn?: string;
  dia_chi?: string;
  ngay_bat_dau?: string;
  trang_thai?: EmployeeStatus;
  nhom_id?: number;
  luong_co_ban?: number;
  email?: string;
  password?: string;
}

export interface Group {
  id: number;
  ten: string;
  truong_nhom: string;
  truong_nhom_id?: number;
  so_thanh_vien: number;
  mo_ta: string;
}

export interface GroupCreatePayload {
  ten: string;
  truong_nhom_id?: number;
  mo_ta?: string;
}
