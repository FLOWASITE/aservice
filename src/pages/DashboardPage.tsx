import { Users, FileText, Briefcase, Wallet, TrendingUp, TrendingDown, LayoutDashboard, ArrowUpRight, Activity } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";
import { getMockClientList } from "@/mocks/clientMock";
import { mockContracts } from "@/mocks/contractMock";
import { getMockEmployees } from "@/mocks/employeeMock";
import type { ClientStatus } from "@/types/client";

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 16%, 90%)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 4px 12px -2px hsl(220 25% 12% / 0.08)",
};
const axisTickStyle = { fontSize: 11, fill: "hsl(220, 10%, 48%)" };
const gridStroke = "hsl(220, 16%, 92%)";

const formatVND = (v: number) => {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}tỷ`;
  return `${v}tr`;
};

const formatCurrency = (v: number) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} tỷ`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} triệu`;
  return v.toLocaleString("vi-VN") + " ₫";
};

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

export default function DashboardPage() {
  // Dynamic KPI data
  const statuses: ClientStatus[] = ["cho_thuc_hien", "dang_thuc_hien_ke_toan", "dang_thuc_hien_ke_toan_khac", "ngung_thuc_hien"];
  const totalClients = statuses.reduce((sum, s) => sum + getMockClientList(s).total, 0);
  const totalContracts = mockContracts.length;
  const totalEmployees = getMockEmployees("dang_lam_viec").length;
  const totalRevenue = mockContracts.reduce((s, c) => s + (c.contractValue || 0), 0);

  const stats = [
    { label: "Khách hàng", value: totalClients.toString(), icon: Users, gradient: "stat-gradient-blue", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { label: "Hợp đồng", value: totalContracts.toString(), icon: Briefcase, gradient: "stat-gradient-teal", iconBg: "bg-accent/10", iconColor: "text-accent" },
    { label: "Nhân viên", value: totalEmployees.toString(), icon: Users, gradient: "stat-gradient-green", iconBg: "bg-success/10", iconColor: "text-success" },
    { label: "Doanh thu", value: formatCurrency(totalRevenue), icon: Wallet, gradient: "stat-gradient-amber", iconBg: "bg-warning/10", iconColor: "text-warning" },
  ];

  // Revenue by month from contracts
  const revenueByMonth: { month: string; doanh_thu: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthRevenue = mockContracts
      .filter(c => {
        const d = new Date(c.startDate);
        return d.getMonth() + 1 === m;
      })
      .reduce((s, c) => s + (c.contractValue || 0), 0);
    revenueByMonth.push({ month: `T${m}`, doanh_thu: Math.round(monthRevenue / 1_000_000) });
  }
  const hasRevenue = revenueByMonth.some(r => r.doanh_thu > 0);

  // Client growth (cumulative clients by month based on contract start dates)
  const clientGrowthData = (() => {
    const months: { month: string; khach_hang: number }[] = [];
    for (let m = 1; m <= 12; m++) {
      const clientsUpToMonth = new Set(
        mockContracts
          .filter(c => {
            const d = new Date(c.startDate);
            return d.getMonth() + 1 <= m;
          })
          .map(c => c.clientId)
      ).size;
      months.push({ month: `T${m}`, khach_hang: clientsUpToMonth || 0 });
    }
    return months;
  })();
  const hasClientGrowth = clientGrowthData.some(d => d.khach_hang > 0);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="page-header-banner">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-title text-[22px]">Trang điều khiển</h1>
              <p className="page-subtitle">Tổng quan hoạt động hệ thống quản lý dịch vụ kế toán</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              <Activity className="h-3 w-3" />
              Hệ thống hoạt động bình thường
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card-premium ${stat.gradient} group`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-card-title">Doanh thu theo tháng</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Từ hợp đồng dịch vụ (triệu ₫)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium cursor-pointer hover:underline">
            Chi tiết <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
        <div className="chart-card-body">
          <div className="h-[300px]">
            {hasRevenue ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTickStyle} tickFormatter={formatVND} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle}
                    formatter={(value: number) => [`${value} triệu`, "Doanh thu"]}
                  />
                  <Legend formatter={() => "Doanh thu"} iconType="circle" iconSize={8} />
                  <Bar dataKey="doanh_thu" fill="hsl(215, 70%, 42%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Chưa có dữ liệu hợp đồng
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Client Growth */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Tăng trưởng khách hàng</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Số lượng khách hàng theo tháng</p>
            </div>
          </div>
          <div className="chart-card-body">
            <div className="h-[260px]">
              {hasClientGrowth ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clientGrowthData}>
                    <defs>
                      <linearGradient id="colorKH" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle}
                      formatter={(value: number) => [`${value} khách hàng`, "Số lượng"]}
                    />
                    <Area type="monotone" dataKey="khach_hang" stroke="hsl(152, 60%, 42%)" strokeWidth={2.5}
                      fillOpacity={1} fill="url(#colorKH)" dot={{ r: 3, fill: "hsl(152, 60%, 42%)", strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(0, 0%, 100%)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Chưa có dữ liệu khách hàng
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tax Declarations Pie */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Tờ khai thuế theo loại</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Phân bổ theo loại tờ khai</p>
            </div>
          </div>
          <div className="chart-card-body">
            <div className="h-[260px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taxDeclarationData} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                    dataKey="value" nameKey="name" paddingAngle={4} strokeWidth={0}
                  >
                    {taxDeclarationData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle}
                    formatter={(value: number, name: string) => [`${value} tờ khai`, name]}
                  />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-foreground">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Declarations by Month */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-card-title">Tờ khai thuế theo tháng</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Phân loại GTGT, TNCN, TNDN</p>
          </div>
        </div>
        <div className="chart-card-body">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxMonthlyData} barGap={2} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="gtgt" name="GTGT" fill="hsl(215, 70%, 42%)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="tncn" name="TNCN" fill="hsl(152, 60%, 42%)" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="tndn" name="TNDN" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
