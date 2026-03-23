import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Building2, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const stats = [
  { label: "Khách hàng", value: "132", icon: Users, change: "+12%", up: true },
  { label: "Tờ khai thuế", value: "45", icon: FileText, change: "+5%", up: true },
  { label: "Doanh nghiệp", value: "86", icon: Building2, change: "+3%", up: true },
  { label: "Công nợ", value: "₫1.2B", icon: Wallet, change: "-8%", up: false },
];

const revenueData = [
  { month: "T1", doanh_thu: 680, chi_phi: 420 },
  { month: "T2", doanh_thu: 750, chi_phi: 380 },
  { month: "T3", doanh_thu: 820, chi_phi: 450 },
  { month: "T4", doanh_thu: 910, chi_phi: 470 },
  { month: "T5", doanh_thu: 780, chi_phi: 430 },
  { month: "T6", doanh_thu: 950, chi_phi: 510 },
  { month: "T7", doanh_thu: 1020, chi_phi: 480 },
  { month: "T8", doanh_thu: 890, chi_phi: 460 },
  { month: "T9", doanh_thu: 1100, chi_phi: 520 },
  { month: "T10", doanh_thu: 1050, chi_phi: 490 },
  { month: "T11", doanh_thu: 1180, chi_phi: 540 },
  { month: "T12", doanh_thu: 1250, chi_phi: 560 },
];

const clientGrowthData = [
  { month: "T1", khach_hang: 95 },
  { month: "T2", khach_hang: 98 },
  { month: "T3", khach_hang: 102 },
  { month: "T4", khach_hang: 108 },
  { month: "T5", khach_hang: 110 },
  { month: "T6", khach_hang: 115 },
  { month: "T7", khach_hang: 118 },
  { month: "T8", khach_hang: 120 },
  { month: "T9", khach_hang: 125 },
  { month: "T10", khach_hang: 128 },
  { month: "T11", khach_hang: 130 },
  { month: "T12", khach_hang: 132 },
];

const taxDeclarationData = [
  { name: "GTGT", value: 18, color: "hsl(215, 70%, 42%)" },
  { name: "TNCN", value: 12, color: "hsl(152, 60%, 42%)" },
  { name: "TNDN", value: 8, color: "hsl(38, 92%, 50%)" },
  { name: "Khác", value: 7, color: "hsl(195, 70%, 45%)" },
];

const taxMonthlyData = [
  { month: "T1", gtgt: 3, tncn: 2, tndn: 1 },
  { month: "T2", gtgt: 4, tncn: 2, tndn: 1 },
  { month: "T3", gtgt: 5, tncn: 3, tndn: 2 },
  { month: "T4", gtgt: 4, tncn: 3, tndn: 1 },
  { month: "T5", gtgt: 3, tncn: 2, tndn: 2 },
  { month: "T6", gtgt: 5, tncn: 4, tndn: 2 },
  { month: "T7", gtgt: 4, tncn: 3, tndn: 1 },
  { month: "T8", gtgt: 3, tncn: 2, tndn: 2 },
  { month: "T9", gtgt: 5, tncn: 3, tndn: 2 },
  { month: "T10", gtgt: 4, tncn: 3, tndn: 1 },
  { month: "T11", gtgt: 6, tncn: 4, tndn: 2 },
  { month: "T12", gtgt: 5, tncn: 3, tndn: 2 },
];

const formatVND = (v: number) => `${v}tr`;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Trang điều khiển</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Tổng quan hoạt động hệ thống quản lý dịch vụ kế toán
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Doanh thu & Chi phí theo tháng (triệu ₫)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} tickFormatter={formatVND} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 88%)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} triệu`,
                    name === "doanh_thu" ? "Doanh thu" : "Chi phí",
                  ]}
                />
                <Legend
                  formatter={(value) => (value === "doanh_thu" ? "Doanh thu" : "Chi phí")}
                />
                <Bar dataKey="doanh_thu" fill="hsl(215, 70%, 42%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chi_phi" fill="hsl(195, 70%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Client Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tăng trưởng khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 88%)",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                    formatter={(value: number) => [`${value} khách hàng`, "Số lượng"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="khach_hang"
                    stroke="hsl(152, 60%, 42%)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "hsl(152, 60%, 42%)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tax Declarations Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tờ khai thuế theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxDeclarationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {taxDeclarationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(214, 20%, 88%)",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                    formatter={(value: number, name: string) => [`${value} tờ khai`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Declarations by Month */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tờ khai thuế theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxMonthlyData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(215, 12%, 50%)" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 88%)",
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Legend />
                <Bar dataKey="gtgt" name="GTGT" fill="hsl(215, 70%, 42%)" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="tncn" name="TNCN" fill="hsl(152, 60%, 42%)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="tndn" name="TNDN" fill="hsl(38, 92%, 50%)" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
