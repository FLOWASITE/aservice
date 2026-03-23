import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { useEmployeeClients } from "@/hooks/useEmployees";
import type { Employee, EmployeeTotals } from "@/types/employee";

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

function SeniorityBadges({ years, months }: { years: number; months: number }) {
  return (
    <div className="flex items-center gap-1 justify-center flex-wrap">
      {years > 0 && (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "#FCE4EC", color: "#C62828" }}>
          {years} năm
        </span>
      )}
      {(months > 0 || years === 0) && (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: "#E0F2F1", color: "#00695C" }}>
          {months} tháng
        </span>
      )}
    </div>
  );
}

function ExpandedRow({ employeeId }: { employeeId: number }) {
  const { data: clients, isLoading } = useEmployeeClients(employeeId);
  if (isLoading) return <TableRow><TableCell colSpan={16} className="p-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>;
  if (!clients?.length) return <TableRow><TableCell colSpan={16} className="text-center text-muted-foreground py-4 text-sm">Không có khách hàng</TableCell></TableRow>;
  return (
    <>
      {clients.map((c) => (
        <TableRow key={c.id} className="bg-muted/20">
          <TableCell />
          <TableCell />
          <TableCell colSpan={2} className="text-xs">{c.ten}</TableCell>
          <TableCell className="text-xs">{c.ma_so_thue}</TableCell>
          <TableCell className="text-xs">{fmt(c.phi_dich_vu)}</TableCell>
          <TableCell colSpan={10} className="text-xs">{c.trang_thai}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

interface Props {
  employees: Employee[];
  isLoading: boolean;
  totals?: EmployeeTotals;
  onDelete?: (id: number) => void;
}

export function EmployeeDataTable({ employees, isLoading, totals, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } =
    usePagination(employees);

  const setFilter = (key: string, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const defaultTotals: EmployeeTotals = {
    total_clients: employees.reduce((s, e) => s + e.so_luong_dv_ke_toan, 0),
    total_so_luong_dv_ke_toan: employees.reduce((s, e) => s + e.so_luong_dv_ke_toan, 0),
    total_so_luong_dv_khac: employees.reduce((s, e) => s + e.so_luong_dv_khac, 0),
    total_doanh_thu_dv_ke_toan: employees.reduce((s, e) => s + e.doanh_thu_dv_ke_toan, 0),
    total_doanh_thu_dv_khac: employees.reduce((s, e) => s + e.doanh_thu_dv_khac, 0),
    total_cong_no: employees.reduce((s, e) => s + e.cong_no, 0),
  };

  const t = totals || defaultTotals;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border rounded-lg overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            {/* Main header row */}
            <TableRow className="bg-muted/40">
              <TableHead className="w-8" rowSpan={2} />
              <TableHead className="w-12 text-center text-xs font-semibold" rowSpan={2}>STT</TableHead>
              <TableHead className="min-w-[70px] text-xs font-semibold" rowSpan={2}>Mã</TableHead>
              <TableHead className="min-w-[150px] text-xs font-semibold" rowSpan={2}>Tên</TableHead>
              <TableHead className="min-w-[180px] text-xs font-semibold" rowSpan={2}>Email</TableHead>
              <TableHead className="min-w-[90px] text-xs font-semibold" rowSpan={2}>Chức vụ</TableHead>
              <TableHead className="min-w-[80px] text-xs font-semibold" rowSpan={2}>Nhóm</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>Thời gian đã làm việc</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>SL DV kế toán</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>SL DV khác</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>Doanh thu DV KT</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>Doanh thu DV khác</TableHead>
              <TableHead className="text-center text-xs font-semibold border-l" colSpan={1}>Công nợ</TableHead>
              <TableHead className="w-[100px]" rowSpan={2} />
            </TableRow>
            {/* Sub-header filter row */}
            <TableRow className="bg-muted/20">
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.tham_nien || ""} onChange={(e) => setFilter("tham_nien", e.target.value)} />
              </TableHead>
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.sl_ke_toan || ""} onChange={(e) => setFilter("sl_ke_toan", e.target.value)} />
              </TableHead>
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.sl_khac || ""} onChange={(e) => setFilter("sl_khac", e.target.value)} />
              </TableHead>
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.dt_ke_toan || ""} onChange={(e) => setFilter("dt_ke_toan", e.target.value)} />
              </TableHead>
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.dt_khac || ""} onChange={(e) => setFilter("dt_khac", e.target.value)} />
              </TableHead>
              <TableHead className="border-l">
                <Input className="h-6 text-[10px] px-1 w-full" placeholder="Tìm..." value={filters.cong_no || ""} onChange={(e) => setFilter("cong_no", e.target.value)} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-10 text-muted-foreground text-sm">Không tìm thấy</TableCell>
              </TableRow>
            ) : (
              paginatedData.map((emp, idx) => (
                <>
                  <TableRow
                    key={emp.id}
                    className="hover:bg-muted/20 cursor-pointer transition-colors"
                    onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                  >
                    <TableCell className="text-center px-2">
                      {expandedId === emp.id
                        ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                        : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-center text-xs tabular-nums">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell className="text-xs font-mono">{emp.ma}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0"
                          style={{ backgroundColor: emp.avatar_color }}
                        >
                          {emp.ho_ten.charAt(0)}
                        </div>
                        <span className="text-xs font-medium truncate">{emp.ho_ten}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{emp.email}</TableCell>
                    <TableCell className="text-xs">{emp.chuc_vu}</TableCell>
                    <TableCell className="text-xs">{emp.nhom}</TableCell>
                    <TableCell className="border-l">
                      <SeniorityBadges years={emp.tham_nien.years} months={emp.tham_nien.months} />
                    </TableCell>
                    <TableCell className="text-center text-xs tabular-nums border-l">{emp.so_luong_dv_ke_toan}</TableCell>
                    <TableCell className="text-center text-xs tabular-nums border-l">{emp.so_luong_dv_khac}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums border-l">{fmt(emp.doanh_thu_dv_ke_toan)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums border-l">{fmt(emp.doanh_thu_dv_khac)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums border-l">{fmt(emp.cong_no)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete?.(emp.id); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedId === emp.id && <ExpandedRow employeeId={emp.id} />}
                </>
              ))
            )}
            {paginatedData.length > 0 && (
              <TableRow className="bg-muted/40 font-semibold">
                <TableCell />
                <TableCell />
                <TableCell colSpan={5} className="text-xs">Tổng: {t.total_clients} khách hàng</TableCell>
                <TableCell className="border-l" />
                <TableCell className="text-center text-xs tabular-nums border-l">{fmt(t.total_so_luong_dv_ke_toan)}</TableCell>
                <TableCell className="text-center text-xs tabular-nums border-l">{fmt(t.total_so_luong_dv_khac)}</TableCell>
                <TableCell className="text-right text-xs tabular-nums border-l">{fmt(t.total_doanh_thu_dv_ke_toan)}</TableCell>
                <TableCell className="text-right text-xs tabular-nums border-l">{fmt(t.total_doanh_thu_dv_khac)}</TableCell>
                <TableCell className="text-right text-xs tabular-nums border-l">{fmt(t.total_cong_no)}</TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        pageSizeOptions={pageSizeOptions}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
