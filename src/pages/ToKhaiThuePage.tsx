import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";

interface ToKhai {
  id: number;
  ma_to_khai: string;
  khach_hang: string;
  loai: string;
  ky_bao_cao: string;
  trang_thai: "da_nop" | "chua_nop" | "loi";
  ngay_nop: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  da_nop: { label: "Đã nộp", variant: "default" },
  chua_nop: { label: "Chưa nộp", variant: "secondary" },
  loi: { label: "Lỗi", variant: "destructive" },
};

const mockData: ToKhai[] = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  ma_to_khai: `TK-${String(i + 1).padStart(4, "0")}`,
  khach_hang: `Công ty ${String.fromCharCode(65 + (i % 26))} ${Math.floor(i / 26) + 1}`,
  loai: i % 3 === 0 ? "GTGT" : i % 3 === 1 ? "TNCN" : "TNDN",
  ky_bao_cao: `Q${(i % 4) + 1}/2025`,
  trang_thai: (["da_nop", "chua_nop", "loi"] as const)[i % 3],
  ngay_nop: `${String((i % 28) + 1).padStart(2, "0")}/03/2025`,
}));

export default function ToKhaiThuePage() {
  const [search, setSearch] = useState("");
  const filtered = search
    ? mockData.filter((t) => t.khach_hang.toLowerCase().includes(search.toLowerCase()) || t.ma_to_khai.toLowerCase().includes(search.toLowerCase()))
    : mockData;

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } = usePagination(filtered);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Kết quả tờ khai thuế</h1>
      <p className="text-sm text-muted-foreground">Theo dõi kết quả các tờ khai thuế.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm theo mã hoặc khách hàng..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Mã tờ khai</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Kỳ báo cáo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày nộp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Không tìm thấy</TableCell></TableRow>
            ) : paginatedData.map((tk, idx) => (
              <TableRow key={tk.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-sm">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="text-sm font-medium text-primary">{tk.ma_to_khai}</TableCell>
                <TableCell className="text-sm">{tk.khach_hang}</TableCell>
                <TableCell className="text-sm">{tk.loai}</TableCell>
                <TableCell className="text-sm">{tk.ky_bao_cao}</TableCell>
                <TableCell><Badge variant={statusMap[tk.trang_thai].variant}>{statusMap[tk.trang_thai].label}</Badge></TableCell>
                <TableCell className="text-sm tabular-nums">{tk.ngay_nop}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageChange={goToPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
