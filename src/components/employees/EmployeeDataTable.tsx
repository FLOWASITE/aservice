import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Trash2, Eye, Search, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { useEmployeeClients } from "@/hooks/useEmployees";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Employee, EmployeeTotals, EmployeeClient } from "@/types/employee";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { useEmployeeClients } from "@/hooks/useEmployees";
import type { Employee, EmployeeTotals } from "@/types/employee";

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

type SortKey = "ma" | "ho_ten" | "email" | "chuc_vu" | "nhom" | "tham_nien" | "so_luong_dv_ke_toan" | "so_luong_dv_khac" | "doanh_thu_dv_ke_toan" | "doanh_thu_dv_khac" | "cong_no";
type SortDir = "asc" | "desc";

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
  if (isLoading) return <TableRow><TableCell colSpan={14} className="p-4"><Skeleton className="h-8 w-full" /></TableCell></TableRow>;
  if (!clients?.length) return <TableRow><TableCell colSpan={14} className="text-center text-muted-foreground py-4 text-sm">Không có khách hàng</TableCell></TableRow>;
  return (
    <>
      {clients.map((c) => (
        <TableRow key={c.id} className="bg-muted/20">
          <TableCell />
          <TableCell />
          <TableCell colSpan={2} className="text-xs">{c.ten}</TableCell>
          <TableCell className="text-xs">{c.ma_so_thue}</TableCell>
          <TableCell className="text-xs">{fmt(c.phi_dich_vu)}</TableCell>
          <TableCell colSpan={8} className="text-xs">{c.trang_thai}</TableCell>
        </TableRow>
      ))}
    </>
  );
}

function SortBtn({ sortKey, current, onSort }: { sortKey: SortKey; current: { key: SortKey; dir: SortDir } | null; onSort: (k: SortKey) => void }) {
  const active = current?.key === sortKey;
  const Icon = active ? (current.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button type="button" onClick={(e) => { e.stopPropagation(); onSort(sortKey); }}
      className={`ml-0.5 p-0.5 rounded hover:bg-background/80 ${active ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground"}`}>
      <Icon className="h-3 w-3" />
    </button>
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
  const [globalSearch, setGlobalSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    slKeToanMin: "", slKeToanMax: "",
    slKhacMin: "", slKhacMax: "",
    dtKeToanMin: "", dtKeToanMax: "",
    dtKhacMin: "", dtKhacMax: "",
    congNoMin: "", congNoMax: "",
  });
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);

  const setFilter = useCallback((key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value })), []);

  const hasActiveFilters = useMemo(() => globalSearch !== "" || Object.values(filters).some(v => v !== ""), [globalSearch, filters]);

  const clearAll = useCallback(() => {
    setGlobalSearch("");
    setFilters({ slKeToanMin: "", slKeToanMax: "", slKhacMin: "", slKhacMax: "", dtKeToanMin: "", dtKeToanMax: "", dtKhacMin: "", dtKhacMax: "", congNoMin: "", congNoMax: "" });
  }, []);

  const handleSort = useCallback((key: SortKey) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }, []);

  const processedData = useMemo(() => {
    const q = globalSearch.toLowerCase().trim();

    let result = employees.filter((e) => {
      // Global search
      if (q) {
        const searchable = [e.ma, e.ho_ten, e.email, e.chuc_vu, e.nhom].join(" ").toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      // Range filters
      if (filters.slKeToanMin && e.so_luong_dv_ke_toan < Number(filters.slKeToanMin)) return false;
      if (filters.slKeToanMax && e.so_luong_dv_ke_toan > Number(filters.slKeToanMax)) return false;
      if (filters.slKhacMin && e.so_luong_dv_khac < Number(filters.slKhacMin)) return false;
      if (filters.slKhacMax && e.so_luong_dv_khac > Number(filters.slKhacMax)) return false;
      if (filters.dtKeToanMin && e.doanh_thu_dv_ke_toan < Number(filters.dtKeToanMin)) return false;
      if (filters.dtKeToanMax && e.doanh_thu_dv_ke_toan > Number(filters.dtKeToanMax)) return false;
      if (filters.dtKhacMin && e.doanh_thu_dv_khac < Number(filters.dtKhacMin)) return false;
      if (filters.dtKhacMax && e.doanh_thu_dv_khac > Number(filters.dtKhacMax)) return false;
      if (filters.congNoMin && e.cong_no < Number(filters.congNoMin)) return false;
      if (filters.congNoMax && e.cong_no > Number(filters.congNoMax)) return false;
      return true;
    });

    // Sort
    if (sort) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        switch (sort.key) {
          case "ma": cmp = a.ma.localeCompare(b.ma); break;
          case "ho_ten": cmp = a.ho_ten.localeCompare(b.ho_ten, "vi"); break;
          case "email": cmp = a.email.localeCompare(b.email); break;
          case "chuc_vu": cmp = a.chuc_vu.localeCompare(b.chuc_vu, "vi"); break;
          case "nhom": cmp = a.nhom.localeCompare(b.nhom, "vi"); break;
          case "tham_nien": cmp = (a.tham_nien.years * 12 + a.tham_nien.months) - (b.tham_nien.years * 12 + b.tham_nien.months); break;
          case "so_luong_dv_ke_toan": cmp = a.so_luong_dv_ke_toan - b.so_luong_dv_ke_toan; break;
          case "so_luong_dv_khac": cmp = a.so_luong_dv_khac - b.so_luong_dv_khac; break;
          case "doanh_thu_dv_ke_toan": cmp = a.doanh_thu_dv_ke_toan - b.doanh_thu_dv_ke_toan; break;
          case "doanh_thu_dv_khac": cmp = a.doanh_thu_dv_khac - b.doanh_thu_dv_khac; break;
          case "cong_no": cmp = a.cong_no - b.cong_no; break;
        }
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [employees, globalSearch, filters, sort]);

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } =
    usePagination(processedData);

  const defaultTotals: EmployeeTotals = {
    total_clients: processedData.reduce((s, e) => s + e.so_luong_dv_ke_toan, 0),
    total_so_luong_dv_ke_toan: processedData.reduce((s, e) => s + e.so_luong_dv_ke_toan, 0),
    total_so_luong_dv_khac: processedData.reduce((s, e) => s + e.so_luong_dv_khac, 0),
    total_doanh_thu_dv_ke_toan: processedData.reduce((s, e) => s + e.doanh_thu_dv_ke_toan, 0),
    total_doanh_thu_dv_khac: processedData.reduce((s, e) => s + e.doanh_thu_dv_khac, 0),
    total_cong_no: processedData.reduce((s, e) => s + e.cong_no, 0),
  };
  const t = totals || defaultTotals;

  const advancedCount = useMemo(() => Object.values(filters).filter(v => v !== "").length, [filters]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search bar + advanced filters toggle */}
      <div className="flex items-center gap-3">
        <div className="premium-search flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã, tên, email, chức vụ, nhóm..."
              className="pl-9 h-9 border-0 shadow-none focus-visible:ring-0"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          {globalSearch && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted" onClick={() => setGlobalSearch("")}>
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          </div>
        </div>

        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="sm"
          className="h-9 text-xs shrink-0"
          onClick={() => setShowAdvanced(prev => !prev)}
        >
          Bộ lọc nâng cao
          {advancedCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {advancedCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm ml-auto">
            <span className="text-muted-foreground">
              Kết quả: <strong className="text-foreground">{processedData.length}</strong> / {employees.length}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={clearAll}>
              <X className="h-3 w-3 mr-1" /> Xóa lọc
            </Button>
          </div>
        )}
      </div>

      {/* Advanced filter panel */}
      {showAdvanced && (
        <div className="glass-panel grid grid-cols-2 lg:grid-cols-5 gap-3 p-4">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">SL DV kế toán</label>
            <div className="flex gap-1">
              <Input type="number" placeholder="Min" className="h-7 text-xs" value={filters.slKeToanMin} onChange={e => setFilter("slKeToanMin", e.target.value)} />
              <Input type="number" placeholder="Max" className="h-7 text-xs" value={filters.slKeToanMax} onChange={e => setFilter("slKeToanMax", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">SL DV khác</label>
            <div className="flex gap-1">
              <Input type="number" placeholder="Min" className="h-7 text-xs" value={filters.slKhacMin} onChange={e => setFilter("slKhacMin", e.target.value)} />
              <Input type="number" placeholder="Max" className="h-7 text-xs" value={filters.slKhacMax} onChange={e => setFilter("slKhacMax", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Doanh thu DV KT</label>
            <div className="flex gap-1">
              <Input type="number" placeholder="Min" className="h-7 text-xs" value={filters.dtKeToanMin} onChange={e => setFilter("dtKeToanMin", e.target.value)} />
              <Input type="number" placeholder="Max" className="h-7 text-xs" value={filters.dtKeToanMax} onChange={e => setFilter("dtKeToanMax", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Doanh thu DV khác</label>
            <div className="flex gap-1">
              <Input type="number" placeholder="Min" className="h-7 text-xs" value={filters.dtKhacMin} onChange={e => setFilter("dtKhacMin", e.target.value)} />
              <Input type="number" placeholder="Max" className="h-7 text-xs" value={filters.dtKhacMax} onChange={e => setFilter("dtKhacMax", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Công nợ</label>
            <div className="flex gap-1">
              <Input type="number" placeholder="Min" className="h-7 text-xs" value={filters.congNoMin} onChange={e => setFilter("congNoMin", e.target.value)} />
              <Input type="number" placeholder="Max" className="h-7 text-xs" value={filters.congNoMax} onChange={e => setFilter("congNoMax", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="premium-table-wrapper overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-8" />
              <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
              <TableHead className="min-w-[70px] text-xs font-semibold">
                <div className="flex items-center">Mã <SortBtn sortKey="ma" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="min-w-[150px] text-xs font-semibold">
                <div className="flex items-center">Tên <SortBtn sortKey="ho_ten" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="min-w-[180px] text-xs font-semibold">
                <div className="flex items-center">Email <SortBtn sortKey="email" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="min-w-[90px] text-xs font-semibold">
                <div className="flex items-center">Chức vụ <SortBtn sortKey="chuc_vu" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="min-w-[80px] text-xs font-semibold">
                <div className="flex items-center">Nhóm <SortBtn sortKey="nhom" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">Thâm niên <SortBtn sortKey="tham_nien" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">SL DV KT <SortBtn sortKey="so_luong_dv_ke_toan" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">SL DV khác <SortBtn sortKey="so_luong_dv_khac" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">DT DV KT <SortBtn sortKey="doanh_thu_dv_ke_toan" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">DT DV khác <SortBtn sortKey="doanh_thu_dv_khac" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="text-center text-xs font-semibold border-l">
                <div className="flex items-center justify-center">Công nợ <SortBtn sortKey="cong_no" current={sort} onSort={handleSort} /></div>
              </TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-10 text-muted-foreground text-sm">
                  {hasActiveFilters ? (
                    <>
                      Không tìm thấy nhân viên phù hợp
                      <br />
                      <Button variant="link" size="sm" className="mt-1 text-xs" onClick={clearAll}>Xóa bộ lọc</Button>
                    </>
                  ) : "Không tìm thấy"}
                </TableCell>
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
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0" style={{ backgroundColor: emp.avatar_color }}>
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
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary"><Pencil className="h-3.5 w-3.5" /></Button>
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
