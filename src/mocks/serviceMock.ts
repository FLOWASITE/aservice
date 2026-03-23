import type { Service } from "@/types/service";

export const mockServicesList: Service[] = [
  { id: "svc_01", name: "Dịch vụ kế toán thuế", description: "Dịch vụ kế toán và khai thuế định kỳ", status: "active" },
  { id: "svc_02", name: "Dịch vụ kế toán", description: "Dịch vụ kế toán tổng hợp", status: "active" },
  { id: "svc_03", name: "DV QTT giải thể", description: "Dịch vụ quyết toán thuế khi giải thể doanh nghiệp", status: "active" },
  { id: "svc_04", name: "Dịch vụ quyết toán thuế", description: "Quyết toán thuế cuối năm", status: "active" },
  { id: "svc_05", name: "Tạm dừng hoạt động", description: "Hỗ trợ thủ tục tạm dừng hoạt động kinh doanh", status: "active" },
  { id: "svc_06", name: "Dịch vụ kế toán tổng hợp", description: "Dịch vụ kế toán tổng hợp cho doanh nghiệp", status: "active" },
];
