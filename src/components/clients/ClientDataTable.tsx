import { useState, useMemo } from "react";
import type { Client } from "@/types/client";
import { AppIcons } from "./AppIcons";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";

interface Props {
  clients: Client[];
  isLoading?: boolean;
  onEditClient?: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
}

const formatNumber = (v: number) =>
  v === 0 ? "0" : new Intl.NumberFormat("vi-VN").format(v);

export function ClientDataTable({ clients, isLoading, onEditClient, onDeleteClient }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [colSearch, setColSearch] = useState({
    ten: "",
    nhom: "",
    nhan_vien: "",
    ho_tro: "",
    ung_dung: "",
  });

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchTen = !colSearch.ten || c.ten.toLowerCase().includes(colSearch.ten.toLowerCase());
      const matchNhom = !colSearch.nhom || c.nhom.toLowerCase().includes(colSearch.nhom.toLowerCase());
      const matchNV = !colSearch.nhan_vien || c.nhan_vien_phu_trach.toLowerCase().includes(colSearch.nhan_vien.toLowerCase());
      return matchTen && matchNhom && matchNV;
    });
  }, [clients, colSearch]);

  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    pageSizeOptions,
    goToPage,
    setPageSize,
  } = usePagination(filtered);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-14 text-center">STT</TableHead>
                <TableHead className="min-w-[280px]">
                  <div className="space-y-1">
                    <span>Tên*</span>
                    <Input
                      placeholder="Tìm kiếm"
                      className="h-7 text-xs"
                      value={colSearch.ten}
                      onChange={(e) => setColSearch((p) => ({ ...p, ten: e.target.value }))}
                    />
                  </div>
                </TableHead>
                <TableHead className="min-w-[130px]">
                  <div className="space-y-1">
                    <span>Nhóm*</span>
                    <Input
                      placeholder="Vui lòng chọn"
                      className="h-7 text-xs"
                      value={colSearch.nhom}
                      onChange={(e) => setColSearch((p) => ({ ...p, nhom: e.target.value }))}
                    />
                  </div>
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <div className="space-y-1">
                    <span>Nhân viên phụ trách*</span>
                    <Input
                      placeholder="Vui lòng chọn"
                      className="h-7 text-xs"
                      value={colSearch.nhan_vien}
                      onChange={(e) => setColSearch((p) => ({ ...p, nhan_vien: e.target.value }))}
                    />
                  </div>
                </TableHead>
                <TableHead className="min-w-[130px]">Nhân viên hỗ tr...</TableHead>
                <TableHead className="w-20 text-center">Ứng dụng</TableHead>
                <TableHead className="text-right min-w-[100px]">Tối thiểu</TableHead>
                <TableHead className="text-right min-w-[100px]">Tối đa</TableHead>
                <TableHead className="text-right min-w-[80px]">Công nợ</TableHead>
                <TableHead className="text-center min-w-[80px]">Hoá đơn</TableHead>
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
                          style={{
                            backgroundColor: client.avatar_color,
                            color: "white",
                          }}
                        >
                          {client.ten_viet_tat}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[260px]">
                          {client.ten}
                        </span>
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
