import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { DataPagination } from "@/components/DataPagination";

interface NhanVien {
  id: number;
  ho_ten: string;
  chuc_vu: string;
  email: string;
  so_dien_thoai: string;
  so_khach_hang: number;
  trang_thai: string;
}

const mockData: NhanVien[] = Array.from({ length: 35 }, (_, i) => ({
  id: i + 1,
  ho_ten: `Nhân viên ${i + 1}`,
  chuc_vu: i % 3 === 0 ? "Trưởng nhóm" : i % 3 === 1 ? "Kế toán viên" : "Trợ lý",
  email: `nv${i + 1}@aservice.vn`,
  so_dien_thoai: `09${String(10000000 + i).slice(0, 8)}`,
  so_khach_hang: Math.floor(Math.random() * 20) + 1,
  trang_thai: i % 5 === 0 ? "Nghỉ phép" : "Đang làm",
}));

export default function NhanSuPage() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? mockData.filter((nv) => nv.ho_ten.toLowerCase().includes(search.toLowerCase()))
    : mockData;

  const { paginatedData, currentPage, pageSize, totalPages, totalItems, pageSizeOptions, goToPage, setPageSize } =
    usePagination(filtered);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Nhân sự</h1>
      <p className="text-sm text-muted-foreground">Quản lý nhân sự công ty.</p>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm nhân viên..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead className="text-center">Số KH</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Không tìm thấy</TableCell></TableRow>
            ) : paginatedData.map((nv, idx) => (
              <TableRow key={nv.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-sm">{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="text-sm font-medium">{nv.ho_ten}</TableCell>
                <TableCell className="text-sm">{nv.chuc_vu}</TableCell>
                <TableCell className="text-sm">{nv.email}</TableCell>
                <TableCell className="text-sm tabular-nums">{nv.so_dien_thoai}</TableCell>
                <TableCell className="text-center text-sm">{nv.so_khach_hang}</TableCell>
                <TableCell className="text-sm">{nv.trang_thai}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataPagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} pageSizeOptions={pageSizeOptions} onPageChange={goToPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
