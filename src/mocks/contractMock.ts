import type { Contract, DropdownOption } from "@/types/contract";

export const mockClients: DropdownOption[] = [
  { id: 1, ten: "CÔNG TY CỔ PHẦN HTV.BT VIỆT NAM" },
  { id: 2, ten: "CÔNG TY TNHH NBC 1 VIETNAM" },
  { id: 3, ten: "CÔNG TY TNHH MONOPOWER HOLDINGS" },
  { id: 4, ten: "CÔNG TY ĐẦU TƯ VÀ XÂY DỰNG COSEVCO PHƯƠNG NAM" },
  { id: 5, ten: "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH" },
  { id: 6, ten: "CÔNG TY TNHH FVTOURIST" },
  { id: 7, ten: "Công Ty Tnhh Harmony Necklaces" },
  { id: 8, ten: "CÔNG TY TNHH KIM'S HOLDINGS" },
];

export const mockServices: DropdownOption[] = [
  { id: 1, ten: "Dịch vụ kế toán" },
  { id: 2, ten: "Dịch vụ thuế" },
  { id: 3, ten: "Dịch vụ kiểm toán" },
  { id: 4, ten: "Dịch vụ tư vấn tài chính" },
  { id: 5, ten: "Dịch vụ thành lập doanh nghiệp" },
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

export const mockContracts: Contract[] = [
  {
    id: 1, khach_hang_id: 1, khach_hang_ten: "CÔNG TY CỔ PHẦN HTV.BT VIỆT NAM",
    so_hop_dong: "HD-2026-001", trang_thai: "dang_thuc_hien", dich_vu_id: 1, dich_vu_ten: "Dịch vụ kế toán",
    gia_tri_hop_dong: 6000000, cach_tinh_phi: "theo_thang",
    ngay_bat_dau: "2026-01-01", ngay_ket_thuc: "2026-12-31",
    nhan_vien_phu_trach_id: 1, nhan_vien_phu_trach_ten: "Phạm Thị Thu Thảo",
    nhan_vien_ho_tro_id: 2, nhan_vien_ho_tro_ten: "Trần Thị Thanh Hằng",
    file_hop_dong: null, ghi_chu: "", phan_mem: "aketoan", ung_dung_id: 2, ung_dung_ten: "Aketoan Pro",
    cau_hinh_luong: "co_dinh", tien_luong: 3000000, created_at: "2026-01-01",
  },
  {
    id: 2, khach_hang_id: 2, khach_hang_ten: "CÔNG TY TNHH NBC 1 VIETNAM",
    so_hop_dong: "HD-2026-002", trang_thai: "dang_thuc_hien", dich_vu_id: 2, dich_vu_ten: "Dịch vụ thuế",
    gia_tri_hop_dong: 3000000, cach_tinh_phi: "theo_thang",
    ngay_bat_dau: "2026-02-01", ngay_ket_thuc: "2026-12-31",
    nhan_vien_phu_trach_id: 2, nhan_vien_phu_trach_ten: "Trần Thị Thanh Hằng",
    nhan_vien_ho_tro_id: null, nhan_vien_ho_tro_ten: null,
    file_hop_dong: null, ghi_chu: "Hợp đồng gia hạn", phan_mem: "khac", ung_dung_id: null, ung_dung_ten: null,
    cau_hinh_luong: "theo_gia_tri_hop_dong", tien_luong: 0, created_at: "2026-02-01",
  },
  {
    id: 3, khach_hang_id: 3, khach_hang_ten: "CÔNG TY TNHH MONOPOWER HOLDINGS",
    so_hop_dong: "HD-2026-003", trang_thai: "dang_thuc_hien", dich_vu_id: 1, dich_vu_ten: "Dịch vụ kế toán",
    gia_tri_hop_dong: 5000000, cach_tinh_phi: "theo_thang",
    ngay_bat_dau: "2026-01-15", ngay_ket_thuc: "2027-01-14",
    nhan_vien_phu_trach_id: 3, nhan_vien_phu_trach_ten: "Nguyễn Thị Diệu Hương",
    nhan_vien_ho_tro_id: 4, nhan_vien_ho_tro_ten: "Phạm Thị Mỹ Duyên",
    file_hop_dong: null, ghi_chu: "", phan_mem: "aketoan", ung_dung_id: 1, ung_dung_ten: "Aketoan Basic",
    cau_hinh_luong: "co_dinh", tien_luong: 2500000, created_at: "2026-01-15",
  },
  {
    id: 4, khach_hang_id: 5, khach_hang_ten: "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH",
    so_hop_dong: "HD-2026-004", trang_thai: "tam_ngung", dich_vu_id: 3, dich_vu_ten: "Dịch vụ kiểm toán",
    gia_tri_hop_dong: 10000000, cach_tinh_phi: "mot_lan",
    ngay_bat_dau: "2026-03-01", ngay_ket_thuc: "2026-06-30",
    nhan_vien_phu_trach_id: 5, nhan_vien_phu_trach_ten: "Lê Ngọc Thùy",
    nhan_vien_ho_tro_id: 6, nhan_vien_ho_tro_ten: "Nguyễn Thị Thanh Bình",
    file_hop_dong: null, ghi_chu: "Tạm ngưng do khách hàng yêu cầu", phan_mem: "khac", ung_dung_id: null, ung_dung_ten: null,
    cau_hinh_luong: "co_dinh", tien_luong: 5000000, created_at: "2026-03-01",
  },
  {
    id: 5, khach_hang_id: 6, khach_hang_ten: "CÔNG TY TNHH FVTOURIST",
    so_hop_dong: "HD-2026-005", trang_thai: "dang_thuc_hien", dich_vu_id: 4, dich_vu_ten: "Dịch vụ tư vấn tài chính",
    gia_tri_hop_dong: 8000000, cach_tinh_phi: "theo_quy",
    ngay_bat_dau: "2026-01-01", ngay_ket_thuc: "2026-12-31",
    nhan_vien_phu_trach_id: 7, nhan_vien_phu_trach_ten: "Nguyễn Thành An",
    nhan_vien_ho_tro_id: 1, nhan_vien_ho_tro_ten: "Phạm Thị Thu Thảo",
    file_hop_dong: null, ghi_chu: "", phan_mem: "aketoan", ung_dung_id: 3, ung_dung_ten: "Aketoan Enterprise",
    cau_hinh_luong: "theo_gia_tri_hop_dong", tien_luong: 0, created_at: "2026-01-01",
  },
];
