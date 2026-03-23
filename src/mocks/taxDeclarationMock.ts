import type { TaxDeclarationRow, TaxPeriodCell, TaxDeclarationStatus, TaxType } from "@/types/taxDeclaration";

const AVATAR_COLORS = [
  "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
  "#009688", "#4CAF50", "#FF9800", "#795548", "#607D8B",
];

const CLIENT_NAMES = [
  "CHI NHÁNH CÔNG TY TNHH SILAB",
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
  "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ANH KHOA",
];

const STAFF = [
  "Nguyễn Thành An", "Phạm Thị Thu Thảo", "Lê Ngọc Thùy",
  "Trần Thị Thanh Hằng", "Nguyễn Thị Diệu Hương", "Phạm Văn Phúc",
];

const STATUSES: TaxDeclarationStatus[] = ["not_synced", "submitted", "overdue", "processing", "completed", "not_required"];
const STATUS_LABELS: Record<TaxDeclarationStatus, string> = {
  not_synced: "Chưa đồng bộ",
  submitted: "Đã nộp",
  overdue: "Trễ hạn",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  not_required: "Không phát sinh",
};

function randomCell(seed: number): TaxPeriodCell {
  const status = STATUSES[seed % STATUSES.length];
  const hasDeadline = status !== "not_synced" && status !== "not_required";
  return {
    deadline: hasDeadline ? `${String((seed % 28) + 1).padStart(2, "0")}/0${(seed % 4) + 1}/2026` : null,
    status,
    statusLabel: STATUS_LABELS[status],
    submittedDate: status === "submitted" || status === "completed" ? `${String((seed % 28) + 1).padStart(2, "0")}/0${(seed % 4) + 1}/2026` : null,
    notes: "",
  };
}

export function getMockTaxDeclarations(
  view: "quarterly" | "monthly",
  page: number,
  limit: number,
  search?: string,
): { total: number; items: TaxDeclarationRow[] } {
  const totalClients = 264;
  let allItems: TaxDeclarationRow[] = [];

  for (let i = 0; i < totalClients; i++) {
    const name = CLIENT_NAMES[i % CLIENT_NAMES.length];
    const row: TaxDeclarationRow = {
      id: `td_${String(i + 1).padStart(3, "0")}`,
      clientId: `client_${i + 1}`,
      clientName: name,
      clientInitial: name.charAt(name.lastIndexOf(" ") + 1) || name.charAt(0),
      clientColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      assignedStaff: STAFF[i % STAFF.length],
    };

    if (view === "quarterly") {
      for (let q = 1; q <= 4; q++) {
        row[`q${q}`] = randomCell(i * 4 + q) as any;
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        row[`t${m}`] = randomCell(i * 12 + m) as any;
      }
    }

    allItems.push(row);
  }

  if (search) {
    const q = search.toLowerCase();
    allItems = allItems.filter((r) => r.clientName.toLowerCase().includes(q));
  }

  const start = (page - 1) * limit;
  return { total: allItems.length, items: allItems.slice(start, start + limit) };
}

export const mockTaxTypes: TaxType[] = [
  { id: "gtgt", name: "Giá trị gia tăng (GTGT)" },
  { id: "tndn", name: "Thuế thu nhập doanh nghiệp" },
  { id: "tncn", name: "Thuế thu nhập cá nhân" },
  { id: "bctc", name: "Báo cáo tài chính" },
  { id: "mon_bai", name: "Thuế môn bài" },
];
