export interface Contract {
  id: number;
  khach_hang_id: number;
  khach_hang_ten: string;
  so_hop_dong: string;
  trang_thai: ContractStatus;
  dich_vu_id: number;
  dich_vu_ten: string;
  gia_tri_hop_dong: number;
  cach_tinh_phi: FeeCalculation;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  nhan_vien_phu_trach_id: number;
  nhan_vien_phu_trach_ten: string;
  nhan_vien_ho_tro_id: number | null;
  nhan_vien_ho_tro_ten: string | null;
  file_hop_dong: string | null;
  ghi_chu: string;
  phan_mem: SoftwareType;
  ung_dung_id: number | null;
  ung_dung_ten: string | null;
  cau_hinh_luong: SalaryConfig;
  tien_luong: number;
  created_at: string;
}

export type ContractStatus = "dang_thuc_hien" | "tam_ngung" | "da_ket_thuc" | "huy";
export type FeeCalculation = "theo_thang" | "theo_quy" | "theo_nam" | "mot_lan";
export type SoftwareType = "aketoan" | "khac";
export type SalaryConfig = "co_dinh" | "theo_gia_tri_hop_dong";

export interface ContractCreatePayload {
  khach_hang_id: number;
  so_hop_dong: string;
  trang_thai: ContractStatus;
  dich_vu_id: number;
  gia_tri_hop_dong: number;
  cach_tinh_phi: FeeCalculation;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  nhan_vien_phu_trach_id: number;
  nhan_vien_ho_tro_id: number | null;
  file_hop_dong: File | null;
  ghi_chu: string;
  phan_mem: SoftwareType;
  ung_dung_id: number | null;
  cau_hinh_luong: SalaryConfig;
  tien_luong: number;
}

export interface DropdownOption {
  id: number;
  ten: string;
}
