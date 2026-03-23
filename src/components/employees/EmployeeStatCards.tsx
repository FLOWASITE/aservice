import type { EmployeeStats } from "@/types/employee";
import { Users, PenLine, UsersRound, DollarSign, Copyright } from "lucide-react";

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

interface Props {
  stats: EmployeeStats;
}

export function EmployeeStatCards({ stats }: Props) {
  const cards = [
    {
      icon: Users,
      label: "Khách hàng phụ trách",
      value: stats.khach_hang_phu_trach.toString(),
      gradient: "stat-gradient-red",
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
    {
      icon: PenLine,
      label: "Công nợ",
      value: fmt(stats.cong_no),
      gradient: "stat-gradient-amber",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      suffix: "VNĐ",
    },
    {
      icon: UsersRound,
      label: "Doanh thu DV kế toán",
      value: fmt(stats.doanh_thu_dv_ke_toan),
      gradient: "stat-gradient-blue",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      suffix: "VNĐ",
    },
    {
      icon: DollarSign,
      label: "Doanh thu khác",
      value: fmt(stats.doanh_thu_khac),
      gradient: "stat-gradient-green",
      iconBg: "bg-success/10",
      iconColor: "text-success",
      suffix: "VNĐ",
    },
    {
      icon: Copyright,
      label: "Tổng doanh thu năm",
      value: fmt(stats.tong_doanh_thu_nam),
      gradient: "stat-gradient-teal",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
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
