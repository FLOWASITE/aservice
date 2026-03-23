import type { DropdownOption, TaxLookupResult } from "@/types/clientForm";

export const mockBusinessFields: DropdownOption[] = [
  { id: 1, ten: "Dịch vụ" },
  { id: 2, ten: "Sản xuất" },
  { id: 3, ten: "Thương mại" },
  { id: 4, ten: "Xây dựng" },
  { id: 5, ten: "Công nghệ" },
  { id: 6, ten: "Giáo dục" },
  { id: 7, ten: "Y tế" },
  { id: 8, ten: "Vận tải" },
];

export const mockCirculars: DropdownOption[] = [
  { id: 1, ten: "Thông tư 200" },
  { id: 2, ten: "Thông tư 133" },
  { id: 3, ten: "Thông tư 132" },
];

export const mockBusinessSectors: string[] = [
  "Lập trình máy vi tính",
  "Bán buôn máy móc, thiết bị và phụ tùng máy khác",
  "Tư vấn quản lý",
  "Hoạt động kế toán, kiểm toán",
  "Hoạt động kiến trúc và tư vấn kỹ thuật",
  "Bán buôn vật liệu, thiết bị lắp đặt khác trong xây dựng",
  "Xây dựng nhà để ở",
  "Xây dựng công trình kỹ thuật dân dụng khác",
  "Dịch vụ tư vấn thuế",
  "Hoạt động dịch vụ hỗ trợ kinh doanh khác",
  "Cho thuê máy móc, thiết bị",
  "Bán lẻ hàng hóa khác mới",
];

export const mockApplications: DropdownOption[] = [
  { id: 1, ten: "Aketoan Starter" },
  { id: 2, ten: "Aketoan Pro" },
  { id: 3, ten: "Aketoan Enterprise" },
  { id: 4, ten: "Aketoan Cloud" },
];

export const mockEmployeesDropdown: DropdownOption[] = [
  { id: 1, ten: "Lê Ngọc Thùy" },
  { id: 2, ten: "Nguyễn Thành An" },
  { id: 3, ten: "Nguyễn Thị Kim Oanh" },
  { id: 4, ten: "Phạm Thị Mỹ Duyên" },
  { id: 5, ten: "Phạm Thị Thu Thảo" },
  { id: 6, ten: "Trần Thị Thanh Hằng" },
  { id: 7, ten: "Phạm Văn Phúc" },
  { id: 8, ten: "Trần Nguyễn Yến Nhi" },
  { id: 9, ten: "Nguyễn Thị Diệu Hương" },
];

export const mockGroupsDropdown: DropdownOption[] = [
  { id: 1, ten: "NỘI BỘ" },
  { id: 2, ten: "KẾ TOÁN TAF" },
  { id: 3, ten: "KIỂM TOÁN TAF" },
  { id: 4, ten: "KẾ TOÁN KHÁC" },
  { id: 5, ten: "TƯ VẤN" },
];

export function mockTaxLookup(taxCode: string): TaxLookupResult | null {
  const data: Record<string, TaxLookupResult> = {
    "0316336599": {
      name: "CÔNG TY CP CÔNG NGHỆ AONE",
      address: "123 Nguyễn Huệ, Q1, TP.HCM",
      legalRepresentative: "Võ Phương Duy",
      establishmentDate: "2020-06-29",
    },
    "0301234567": {
      name: "CÔNG TY TNHH ABC VIỆT NAM",
      address: "456 Lê Lợi, Q3, TP.HCM",
      legalRepresentative: "Nguyễn Văn A",
    },
  };
  return data[taxCode] || null;
}
