export interface Client {
  id: number;
  stt: number;
  ten: string;
  ten_viet_tat: string;
  nhom: string;
  nhan_vien_phu_trach: string;
  nhan_vien_ho_tro: string[];
  ung_dung: boolean;
  ung_dung_list: string[];
  other_software?: string;
  phi_dich_vu_toi_thieu: number;
  phi_dich_vu_toi_da: number;
  cong_no: number;
  hoa_don_di: number;
  trang_thai: ClientStatus;
  avatar_color: string;
}

export type ClientStatus =
  | "cho_thuc_hien"
  | "dang_thuc_hien_ke_toan"
  | "dang_thuc_hien_ke_toan_khac"
  | "ngung_thuc_hien";

export interface ClientStats {
  khach_hang_da_dang_ky: number;
  nhan_vien: number;
  nhom: number;
  doanh_thu_thang: number;
  doanh_thu_nam: number;
}

export interface ClientTabCount {
  cho_thuc_hien: number;
  dang_thuc_hien_ke_toan: number;
  dang_thuc_hien_ke_toan_khac: number;
  ngung_thuc_hien: number;
}

export interface ClientListParams {
  month?: number;
  year?: number;
  search?: string;
  status?: ClientStatus;
  page?: number;
  limit?: number;
}

export interface ClientListResponse {
  data: Client[];
  total: number;
  stats: ClientStats;
  tab_counts: ClientTabCount;
}
