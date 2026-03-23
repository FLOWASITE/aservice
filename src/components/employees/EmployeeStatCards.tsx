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
      accent: "bg-destructive/10 text-destructive",
      border: "border-destructive/30",
    },
    {
      icon: PenLine,
      label: "Công nợ",
      value: fmt(stats.cong_no),
      accent: "bg-warning/10 text-warning",
      border: "border-warning/30",
    },
    {
      icon: UsersRound,
      label: "Doanh thu DV kế toán",
      value: `${fmt(stats.doanh_thu_dv_ke_toan)} VNĐ`,
      accent: "bg-primary/10 text-primary",
      border: "border-primary/30",
      large: true,
    },
    {
      icon: DollarSign,
      label: "Doanh thu khác",
      value: `${fmt(stats.doanh_thu_khac)} VNĐ`,
      accent: "bg-success/10 text-success",
      border: "border-success/30",
      large: true,
    },
    {
      icon: Copyright,
      label: "Tổng doanh thu theo năm",
      value: `${fmt(stats.tong_doanh_thu_nam)} VNĐ`,
      accent: "bg-destructive/10 text-destructive",
      border: "border-destructive/30",
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
            <p className={`font-bold truncate ${card.large ? "text-sm text-primary" : "text-xl"}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
