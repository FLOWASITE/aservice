import { useState, useMemo, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Edit, Trash2, FileSignature, Check, AlertTriangle, XCircle, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { Button } from "@/components/ui/button";
import type { Contract, ContractStatus } from "@/types/contract";

interface Props {
  contracts: Contract[];
  isLoading?: boolean;
  onDelete?: (contract: Contract) => void;
}

type SortKey = "clientName" | "contractNumber" | "startDate" | "endDate" | "contractValue" | "feeType" | "status" | "staffName" | "serviceName";
type SortDir = "asc" | "desc";

const formatCurrency = (v: number) => new Intl.NumberFormat("vi-VN").format(v);
const formatDate = (d: string | null) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

function Avatar({ initial, color, size = "sm" }: { initial: string; color: string; size?: "sm" | "xs" }) {
  const dim = size === "sm" ? "h-7 w-7 text-xs" : "h-5 w-5 text-[10px]";
  return (
    <span className={`inline-flex items-center justify-center rounded-full text-white font-semibold shrink-0 ${dim}`} style={{ backgroundColor: color }}>
      {initial}
    </span>
  );
}

function StatusIcon({ status }: { status: ContractStatus }) {
  const config = {
    active: { icon: Check, bg: "bg-emerald-100", color: "text-emerald-600", label: "Đang thực hiện" },
    suspended: { icon: AlertTriangle, bg: "bg-amber-100", color: "text-amber-600", label: "Tạm ngưng" },
    stopped: { icon: XCircle, bg: "bg-red-100", color: "text-red-500", label: "Ngưng" },
  }[status];
  const Icon = config.icon;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${config.bg}`}>
            <Icon className={`h-4 w-4 ${config.color}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent><p>{config.label}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FeeBadge({ feeType, label }: { feeType: string; label: string }) {
  const cls = feeType === "monthly"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

function SortButton({ sortKey, currentSort, onSort }: { sortKey: SortKey; currentSort: { key: SortKey; dir: SortDir } | null; onSort: (key: SortKey) => void }) {
  const isActive = currentSort?.key === sortKey;
  const Icon = isActive ? (currentSort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`ml-1 p-0.5 rounded hover:bg-background/80 transition-colors ${isActive ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"}`}
      title="Sắp xếp"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

const statusLabels: Record<ContractStatus, string> = {
  active: "Đang thực hiện",
  suspended: "Tạm ngưng",
  stopped: "Ngưng",
};

const feeTypeLabels: Record<string, string> = {
  monthly: "Tháng",
  yearly: "Năm",
};

export function ContractDataTable({ contracts, isLoading, onDelete }: Props) {
  const [filters, setFilters] = useState({
    clientName: "", contractNumber: "",
    startFrom: "", startTo: "", endFrom: "", endTo: "",
    valueMin: "", valueMax: "",
    feeType: "", status: "", staffName: "", supportName: "", serviceName: "",
  });
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contract | null>(null);

  const setFilter = useCallback((key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value })), []);

  const hasActiveFilters = useMemo(() => Object.values(filters).some(v => v !== ""), [filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      clientName: "", contractNumber: "",
      startFrom: "", startTo: "", endFrom: "", endTo: "",
      valueMin: "", valueMax: "",
      feeType: "", status: "", staffName: "", supportName: "", serviceName: "",
    });
  }, []);

  const handleSort = useCallback((key: SortKey) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null; // third click removes sort
    });
  }, []);

  const processedData = useMemo(() => {
    // 1. Filter
    let result = contracts.filter((c) => {
      if (filters.clientName && !c.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
      if (filters.contractNumber && !c.contractNumber.toLowerCase().includes(filters.contractNumber.toLowerCase())) return false;
      if (filters.staffName && !c.staffName.toLowerCase().includes(filters.staffName.toLowerCase())) return false;
      if (filters.supportName && !c.supportStaff.some(s => s.name.toLowerCase().includes(filters.supportName.toLowerCase()))) return false;
      if (filters.serviceName && !c.serviceName.toLowerCase().includes(filters.serviceName.toLowerCase())) return false;
      if (filters.feeType && c.feeType !== filters.feeType) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.startFrom && c.startDate < filters.startFrom) return false;
      if (filters.startTo && c.startDate > filters.startTo) return false;
      if (filters.endFrom && (!c.endDate || c.endDate < filters.endFrom)) return false;
      if (filters.endTo && (!c.endDate || c.endDate > filters.endTo)) return false;
      if (filters.valueMin && c.contractValue < Number(filters.valueMin)) return false;
      if (filters.valueMax && c.contractValue > Number(filters.valueMax)) return false;
      return true;
    });

    // 2. Sort
    if (sort) {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        switch (sort.key) {
          case "clientName": cmp = a.clientName.localeCompare(b.clientName, "vi"); break;
          case "contractNumber": cmp = a.contractNumber.localeCompare(b.contractNumber, "vi"); break;
          case "startDate": cmp = (a.startDate || "").localeCompare(b.startDate || ""); break;
          case "endDate": cmp = (a.endDate || "9999").localeCompare(b.endDate || "9999"); break;
          case "contractValue": cmp = a.contractValue - b.contractValue; break;
          case "feeType": cmp = a.feeType.localeCompare(b.feeType); break;
          case "status": cmp = a.status.localeCompare(b.status); break;
          case "staffName": cmp = a.staffName.localeCompare(b.staffName, "vi"); break;
          case "serviceName": cmp = a.serviceName.localeCompare(b.serviceName, "vi"); break;
        }
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [contracts, filters, sort]);

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } = usePagination(processedData);

  return (
    <>
      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Đang lọc: <strong className="text-foreground">{processedData.length}</strong> / {contracts.length} hợp đồng</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" /> Xóa bộ lọc
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {/* Header row with sort */}
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">STT</TableHead>
                <TableHead className="min-w-[200px]">
                  <div className="flex items-center">Khách hàng <SortButton sortKey="clientName" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[150px]">
                  <div className="flex items-center">Số hợp đồng <SortButton sortKey="contractNumber" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div className="flex items-center">Ngày bắt đầu <SortButton sortKey="startDate" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div className="flex items-center">Ngày kết thúc <SortButton sortKey="endDate" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div className="flex items-center justify-end">Giá trị <SortButton sortKey="contractValue" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <div className="flex items-center">Cách tính phí <SortButton sortKey="feeType" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="w-20 text-center">
                  <div className="flex items-center justify-center">Trạng thái <SortButton sortKey="status" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[170px]">
                  <div className="flex items-center">NV phụ trách <SortButton sortKey="staffName" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="min-w-[140px]">NV hỗ trợ</TableHead>
                <TableHead className="min-w-[170px]">
                  <div className="flex items-center">Dịch vụ <SortButton sortKey="serviceName" currentSort={sort} onSort={handleSort} /></div>
                </TableHead>
                <TableHead className="w-24 text-center sticky right-0 bg-muted/50 z-10 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]">Thao tác</TableHead>
              </TableRow>
              {/* Filter row */}
              <TableRow className="bg-muted/20">
                <TableHead />
                <TableHead><Input placeholder="Tìm kiếm..." className="h-7 text-xs" value={filters.clientName} onChange={e => setFilter("clientName", e.target.value)} /></TableHead>
                <TableHead><Input placeholder="Tìm kiếm..." className="h-7 text-xs" value={filters.contractNumber} onChange={e => setFilter("contractNumber", e.target.value)} /></TableHead>
                <TableHead>
                  <div className="flex gap-1">
                    <Input type="date" className="h-7 text-xs flex-1" title="Từ ngày" value={filters.startFrom} onChange={e => setFilter("startFrom", e.target.value)} />
                    <Input type="date" className="h-7 text-xs flex-1" title="Đến ngày" value={filters.startTo} onChange={e => setFilter("startTo", e.target.value)} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex gap-1">
                    <Input type="date" className="h-7 text-xs flex-1" title="Từ ngày" value={filters.endFrom} onChange={e => setFilter("endFrom", e.target.value)} />
                    <Input type="date" className="h-7 text-xs flex-1" title="Đến ngày" value={filters.endTo} onChange={e => setFilter("endTo", e.target.value)} />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex gap-1">
                    <Input type="number" placeholder="Min" className="h-7 text-xs flex-1" value={filters.valueMin} onChange={e => setFilter("valueMin", e.target.value)} />
                    <Input type="number" placeholder="Max" className="h-7 text-xs flex-1" value={filters.valueMax} onChange={e => setFilter("valueMax", e.target.value)} />
                  </div>
                </TableHead>
                <TableHead>
                  <Select value={filters.feeType || "all"} onValueChange={v => setFilter("feeType", v === "all" ? "" : v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Tất cả" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {Object.entries(feeTypeLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead>
                  <Select value={filters.status || "all"} onValueChange={v => setFilter("status", v === "all" ? "" : v)}>
                    <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Tất cả" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead><Input placeholder="Tìm kiếm..." className="h-7 text-xs" value={filters.staffName} onChange={e => setFilter("staffName", e.target.value)} /></TableHead>
                <TableHead><Input placeholder="Tìm kiếm..." className="h-7 text-xs" value={filters.supportName} onChange={e => setFilter("supportName", e.target.value)} /></TableHead>
                <TableHead><Input placeholder="Tìm kiếm..." className="h-7 text-xs" value={filters.serviceName} onChange={e => setFilter("serviceName", e.target.value)} /></TableHead>
                <TableHead className="sticky right-0 bg-muted/20 z-10 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 12 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                    <FileSignature className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Không tìm thấy hợp đồng nào</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((c, idx) => (
                  <TableRow key={c.id} className="hover:bg-muted/30 even:bg-muted/10">
                    <TableCell className="text-center text-sm">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar initial={c.clientInitial} color={c.clientInitialColor} />
                        <span className="text-sm truncate max-w-[160px]">{c.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-primary">{c.contractNumber || "—"}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatDate(c.startDate)}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatDate(c.endDate)}</TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">{formatCurrency(c.contractValue)}</TableCell>
                    <TableCell><FeeBadge feeType={c.feeType} label={c.feeTypeLabel} /></TableCell>
                    <TableCell className="text-center"><StatusIcon status={c.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar initial={c.staffInitial} color={c.staffInitialColor} />
                        <span className="text-sm truncate">{c.staffName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {c.supportStaff.length === 0 ? (
                          <span className="text-sm text-muted-foreground">—</span>
                        ) : (
                          c.supportStaff.map(s => (
                            <TooltipProvider key={s.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span><Avatar initial={s.initial} color={s.color} size="xs" /></span>
                                </TooltipTrigger>
                                <TooltipContent><p>{s.name}</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{c.serviceName}</TableCell>
                    <TableCell className="sticky right-0 bg-card z-10 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-full hover:bg-primary/10" title="Xem"><Eye className="h-4 w-4 text-primary" /></button>
                        <button className="p-1.5 rounded-full hover:bg-primary/10" title="Sửa"><Edit className="h-4 w-4 text-primary" /></button>
                        <button className="p-1.5 rounded-full hover:bg-destructive/10" title="Xóa" onClick={() => setDeleteTarget(c)}><Trash2 className="h-4 w-4 text-destructive" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hợp đồng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hợp đồng <strong>{deleteTarget?.contractNumber || deleteTarget?.clientName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (deleteTarget) onDelete?.(deleteTarget); setDeleteTarget(null); }}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
