import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, UserCog } from "lucide-react";
import { EmployeeStatCards } from "@/components/employees/EmployeeStatCards";
import { EmployeeDataTable } from "@/components/employees/EmployeeDataTable";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { GroupsTab } from "@/components/employees/GroupsTab";
import { useEmployeeStats, useEmployeeTabCounts, useEmployees, useDeleteEmployee, useEmployeeTotals } from "@/hooks/useEmployees";
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
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: stats } = useEmployeeStats();
  const { data: tabCounts } = useEmployeeTabCounts();
  const { data: employees, isLoading } = useEmployees(statusTab, search || undefined);
  const { data: totals } = useEmployeeTotals();
  const deleteMutation = useDeleteEmployee();

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
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserCog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="page-title">Nhân sự</h1>
            <p className="page-subtitle">Quản lý nhân viên và nhóm làm việc</p>
          </div>
        </div>
        <Button size="sm" className="h-9 gap-1.5" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Thêm mới
        </Button>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="glass-panel p-1 h-auto">
          <TabsTrigger value="nhan_su" className="rounded-lg text-xs data-[state=active]:shadow-sm">Nhân sự</TabsTrigger>
          <TabsTrigger value="nhom" className="rounded-lg text-xs data-[state=active]:shadow-sm">Nhóm</TabsTrigger>
        </TabsList>

        <TabsContent value="nhan_su" className="space-y-5 mt-5">
          {/* Stat cards */}
          <EmployeeStatCards stats={stats || defaultStats} />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Status tabs as pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60">
              {STATUS_TABS.map((t) => {
                const isActive = statusTab === t.value;
                const count = (tabCounts || defaultCounts)[t.value];
                return (
                  <button
                    key={t.value}
                    onClick={() => setStatusTab(t.value)}
                    className={`tab-pill ${isActive ? "tab-pill-active" : "tab-pill-inactive"}`}
                  >
                    {t.label}
                    <span
                      className={`inline-flex items-center justify-center rounded-md min-w-[20px] h-[18px] px-1 text-[10px] font-bold ${
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

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={month.toString()} onValueChange={(v) => setMonth(parseInt(v))}>
                <SelectTrigger className="w-[110px] h-8 text-xs rounded-lg">
                  <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={year.toString()} onValueChange={(v) => setYear(parseInt(v))}>
                <SelectTrigger className="w-[90px] h-8 text-xs rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-muted-foreground ml-1">
                Tổng: <strong className="text-foreground">{employees?.length || 0}</strong>
              </span>
            </div>
          </div>

          {/* Data table */}
          <EmployeeDataTable employees={employees || []} isLoading={isLoading} totals={totals} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="nhom" className="mt-5">
          <GroupsTab />
        </TabsContent>
      </Tabs>

      <AddEmployeeModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
}
