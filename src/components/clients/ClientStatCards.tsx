import type { ClientStats } from "@/types/client";
import { Users, UserCog, Layers, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  stats: ClientStats;
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN").format(v);

export function ClientStatCards({ stats }: Props) {
  const cards = [
    {
      icon: Users,
      label: "Khách hàng đã đăng ký",
      value: stats.khach_hang_da_dang_ky.toString(),
      gradient: "stat-gradient-red",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    {
      icon: UserCog,
      label: "Nhân viên",
      value: stats.nhan_vien.toString(),
      gradient: "stat-gradient-blue",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Layers,
      label: "Nhóm",
      value: stats.nhom.toString(),
      gradient: "stat-gradient-teal",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: DollarSign,
      label: "Doanh thu theo tháng",
      value: formatCurrency(stats.doanh_thu_thang),
      gradient: "stat-gradient-amber",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      suffix: "VNĐ",
    },
    {
      icon: TrendingUp,
      label: "Doanh thu theo năm",
      value: formatCurrency(stats.doanh_thu_nam),
      gradient: "stat-gradient-green",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      suffix: "VNĐ",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`premium-card ${card.gradient} group`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}>
              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider truncate">{card.label}</p>
              <p className="font-bold text-lg leading-tight truncate text-foreground">
                {card.value}
              </p>
              {card.suffix && (
                <p className="text-[10px] text-muted-foreground">{card.suffix}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
