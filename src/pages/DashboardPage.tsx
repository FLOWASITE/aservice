import { Users, FileText, Building2, Wallet, TrendingUp, TrendingDown, LayoutDashboard, ArrowUpRight, Activity } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from "recharts";

const stats = [
  { label: "Khách hàng", value: "132", icon: Users, change: "+12%", up: true, gradient: "stat-gradient-blue", iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Tờ khai thuế", value: "45", icon: FileText, change: "+5%", up: true, gradient: "stat-gradient-teal", iconBg: "bg-accent/10", iconColor: "text-accent" },
  { label: "Doanh nghiệp", value: "86", icon: Building2, change: "+3%", up: true, gradient: "stat-gradient-green", iconBg: "bg-success/10", iconColor: "text-success" },
  { label: "Công nợ", value: "₫1.2B", icon: Wallet, change: "-8%", up: false, gradient: "stat-gradient-amber", iconBg: "bg-warning/10", iconColor: "text-warning" },
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

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 16%, 90%)",
  borderRadius: 10,
  fontSize: 12,
  boxShadow: "0 4px 12px -2px hsl(220 25% 12% / 0.08)",
};

const axisTickStyle = { fontSize: 11, fill: "hsl(220, 10%, 48%)" };
const gridStroke = "hsl(220, 16%, 92%)";

export default function DashboardPage() {
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
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                stat.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}>
                {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </span>
              <span className="text-[10px] text-muted-foreground">so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <div>
            <h3 className="chart-card-title">Doanh thu & Chi phí</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Theo tháng (triệu ₫)</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium cursor-pointer hover:underline">
            Chi tiết <ArrowUpRight className="h-3 w-3" />
          </span>
        </div>
        <div className="chart-card-body">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={6} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" tick={axisTickStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisTickStyle} tickFormatter={formatVND} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => [`${value} triệu`, name === "doanh_thu" ? "Doanh thu" : "Chi phí"]}
                />
                <Legend formatter={(value) => (value === "doanh_thu" ? "Doanh thu" : "Chi phí")} iconType="circle" iconSize={8} />
                <Bar dataKey="doanh_thu" fill="hsl(215, 70%, 42%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="chi_phi" fill="hsl(195, 70%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
