import { useState } from "react";
import { useContracts } from "@/hooks/useContracts";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Eye, Edit, FileSignature } from "lucide-react";
import type { ContractStatus } from "@/types/contract";

const statusLabels: Record<ContractStatus, string> = {
  dang_thuc_hien: "Đang thực hiện",
  tam_ngung: "Tạm ngưng",
  da_ket_thuc: "Đã kết thúc",
  huy: "Huỷ",
};

const statusVariants: Record<ContractStatus, "default" | "secondary" | "destructive" | "outline"> = {
  dang_thuc_hien: "default",
  tam_ngung: "secondary",
  da_ket_thuc: "outline",
  huy: "destructive",
};

const feeLabels: Record<string, string> = {
  theo_thang: "Theo tháng",
  theo_quy: "Theo quý",
  theo_nam: "Theo năm",
  mot_lan: "Một lần",
};

const formatCurrency = (v: number) => new Intl.NumberFormat("vi-VN").format(v);
const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

export default function HopDongPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { data: contracts = [], isLoading } = useContracts();

  const filtered = search
    ? contracts.filter(
        (c) =>
          c.so_hop_dong.toLowerCase().includes(search.toLowerCase()) ||
          c.khach_hang_ten.toLowerCase().includes(search.toLowerCase())
      )
    : contracts;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hợp đồng dịch vụ</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý hợp đồng dịch vụ kế toán</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Tạo hợp đồng
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Tổng hợp đồng</p>
          <p className="text-2xl font-bold">{contracts.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Đang thực hiện</p>
          <p className="text-2xl font-bold text-primary">
            {contracts.filter((c) => c.trang_thai === "dang_thuc_hien").length}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Tổng giá trị</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(contracts.reduce((sum, c) => sum + c.gia_tri_hop_dong, 0))}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Tạm ngưng / Huỷ</p>
          <p className="text-2xl font-bold text-destructive">
            {contracts.filter((c) => c.trang_thai === "tam_ngung" || c.trang_thai === "huy").length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo số HĐ hoặc khách hàng..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="flex items-center text-sm text-muted-foreground ml-auto">
          Hiển thị: <strong className="ml-1 text-foreground">{filtered.length}</strong>
        </span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">STT</TableHead>
                <TableHead className="min-w-[120px]">Số HĐ</TableHead>
                <TableHead className="min-w-[220px]">Khách hàng</TableHead>
                <TableHead className="min-w-[150px]">Dịch vụ</TableHead>
                <TableHead className="text-right min-w-[120px]">Giá trị (VNĐ)</TableHead>
                <TableHead className="min-w-[100px]">Cách tính phí</TableHead>
                <TableHead className="min-w-[100px]">Bắt đầu</TableHead>
                <TableHead className="min-w-[100px]">Kết thúc</TableHead>
                <TableHead className="min-w-[160px]">NV phụ trách</TableHead>
                <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                <TableHead className="w-20 text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 11 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                    <FileSignature className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>Không tìm thấy hợp đồng nào</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((contract, idx) => (
                  <TableRow key={contract.id} className="hover:bg-muted/30">
                    <TableCell className="text-center text-sm">{idx + 1}</TableCell>
                    <TableCell className="text-sm font-medium text-primary">{contract.so_hop_dong}</TableCell>
                    <TableCell className="text-sm truncate max-w-[220px]">{contract.khach_hang_ten}</TableCell>
                    <TableCell className="text-sm">{contract.dich_vu_ten}</TableCell>
                    <TableCell className="text-right text-sm font-medium tabular-nums">
                      {formatCurrency(contract.gia_tri_hop_dong)}
                    </TableCell>
                    <TableCell className="text-sm">{feeLabels[contract.cach_tinh_phi]}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatDate(contract.ngay_bat_dau)}</TableCell>
                    <TableCell className="text-sm tabular-nums">{formatDate(contract.ngay_ket_thuc)}</TableCell>
                    <TableCell className="text-sm">{contract.nhan_vien_phu_trach_ten}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[contract.trang_thai]}>
                        {statusLabels[contract.trang_thai]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 rounded hover:bg-muted" title="Xem">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 rounded hover:bg-muted" title="Sửa">
                          <Edit className="h-4 w-4 text-muted-foreground" />
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

      {/* Create Modal */}
      <CreateContractModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
