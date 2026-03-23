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
import type { Employee } from "@/types/employee";

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

function ExpandedRow({ employeeId }: { employeeId: number }) {
  const { data: clients, isLoading } = useEmployeeClients(employeeId);
  if (isLoading) return <TableRow><TableCell colSpan={15} className="p-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>;
  if (!clients?.length) return <TableRow><TableCell colSpan={15} className="text-center text-muted-foreground py-4 text-sm">Không có khách hàng</TableCell></TableRow>;
  return (
    <>
      {clients.map((c) => (
        <TableRow key={c.id} className="bg-muted/20">
          <TableCell />
          <TableCell />
          <TableCell colSpan={2} className="text-xs">{c.ten}</TableCell>
          <TableCell className="text-xs">{c.ma_so_thue}</TableCell>
          <TableCell className="text-xs">{fmt(c.phi_dich_vu)}</TableCell>
          <TableCell colSpan={9} className="text-xs">{c.trang_thai}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

interface Props {
  employees: Employee[];
  isLoading: boolean;
  onDelete?: (id: number) => void;
}

export function EmployeeDataTable({ employees, isLoading, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } =
    usePagination(employees);

  const setFilter = (key: string, value: string) => setFilters((f) => ({ ...f, [key]: value }));

  const totals = {
    doanh_thu_ke_toan: employees.reduce((s, e) => s + e.doanh_thu_dv_ke_toan_min, 0),
    cong_no: employees.reduce((s, e) => s + e.cong_no_min, 0),
    clients: employees.length > 0 ? 119 : 0,
  };

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
            <TableRow className="bg-muted/40">
              <TableHead className="w-8" />
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="min-w-[70px] text-xs font-semibold">Mã</TableHead>
              <TableHead className="min-w-[150px] text-xs font-semibold">Tên</TableHead>
              <TableHead className="min-w-[150px] text-xs font-semibold">Email</TableHead>
              <TableHead className="min-w-[100px] text-xs font-semibold">Chức vụ</TableHead>
              <TableHead className="min-w-[100px] text-xs font-semibold">Nhóm</TableHead>
              <TableHead className="text-center text-xs font-semibold" colSpan={2}>Thời gian làm việc</TableHead>
              <TableHead className="text-center text-xs font-semibold" colSpan={2}>SL DV kế toán</TableHead>
              <TableHead className="text-center text-xs font-semibold" colSpan={2}>Doanh thu DV KT</TableHead>
              <TableHead className="text-center text-xs font-semibold" colSpan={2}>Công nợ</TableHead>
              <TableHead className="w-[90px]" />
            </TableRow>
            {/* Sub-header filters */}
            <TableRow className="bg-muted/20">
              <TableHead />
              <TableHead />
              <TableHead>
                <Input className="h-6 text-xs px-1.5" placeholder="Tìm..." value={filters.ma || ""} onChange={(e) => setFilter("ma", e.target.value)} />
              </TableHead>
              <TableHead>
                <Input className="h-6 text-xs px-1.5" placeholder="Tìm..." value={filters.ten || ""} onChange={(e) => setFilter("ten", e.target.value)} />
              </TableHead>
              <TableHead>
                <Input className="h-6 text-xs px-1.5" placeholder="Tìm..." value={filters.email || ""} onChange={(e) => setFilter("email", e.target.value)} />
              </TableHead>
              <TableHead>
                <Input className="h-6 text-xs px-1.5" placeholder="Tìm..." value={filters.chuc_vu || ""} onChange={(e) => setFilter("chuc_vu", e.target.value)} />
              </TableHead>
              <TableHead>
                <Input className="h-6 text-xs px-1.5" placeholder="Tìm..." value={filters.nhom || ""} onChange={(e) => setFilter("nhom", e.target.value)} />
              </TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối thiểu</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối đa</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối thiểu</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối đa</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối thiểu</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối đa</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối thiểu</TableHead>
              <TableHead className="text-center text-[10px] text-muted-foreground font-normal">Tối đa</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-10 text-muted-foreground text-sm">Không tìm thấy</TableCell>
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
                    <TableCell className="text-center text-xs tabular-nums">{emp.thoi_gian_lam_viec_min}</TableCell>
                    <TableCell className="text-center text-xs tabular-nums">{emp.thoi_gian_lam_viec_max}</TableCell>
                    <TableCell className="text-center text-xs tabular-nums">{emp.so_luong_dv_ke_toan_min}</TableCell>
                    <TableCell className="text-center text-xs tabular-nums">{emp.so_luong_dv_ke_toan_max}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{fmt(emp.doanh_thu_dv_ke_toan_min)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{fmt(emp.doanh_thu_dv_ke_toan_max)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{fmt(emp.cong_no_min)}</TableCell>
                    <TableCell className="text-right text-xs tabular-nums">{fmt(emp.cong_no_max)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete?.(emp.id); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-success hover:text-success">
                          <Eye className="h-3.5 w-3.5" />
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
                <TableCell colSpan={3} className="text-xs">Tổng: {totals.clients} khách hàng</TableCell>
                <TableCell colSpan={6} />
                <TableCell colSpan={2} className="text-right text-xs tabular-nums">{fmt(totals.doanh_thu_ke_toan)}</TableCell>
                <TableCell colSpan={2} className="text-right text-xs tabular-nums">{fmt(totals.cong_no)}</TableCell>
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
