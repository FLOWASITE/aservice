import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Settings, RefreshCw, Calculator, Store, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { APP_LIST } from "@/types/application";

const APP_ICONS: Record<string, React.ReactNode> = {
  aketoan: <Calculator className="h-8 w-8" />,
  amall: <Store className="h-8 w-8" />,
  aread: <FileText className="h-8 w-8" />,
};

// Mock data
const mockDetail = (appCode: string, clientId: string) => ({
  status: Number(clientId) % 3 === 0 ? "inactive" as const : "active" as const,
  accountEmail: "user@company.com",
  activationDate: "2024-01-15",
  expiryDate: "2025-01-15",
  package: "Gói Doanh nghiệp",
  usageStats: {
    transactionsThisMonth: 156,
    storageUsed: "2.3 GB / 10 GB",
    lastAccess: "2026-03-22 14:30",
  },
  activityHistory: [
    { date: "2026-03-22", action: "Đăng nhập hệ thống", performedBy: "user@company.com" },
    { date: "2026-03-21", action: "Tạo phiếu thu #PT-0234", performedBy: "user@company.com" },
    { date: "2026-03-20", action: "Xuất báo cáo tháng 3", performedBy: "admin@company.com" },
    { date: "2026-03-18", action: "Cập nhật danh mục tài khoản", performedBy: "user@company.com" },
    { date: "2026-03-15", action: "Đồng bộ dữ liệu hóa đơn", performedBy: "system" },
  ],
});

const mockClients: Record<string, { name: string; taxCode: string }> = {
  "1": { name: "CÔNG TY CỔ PHẦN HTV.BT VIỆT NAM", taxCode: "0316336599" },
  "2": { name: "CÔNG TY TNHH NBC 1 VIETNAM", taxCode: "0301234567" },
};

export default function ApplicationDetailPage() {
  const { clientId, appCode } = useParams<{ clientId: string; appCode: string }>();
  const navigate = useNavigate();

  const app = APP_LIST.find((a) => a.code === appCode);
  if (!app) return <div className="p-8 text-center text-muted-foreground">Ứng dụng không tồn tại</div>;

  const client = mockClients[clientId || ""] || { name: `Khách hàng #${clientId}`, taxCode: "—" };
  const detail = mockDetail(appCode!, clientId || "1");

  const handleAccess = () => {
    window.open(`${app.url}?client=${clientId}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate("/khach-hang")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách khách hàng
      </button>

      {/* Client header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
        <p className="text-sm text-muted-foreground">MST: {client.taxCode}</p>
      </div>

      {/* App info card */}
      <Card className="border-2" style={{ borderColor: app.color + "40" }}>
        <CardContent className="flex items-center gap-5 py-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: app.bgColor, color: app.color }}
          >
            {APP_ICONS[app.code]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold" style={{ color: app.color }}>{app.name}</h2>
              <Badge variant={detail.status === "active" ? "default" : "secondary"}
                className={detail.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                {detail.status === "active" ? "Đang hoạt động" : "Chưa kích hoạt"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{app.fullName}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {detail.status === "active" ? (
              <Button onClick={handleAccess} style={{ backgroundColor: app.color }} className="text-white hover:opacity-90">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Truy cập {app.name}
              </Button>
            ) : (
              <Button style={{ backgroundColor: app.color }} className="text-white hover:opacity-90">
                Kích hoạt tài khoản
              </Button>
            )}
            <Button variant="outline" size="icon"><RefreshCw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      {/* Account info + Usage stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Tài khoản", detail.accountEmail],
              ["Trạng thái", detail.status === "active" ? "Đang hoạt động" : "Chưa kích hoạt"],
              ["Ngày kích hoạt", detail.activationDate],
              ["Ngày hết hạn", detail.expiryDate || "—"],
              ["Gói dịch vụ", detail.package],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Thống kê sử dụng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              ["Giao dịch tháng này", detail.usageStats.transactionsThisMonth.toString()],
              ["Dung lượng đã sử dụng", detail.usageStats.storageUsed],
              ["Truy cập gần nhất", detail.usageStats.lastAccess],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity history */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Lịch sử hoạt động</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Ngày</TableHead>
                <TableHead className="text-xs">Hành động</TableHead>
                <TableHead className="text-xs">Người thực hiện</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.activityHistory.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs">{item.date}</TableCell>
                  <TableCell className="text-xs">{item.action}</TableCell>
                  <TableCell className="text-xs">{item.performedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
