import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";

interface DoanhNghiep {
  id: number;
  ma_so_thue: string;
  ten: string;
  dia_chi: string;
  trang_thai: "hoat_dong" | "tam_ngung" | "giai_the";
  ngay_cap_nhat: string;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  hoat_dong: { label: "Hoạt động", variant: "default" },
  tam_ngung: { label: "Tạm ngưng", variant: "secondary" },
  giai_the: { label: "Giải thể", variant: "destructive" },
};

const mockData: DoanhNghiep[] = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  ma_so_thue: `0${String(300000000 + i * 1111)}`,
  ten: `Công ty TNHH ${String.fromCharCode(65 + (i % 26))} ${Math.floor(i / 26) + 1}`,
  dia_chi: i % 2 === 0 ? "Hà Nội" : i % 3 === 0 ? "Đà Nẵng" : "TP. Hồ Chí Minh",
  trang_thai: (["hoat_dong", "hoat_dong", "tam_ngung", "giai_the"] as const)[i % 4],
  ngay_cap_nhat: `${String((i % 28) + 1).padStart(2, "0")}/03/2025`,
}));

export default function TrangThaiDNPage() {
  const [search, setSearch] = useState("");
  const filtered = search
    ? mockData.filter((dn) => dn.ten.toLowerCase().includes(search.toLowerCase()) || dn.ma_so_thue.includes(search))
    : mockData;

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } = usePagination(filtered);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Trạng thái doanh nghiệp</h1>
      <p className="text-sm text-muted-foreground">Quản lý trạng thái hoạt động doanh nghiệp.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm theo tên hoặc MST..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Mã số thuế</TableHead>
              <TableHead>Tên doanh nghiệp</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Không tìm thấy</TableCell></TableRow>
            ) : paginatedData.map((dn, idx) => (
              <TableRow key={dn.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-sm">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="text-sm font-medium text-primary tabular-nums">{dn.ma_so_thue}</TableCell>
                <TableCell className="text-sm">{dn.ten}</TableCell>
                <TableCell className="text-sm">{dn.dia_chi}</TableCell>
                <TableCell><Badge variant={statusMap[dn.trang_thai].variant}>{statusMap[dn.trang_thai].label}</Badge></TableCell>
                <TableCell className="text-sm tabular-nums">{dn.ngay_cap_nhat}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageChange={goToPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
