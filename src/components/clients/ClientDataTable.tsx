import { useState, useMemo, useCallback } from "react";
import type { Client } from "@/types/client";
import { AppIcons } from "./AppIcons";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, PlusCircle, Search, SlidersHorizontal, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  clients: Client[];
  isLoading?: boolean;
  showCreateContract?: boolean;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
  onCreateContract?: (client: Client) => void;
}

const formatNumber = (v: number) =>
  v === 0 ? "0" : new Intl.NumberFormat("vi-VN").format(v);

type SortKey = "ten" | "nhom" | "nhan_vien_phu_trach" | "phi_dich_vu_toi_thieu" | "phi_dich_vu_toi_da" | "cong_no" | "hoa_don_di";
type SortDir = "asc" | "desc";

function SortButton({ label, sortKey, current, onSort }: { label: string; sortKey: SortKey; current: { key: SortKey; dir: SortDir } | null; onSort: (key: SortKey) => void }) {
  const active = current?.key === sortKey;
  const Icon = active ? (current.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => onSort(sortKey)}>
      <span>{label}</span>
      <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground/50"}`} />
    </button>
  );
}

export function ClientDataTable({ clients, isLoading, showCreateContract, onEditClient, onDeleteClient, onCreateContract }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState({
    feeMin: "", feeMax: "", feeMaxMin: "", feeMaxMax: "", congNoMin: "", congNoMax: "",
  });
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);

  const handleSort = useCallback((key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.values(advFilters).filter(Boolean).length;
  }, [advFilters]);

  const clearFilters = useCallback(() => {
    setAdvFilters({ feeMin: "", feeMax: "", feeMaxMin: "", feeMaxMax: "", congNoMin: "", congNoMax: "" });
    setGlobalSearch("");
  }, []);

  const processedData = useMemo(() => {
    let result = [...clients];

    // Global search
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      result = result.filter((c) =>
        c.ten.toLowerCase().includes(q) ||
        c.ten_viet_tat.toLowerCase().includes(q) ||
        c.nhom.toLowerCase().includes(q) ||
        c.nhan_vien_phu_trach.toLowerCase().includes(q) ||
        c.nhan_vien_ho_tro.some((nv) => nv.toLowerCase().includes(q))
      );
    }

    // Advanced filters
    const { feeMin, feeMax, feeMaxMin, feeMaxMax, congNoMin, congNoMax } = advFilters;
    if (feeMin) result = result.filter((c) => c.phi_dich_vu_toi_thieu >= Number(feeMin));
    if (feeMax) result = result.filter((c) => c.phi_dich_vu_toi_thieu <= Number(feeMax));
    if (feeMaxMin) result = result.filter((c) => c.phi_dich_vu_toi_da >= Number(feeMaxMin));
    if (feeMaxMax) result = result.filter((c) => c.phi_dich_vu_toi_da <= Number(feeMaxMax));
    if (congNoMin) result = result.filter((c) => c.cong_no >= Number(congNoMin));
    if (congNoMax) result = result.filter((c) => c.cong_no <= Number(congNoMax));

    // Sort
    if (sort) {
      const dir = sort.dir === "asc" ? 1 : -1;
      result.sort((a, b) => {
        let cmp = 0;
        switch (sort.key) {
          case "ten": cmp = a.ten.localeCompare(b.ten, "vi"); break;
          case "nhom": cmp = a.nhom.localeCompare(b.nhom, "vi"); break;
          case "nhan_vien_phu_trach": cmp = a.nhan_vien_phu_trach.localeCompare(b.nhan_vien_phu_trach, "vi"); break;
          case "phi_dich_vu_toi_thieu": cmp = a.phi_dich_vu_toi_thieu - b.phi_dich_vu_toi_thieu; break;
          case "phi_dich_vu_toi_da": cmp = a.phi_dich_vu_toi_da - b.phi_dich_vu_toi_da; break;
          case "cong_no": cmp = a.cong_no - b.cong_no; break;
          case "hoa_don_di": cmp = a.hoa_don_di - b.hoa_don_di; break;
        }
        return cmp * dir;
      });
    }

    return result;
  }, [clients, globalSearch, advFilters, sort]);

  const {
    paginatedData, currentPage, pageSize, totalPages, totalItems,
    pageSizeOptions, goToPage, setPageSize,
  } = usePagination(processedData);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const hasFilters = globalSearch || activeFilterCount > 0;

  return (
    <div className="space-y-3">
      {/* Search & Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="premium-search flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tên, nhóm, nhân viên..."
              className="pl-9 h-9 border-0 shadow-none focus-visible:ring-0"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              Bộ lọc nâng cao
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {hasFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Kết quả: <strong className="text-foreground">{processedData.length}</strong> / {clients.length}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={clearFilters}>
              <X className="h-3 w-3" /> Xóa lọc
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent>
          <div className="glass-panel p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Phí tối thiểu (Min - Max)</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="h-8 text-xs" value={advFilters.feeMin} onChange={(e) => setAdvFilters((p) => ({ ...p, feeMin: e.target.value }))} />
                <Input type="number" placeholder="Max" className="h-8 text-xs" value={advFilters.feeMax} onChange={(e) => setAdvFilters((p) => ({ ...p, feeMax: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Phí tối đa (Min - Max)</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="h-8 text-xs" value={advFilters.feeMaxMin} onChange={(e) => setAdvFilters((p) => ({ ...p, feeMaxMin: e.target.value }))} />
                <Input type="number" placeholder="Max" className="h-8 text-xs" value={advFilters.feeMaxMax} onChange={(e) => setAdvFilters((p) => ({ ...p, feeMaxMax: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Công nợ (Min - Max)</label>
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" className="h-8 text-xs" value={advFilters.congNoMin} onChange={(e) => setAdvFilters((p) => ({ ...p, congNoMin: e.target.value }))} />
                <Input type="number" placeholder="Max" className="h-8 text-xs" value={advFilters.congNoMax} onChange={(e) => setAdvFilters((p) => ({ ...p, congNoMax: e.target.value }))} />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Table */}
      <div className="premium-table-wrapper">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-14 text-center">STT</TableHead>
                <TableHead className="min-w-[280px]">
                  <SortButton label="Tên" sortKey="ten" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[130px]">
                  <SortButton label="Nhóm" sortKey="nhom" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <SortButton label="NV phụ trách" sortKey="nhan_vien_phu_trach" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[130px]">NV hỗ trợ</TableHead>
                <TableHead className="w-20 text-center">Ứng dụng</TableHead>
                <TableHead className="text-right min-w-[100px]">
                  <SortButton label="Tối thiểu" sortKey="phi_dich_vu_toi_thieu" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="text-right min-w-[100px]">
                  <SortButton label="Tối đa" sortKey="phi_dich_vu_toi_da" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="text-right min-w-[80px]">
                  <SortButton label="Công nợ" sortKey="cong_no" current={sort} onSort={handleSort} />
                </TableHead>
                <TableHead className="text-center min-w-[100px]">HĐ điện tử</TableHead>
                <TableHead className="text-center min-w-[100px]">Thuế điện tử</TableHead>
                <TableHead className="text-center min-w-[100px]">Chữ ký số</TableHead>
                <TableHead className="text-center min-w-[110px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                    Không tìm thấy khách hàng nào
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((client, idx) => (
                  <TableRow key={client.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => onEditClient?.(client)}>
                    <TableCell className="text-center text-sm">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                          style={{ backgroundColor: client.avatar_color, color: "white" }}
                        >
                          {client.ten_viet_tat}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[260px]">{client.ten}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{client.nhom}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold shrink-0">
                          {client.nhan_vien_phu_trach.charAt(client.nhan_vien_phu_trach.lastIndexOf(" ") + 1)}
                        </div>
                        <span className="text-sm truncate">{client.nhan_vien_phu_trach}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {client.nhan_vien_ho_tro.map((nv, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-semibold"
                            title={nv}
                          >
                            {nv.charAt(nv.lastIndexOf(" ") + 1)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <AppIcons clientId={client.id} apps={client.ung_dung_list || []} otherSoftware={client.other_software} />
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatNumber(client.phi_dich_vu_toi_thieu)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatNumber(client.phi_dich_vu_toi_da)}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {formatNumber(client.cong_no)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {showCreateContract && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-1 rounded hover:bg-primary/10" title="Tạo hợp đồng dịch vụ" onClick={(e) => { e.stopPropagation(); onCreateContract?.(client); }}>
                                <PlusCircle className="h-4 w-4 text-primary" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Tạo hợp đồng dịch vụ</TooltipContent>
                          </Tooltip>
                        )}
                        <button className="p-1 rounded hover:bg-muted" title="Xem">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 rounded hover:bg-muted" title="Sửa" onClick={(e) => { e.stopPropagation(); onEditClient?.(client); }}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 rounded hover:bg-destructive/10" title="Xóa" onClick={(e) => { e.stopPropagation(); setDeleteTarget(client); }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng <strong>{deleteTarget?.ten}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  onDeleteClient?.(deleteTarget);
                  toast.success(`Đã xóa khách hàng "${deleteTarget.ten}"`);
                }
                setDeleteTarget(null);
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}