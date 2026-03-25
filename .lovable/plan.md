

## Plan: Cập nhật Dashboard với dữ liệu động từ mock data

### Vấn đề hiện tại
Dashboard đang dùng dữ liệu tĩnh (hardcoded) với các số liệu không chính xác:
- KPI cards: Khách hàng = 132, Tờ khai = 45, Doanh nghiệp = 86, Công nợ = 1.2B (tất cả sai)
- Biểu đồ "Doanh thu & Chi phí" -- không phù hợp, cần là **Doanh thu** (từ hợp đồng)
- Thiếu card **Số hợp đồng** và **Nhân viên**

### Thay đổi

**1. KPI Cards -- lấy dữ liệu động**
- **Khách hàng**: Đếm tổng số client từ `clientMock` (tất cả status)
- **Hợp đồng**: Đếm `mockContracts.length`
- **Nhân viên**: Đếm tổng nhân viên từ `employeeMock`
- **Doanh thu**: Tính tổng `gia_tri_hop_dong` từ `mockContracts`
- Bỏ phần % change hardcoded (hoặc ẩn khi = 0)

**2. Biểu đồ chính: "Doanh thu theo tháng"**
- Thay biểu đồ "Doanh thu & Chi phí" thành biểu đồ **Doanh thu** đơn (từ hợp đồng)
- Nếu chưa có hợp đồng, hiển thị empty state

**3. Các biểu đồ khác giữ nguyên** nhưng cũng cập nhật dữ liệu từ mock nếu có thể

### File thay đổi
- `src/pages/DashboardPage.tsx`: Import mock data, tính toán KPI động, cập nhật cards và biểu đồ

### Chi tiết kỹ thuật
```typescript
// Import data sources
import { getMockClientList } from "@/mocks/clientMock";
import { mockContracts } from "@/mocks/contractMock";
import { getMockEmployees } from "@/mocks/employeeMock";

// Calculate dynamic stats
const totalClients = ["cho_thuc_hien","dang_thuc_hien_ke_toan","dang_thuc_hien_ke_toan_khac","ngung_thuc_hien"]
  .reduce((sum, s) => sum + getMockClientList(s).total, 0);
const totalContracts = mockContracts.length;
const totalEmployees = getMockEmployees("dang_lam_viec").length;
const totalRevenue = mockContracts.reduce((s, c) => s + (c.gia_tri_hop_dong || 0), 0);
```

Cards sẽ là: Khách hàng, Hợp đồng, Nhân viên, Doanh thu -- tất cả lấy từ dữ liệu thực.

