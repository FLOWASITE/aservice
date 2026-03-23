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
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: "text-foreground",
    },
    {
      icon: PenLine,
      label: "Công nợ",
      value: fmt(stats.cong_no),
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      valueColor: "text-foreground",
    },
    {
      icon: UsersRound,
      label: "Doanh thu DV kế toán",
      value: `${fmt(stats.doanh_thu_dv_ke_toan)} VNĐ`,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-primary",
    },
    {
      icon: DollarSign,
      label: "Doanh thu khác",
      value: `${fmt(stats.doanh_thu_khac)} VNĐ`,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      valueColor: "text-success",
    },
    {
      icon: Copyright,
      label: "Tổng doanh thu theo năm",
      value: `${fmt(stats.tong_doanh_thu_nam)} VNĐ`,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-card p-3.5 flex items-center gap-3"
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
            <card.icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground leading-tight">{card.label}</p>
            <p className={`font-bold text-sm mt-0.5 truncate ${card.valueColor}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
