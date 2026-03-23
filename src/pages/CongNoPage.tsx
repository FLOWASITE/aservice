import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";

interface CongNo {
  id: number;
  khach_hang: string;
  so_hop_dong: string;
  so_tien: number;
  da_thanh_toan: number;
  con_lai: number;
  trang_thai: "da_thanh_toan" | "chua_thanh_toan" | "qua_han";
  han_thanh_toan: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  da_thanh_toan: { label: "Đã thanh toán", variant: "default" },
  chua_thanh_toan: { label: "Chưa thanh toán", variant: "secondary" },
  qua_han: { label: "Quá hạn", variant: "destructive" },
};

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

const mockData: CongNo[] = Array.from({ length: 55 }, (_, i) => {
  const total = (Math.floor(Math.random() * 50) + 5) * 1000000;
  const paid = Math.floor(Math.random() * total);
  return {
    id: i + 1,
    khach_hang: `Công ty ${String.fromCharCode(65 + (i % 26))} ${Math.floor(i / 26) + 1}`,
    so_hop_dong: `HD-${String(i + 1).padStart(4, "0")}`,
    so_tien: total,
    da_thanh_toan: paid,
    con_lai: total - paid,
    trang_thai: (["da_thanh_toan", "chua_thanh_toan", "qua_han"] as const)[i % 3],
    han_thanh_toan: `${String((i % 28) + 1).padStart(2, "0")}/04/2025`,
  };
});

export default function CongNoPage() {
  const [search, setSearch] = useState("");
  const filtered = search
    ? mockData.filter((cn) => cn.khach_hang.toLowerCase().includes(search.toLowerCase()) || cn.so_hop_dong.toLowerCase().includes(search.toLowerCase()))
    : mockData;

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } = usePagination(filtered);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Theo dõi công nợ</h1>
      <p className="text-sm text-muted-foreground">Quản lý và theo dõi công nợ.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm theo khách hàng hoặc số HĐ..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Số HĐ</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="text-right">Đã thanh toán</TableHead>
              <TableHead className="text-right">Còn lại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hạn TT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">Không tìm thấy</TableCell></TableRow>
            ) : paginatedData.map((cn, idx) => (
              <TableRow key={cn.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-sm">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="text-sm">{cn.khach_hang}</TableCell>
                <TableCell className="text-sm font-medium text-primary">{cn.so_hop_dong}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{fmt(cn.so_tien)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums">{fmt(cn.da_thanh_toan)}</TableCell>
                <TableCell className="text-right text-sm tabular-nums font-medium">{fmt(cn.con_lai)}</TableCell>
                <TableCell><Badge variant={statusMap[cn.trang_thai].variant}>{statusMap[cn.trang_thai].label}</Badge></TableCell>
                <TableCell className="text-sm tabular-nums">{cn.han_thanh_toan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageChange={goToPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
