import type { PeriodValues } from "@/types/businessStatus";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { LucideIcon } from "lucide-react";

const fmt = (v: number) =>
  v === 0 ? "0" : new Intl.NumberFormat("vi-VN").format(v);

interface Props {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  rows: Record<string, PeriodValues>;
}

export function StatusTable({ title, icon: Icon, iconColor = "text-primary", rows }: Props) {
  const entries = Object.entries(rows);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/20">
            <TableHead className="text-xs font-semibold min-w-[180px]">Chỉ tiêu</TableHead>
            <TableHead className="text-xs font-semibold text-right w-[120px]">Tháng này</TableHead>
            <TableHead className="text-xs font-semibold text-right w-[120px]">Quý này</TableHead>
            <TableHead className="text-xs font-semibold text-right w-[120px]">Lũy kế</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map(([label, vals], idx) => (
            <TableRow key={label} className={idx % 2 === 0 ? "bg-card" : "bg-muted/10"}>
              <TableCell className="text-xs py-2">{label}</TableCell>
              <TableCell className="text-xs text-right tabular-nums py-2">{fmt(vals.month)}</TableCell>
              <TableCell className="text-xs text-right tabular-nums py-2">{fmt(vals.quarter)}</TableCell>
              <TableCell className="text-xs text-right tabular-nums py-2">{fmt(vals.ytd)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
