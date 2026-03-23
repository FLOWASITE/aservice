import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, Wallet } from "lucide-react";

const stats = [
  { label: "Khách hàng", value: "128", icon: Users, change: "+12%" },
  { label: "Tờ khai thuế", value: "45", icon: FileText, change: "+5%" },
  { label: "Doanh nghiệp", value: "86", icon: Building2, change: "+3%" },
  { label: "Công nợ", value: "₫1.2B", icon: Wallet, change: "-8%" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trang điều khiển</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tổng quan hoạt động hệ thống quản lý dịch vụ kế toán
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.change.startsWith("+") ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>{" "}
                so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu hoạt động.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nhắc nhở</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Không có nhắc nhở nào.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
