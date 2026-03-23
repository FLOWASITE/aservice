import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { EmployeeStatCards } from "@/components/employees/EmployeeStatCards";
import { EmployeeDataTable } from "@/components/employees/EmployeeDataTable";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { GroupsTab } from "@/components/employees/GroupsTab";
import { useEmployeeStats, useEmployeeTabCounts, useEmployees, useDeleteEmployee } from "@/hooks/useEmployees";
import type { EmployeeStatus } from "@/types/employee";
import { toast } from "sonner";

const currentYear = new Date().getFullYear();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const STATUS_TABS: { value: EmployeeStatus; label: string }[] = [
  { value: "dang_lam_viec", label: "Đang làm việc" },
  { value: "nghi_thai_san", label: "Nghỉ thai sản" },
  { value: "khac", label: "Khác" },
];

export default function NhanSuPage() {
  const [mainTab, setMainTab] = useState("nhan_su");
  const [statusTab, setStatusTab] = useState<EmployeeStatus>("dang_lam_viec");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: stats } = useEmployeeStats();
  const { data: tabCounts } = useEmployeeTabCounts();
  const { data: employees, isLoading } = useEmployees(statusTab, search || undefined);
  const deleteMutation = useDeleteEmployee();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Xóa nhân viên thành công");
    } catch {
      toast.error("Có lỗi xảy ra khi xóa nhân viên");
    }
  };

  const defaultStats = { khach_hang_phu_trach: 0, cong_no: 0, doanh_thu_dv_ke_toan: 0, doanh_thu_khac: 0, tong_doanh_thu_nam: 0 };
  const defaultCounts = { dang_lam_viec: 0, nghi_thai_san: 0, khac: 0 };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Nhân sự</h1>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="nhan_su">Nhân sự</TabsTrigger>
          <TabsTrigger value="nhom">Nhóm</TabsTrigger>
        </TabsList>

        <TabsContent value="nhan_su" className="space-y-4 mt-4">
          {/* Stats */}
          <EmployeeStatCards stats={stats || defaultStats} />

          {/* Status tabs */}
          <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as EmployeeStatus)}>
            <TabsList className="bg-transparent gap-1 p-0 h-auto">
              {STATUS_TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5 text-sm"
                >
                  {t.label}
                  <span className="ml-1.5 bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground">
                    ({(tabCounts || defaultCounts)[t.value]})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground">Nhân sự</span>
            <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
              <SelectTrigger className="w-[100px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 h-9 w-[200px]" placeholder="Tìm kiếm..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
              </div>
              <Button type="submit" size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-9">
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Actions bar */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tổng: <strong className="text-foreground">{employees?.length || 0}</strong></span>
            <Button size="sm" onClick={() => setAddModalOpen(true)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              <Plus className="h-4 w-4 mr-1" /> Thêm mới
            </Button>
          </div>

          {/* Table */}
          <EmployeeDataTable employees={employees || []} isLoading={isLoading} onDelete={handleDelete} />

          <AddEmployeeModal open={addModalOpen} onOpenChange={setAddModalOpen} />
        </TabsContent>

        <TabsContent value="nhom" className="mt-4">
          <GroupsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
