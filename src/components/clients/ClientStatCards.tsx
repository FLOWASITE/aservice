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
      accent: "bg-destructive/10 text-destructive",
      border: "border-destructive/30",
    },
    {
      icon: UserCog,
      label: "Nhân viên",
      value: stats.nhan_vien.toString(),
      accent: "bg-muted text-muted-foreground",
      border: "border-border",
    },
    {
      icon: Layers,
      label: "Nhóm",
      value: stats.nhom.toString(),
      accent: "bg-primary/10 text-primary",
      border: "border-primary/30",
    },
    {
      icon: DollarSign,
      label: "Doanh thu theo tháng",
      value: formatCurrency(stats.doanh_thu_thang),
      accent: "bg-accent/10 text-accent",
      border: "border-accent/30",
      large: true,
    },
    {
      icon: TrendingUp,
      label: "Doanh thu theo năm",
      value: formatCurrency(stats.doanh_thu_nam),
      accent: "bg-success/10 text-success",
      border: "border-success/30",
      large: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-lg border p-4 bg-card flex items-center gap-3 ${card.border}`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.accent}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground truncate">{card.label}</p>
            <p className={`font-bold truncate ${card.large ? "text-lg text-primary" : "text-xl"}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
