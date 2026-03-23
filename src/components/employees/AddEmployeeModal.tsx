import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateEmployee, useGroups } from "@/hooks/useEmployees";
import { toast } from "sonner";
import type { EmployeeCreatePayload } from "@/types/employee";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeModal({ open, onOpenChange }: Props) {
  const { data: groups } = useGroups();
  const createMutation = useCreateEmployee();

  const [form, setForm] = useState<EmployeeCreatePayload>({
    ma: "",
    ho_ten: "",
  });
  const [ngaySinh, setNgaySinh] = useState<Date>();
  const [ngayBatDau, setNgayBatDau] = useState<Date>();
  const [showAccount, setShowAccount] = useState(false);

  const set = (key: keyof EmployeeCreatePayload, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async () => {
    if (!form.ma.trim() || !form.ho_ten.trim()) {
      toast.error("Vui lòng nhập mã và họ tên nhân viên");
      return;
    }
    const payload: EmployeeCreatePayload = {
      ...form,
      ngay_sinh: ngaySinh ? format(ngaySinh, "yyyy-MM-dd") : undefined,
      ngay_bat_dau: ngayBatDau ? format(ngayBatDau, "yyyy-MM-dd") : undefined,
    };
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Tạo nhân viên thành công");
      onOpenChange(false);
      setForm({ ma: "", ho_ten: "" });
      setNgaySinh(undefined);
      setNgayBatDau(undefined);
      setShowAccount(false);
    } catch {
      toast.error("Có lỗi xảy ra khi tạo nhân viên");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhân viên</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Row 1 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Mã nhân viên <span className="text-destructive">*</span></Label>
            <Input value={form.ma} onChange={(e) => set("ma", e.target.value)} placeholder="VD: NV001" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Họ tên nhân viên <span className="text-destructive">*</span></Label>
            <Input value={form.ho_ten} onChange={(e) => set("ho_ten", e.target.value)} placeholder="Nhập họ tên" />
          </div>

          {/* Row 2 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Chức vụ</Label>
            <Input value={form.chuc_vu || ""} onChange={(e) => set("chuc_vu", e.target.value)} placeholder="VD: Kế toán viên" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ngày tháng năm sinh</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !ngaySinh && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {ngaySinh ? format(ngaySinh, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={ngaySinh} onSelect={setNgaySinh} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Row 3 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Nơi sinh</Label>
            <Input value={form.noi_sinh || ""} onChange={(e) => set("noi_sinh", e.target.value)} placeholder="Nhập nơi sinh" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Giới tính</Label>
            <Select value={form.gioi_tinh || ""} onValueChange={(v) => set("gioi_tinh", v)}>
              <SelectTrigger><SelectValue placeholder="Vui lòng chọn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="nam">Nam</SelectItem>
                <SelectItem value="nu">Nữ</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Row 4 */}
          <div className="space-y-1.5">
            <Label className="text-xs">CCCD</Label>
            <Input value={form.cccd || ""} onChange={(e) => set("cccd", e.target.value)} placeholder="Số CCCD" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Mã số thuế TNCN</Label>
            <Input value={form.ma_so_thue_tncn || ""} onChange={(e) => set("ma_so_thue_tncn", e.target.value)} placeholder="Mã số thuế" />
          </div>

          {/* Row 5 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Địa chỉ</Label>
            <Input value={form.dia_chi || ""} onChange={(e) => set("dia_chi", e.target.value)} placeholder="Nhập địa chỉ" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ngày bắt đầu làm việc</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !ngayBatDau && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {ngayBatDau ? format(ngayBatDau, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={ngayBatDau} onSelect={setNgayBatDau} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Row 6 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Trạng thái làm việc</Label>
            <Select value={form.trang_thai || ""} onValueChange={(v) => set("trang_thai", v)}>
              <SelectTrigger><SelectValue placeholder="Vui lòng chọn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dang_lam_viec">Đang làm việc</SelectItem>
                <SelectItem value="nghi_thai_san">Nghỉ thai sản</SelectItem>
                <SelectItem value="nghi_viec">Nghỉ việc</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nhóm</Label>
            <Select value={form.nhom_id?.toString() || ""} onValueChange={(v) => set("nhom_id", parseInt(v))}>
              <SelectTrigger><SelectValue placeholder="Vui lòng chọn" /></SelectTrigger>
              <SelectContent>
                {groups?.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>{g.ten}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 7 */}
          <div className="space-y-1.5">
            <Label className="text-xs">Lương cơ bản</Label>
            <Input type="number" value={form.luong_co_ban || ""} onChange={(e) => set("luong_co_ban", parseInt(e.target.value) || 0)} placeholder="VNĐ" />
          </div>
        </div>

        {/* Account section */}
        <div className="mt-4 border rounded-lg">
          <button
            className="w-full flex items-center gap-2 p-3 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg"
            onClick={() => setShowAccount(!showAccount)}
          >
            {showAccount ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            Tài khoản đăng nhập
          </button>
          {showAccount && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="email@domain.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Mật khẩu</Label>
                <Input type="password" value={form.password || ""} onChange={(e) => set("password", e.target.value)} placeholder="Mật khẩu" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
            {createMutation.isPending ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
