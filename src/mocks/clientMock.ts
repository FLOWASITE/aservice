import type { Client, ClientListResponse, ClientStatus } from "@/types/client";

const AVATAR_COLORS = [
  "hsl(215 70% 42%)", "hsl(152 60% 42%)", "hsl(0 72% 51%)",
  "hsl(280 60% 50%)", "hsl(38 92% 50%)", "hsl(195 70% 45%)",
  "hsl(340 65% 50%)", "hsl(160 50% 40%)",
];

const NAMES = [
  "CÔNG TY CỔ PHẦN HTV.BT VIỆT NAM",
  "CÔNG TY TNHH NBC 1 VIETNAM",
  "CÔNG TY TNHH MONOPOWER HOLDINGS",
  "CÔNG TY ĐẦU TƯ VÀ XÂY DỰNG COSEVCO PHƯƠNG NAM",
  "CÔNG TY TNHH ĐẠI PHÚC HƯNG THỊNH",
  "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI KIÊN KỲ",
  "CÔNG TY MAI VÀ XUẤT NHẬP KHẨU HOÀNG SƠN PHÁT",
  "CÔNG TY TNHH FVTOURIST",
  "Công Ty Tnhh Harmony Necklaces",
  "TRƯỜNG MẦM NON HỌC VIỆN SÀI GÒN",
  "CÔNG TY VIÊN THƯƠNG MẠI XUẤT NHẬP KHẨU LÝ ĐỨC",
  "CÔNG TY TNHH SƯ TỬ HYEN-TAN",
  "CÔNG TY TNHH XÂY DỰNG LÂM TRONG",
  "CÔNG TY TNHH KIM'S HOLDINGS",
  "CÔNG TY VẠN THƯƠNG MẠI DỊCH VỤ CÔNG NGHỆ DMT",
  "CÔNG TY TNHH MỘT THÀNH VIÊN XÂY DỰNG HUY ĐẶNG",
  "CÔNG TY CỔ PHẦN CÔNG NGHỆ & XÂY DỰNG QUANG MINH",
  "CÔNG TY TNHH XÂY DỰNG CƠ ĐIỆN PHONG VIỆT",
];

const NHOM = ["NỘI BỘ", "KẾ TOÁN TAF", "KIỂM TOÁN TAF", "—"];
const NHAN_VIEN = [
  "Phạm Thị Thu Thảo", "Trần Thị Thanh Hằng", "Nguyễn Thị Diệu Hương",
  "Phạm Thị Mỹ Duyên", "Lê Ngọc Thùy", "Nguyễn Thị Thanh Bình",
  "Nguyễn Thị Kim Oanh", "Nguyễn Thành An", "Nguyễn Thị Kim Hà",
  "Phạm Văn Phúc", "Trần Nguyễn Yến Nhi",
];

const FEES = [0, 300000, 500000, 700000, 1000000, 1388889, 2000000, 3000000, 3200000, 5000000, 6000000, 314476666];

const APP_COMBOS = [
  ["aketoan"],
  ["aketoan", "aread"],
  ["aketoan", "amall", "aread"],
  [],
  ["aketoan", "amall"],
  ["aread"],
];

function generateClients(status: ClientStatus, count: number, startStt: number): Client[] {
  return Array.from({ length: count }, (_, i) => {
    const nameIdx = (startStt + i) % NAMES.length;
    const initial = NAMES[nameIdx].charAt(NAMES[nameIdx].lastIndexOf(" ") + 1) || NAMES[nameIdx].charAt(0);
    const apps = APP_COMBOS[i % APP_COMBOS.length];
    return {
      id: startStt + i,
      stt: startStt + i,
      ten: NAMES[nameIdx],
      ten_viet_tat: initial,
      nhom: NHOM[i % NHOM.length],
      nhan_vien_phu_trach: NHAN_VIEN[i % NHAN_VIEN.length],
      nhan_vien_ho_tro: i % 3 === 0 ? [NHAN_VIEN[(i + 3) % NHAN_VIEN.length]] : [],
      ung_dung: apps.length > 0,
      ung_dung_list: apps,
      phi_dich_vu_toi_thieu: FEES[i % FEES.length],
      phi_dich_vu_toi_da: 0,
      cong_no: 0,
      hoa_don_di: 0,
      trang_thai: status,
      avatar_color: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });
}

const allClients: Record<ClientStatus, Client[]> = {
  cho_thuc_hien: [],
  dang_thuc_hien_ke_toan: [],
  dang_thuc_hien_ke_toan_khac: generateClients("dang_thuc_hien_ke_toan_khac", 15, 1),
  ngung_thuc_hien: generateClients("ngung_thuc_hien", 12, 1),
};

export function getMockClientList(
  status: ClientStatus,
  search?: string,
): ClientListResponse {
  let data = allClients[status] || [];

  if (search) {
    const q = search.toLowerCase();
    data = data.filter(
      (c) =>
        c.ten.toLowerCase().includes(q) ||
        c.nhan_vien_phu_trach.toLowerCase().includes(q)
    );
  }

  return {
    data,
    total: data.length,
    stats: {
      khach_hang_da_dang_ky: 132,
      nhan_vien: 30,
      nhom: 5,
      doanh_thu_thang: 838242311,
      doanh_thu_nam: 9748898309,
    },
    tab_counts: {
      cho_thuc_hien: 0,
      dang_thuc_hien_ke_toan: 0,
      dang_thuc_hien_ke_toan_khac: 15,
      ngung_thuc_hien: 12,
    },
  };
}
