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
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-foreground">Nhân sự</h1>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="nhan_su">Nhân sự</TabsTrigger>
          <TabsTrigger value="nhom">Nhóm</TabsTrigger>
        </TabsList>

        <TabsContent value="nhan_su" className="space-y-5 mt-5">
          {/* Stat cards */}
          <EmployeeStatCards stats={stats || defaultStats} />

          {/* Controls section */}
          <div className="space-y-4">
            {/* Status tabs */}
            <div className="flex items-center gap-1">
              {STATUS_TABS.map((t) => {
                const isActive = statusTab === t.value;
                const count = (tabCounts || defaultCounts)[t.value];
                return (
                  <button
                    key={t.value}
                    onClick={() => setStatusTab(t.value)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {t.label}
                    <span
                      className={`inline-flex items-center justify-center rounded-full min-w-[20px] h-5 px-1.5 text-[11px] font-semibold ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Nhân sự</span>
              <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-[110px] h-8 text-sm">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[90px] h-8 text-sm">
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
                  <Input
                    className="pl-8 h-8 w-[180px] text-sm"
                    placeholder="Tìm kiếm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm px-4">
                  Tìm kiếm
                </Button>
              </form>
            </div>

            {/* Total + Add */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Tổng: <strong className="text-foreground">{employees?.length || 0}</strong>
              </span>
              <Button
                size="sm"
                onClick={() => setAddModalOpen(true)}
                className="h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Thêm mới
              </Button>
            </div>
          </div>

          {/* Data table */}
          <EmployeeDataTable employees={employees || []} isLoading={isLoading} onDelete={handleDelete} />

          <AddEmployeeModal open={addModalOpen} onOpenChange={setAddModalOpen} />
        </TabsContent>

        <TabsContent value="nhom" className="mt-5">
          <GroupsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
