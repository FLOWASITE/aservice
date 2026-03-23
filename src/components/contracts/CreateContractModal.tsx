import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  useDropdownClients,
  useDropdownServices,
  useDropdownEmployees,
  useDropdownApplications,
  useCreateContract,
} from "@/hooks/useContracts";
import type { ContractCreatePayload, SoftwareType, SalaryConfig, FeeCalculation, ContractStatus } from "@/types/contract";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientId?: number;
}

const initialForm: ContractCreatePayload = {
  khach_hang_id: 0,
  so_hop_dong: "",
  trang_thai: "dang_thuc_hien",
  dich_vu_id: 0,
  gia_tri_hop_dong: 0,
  cach_tinh_phi: "theo_thang",
  ngay_bat_dau: "",
  ngay_ket_thuc: "",
  nhan_vien_phu_trach_id: 0,
  nhan_vien_ho_tro_id: null,
  file_hop_dong: null,
  ghi_chu: "",
  phan_mem: "aketoan",
  ung_dung_id: null,
  cau_hinh_luong: "co_dinh",
  tien_luong: 0,
};

const formatCurrency = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

export function CreateContractModal({ open, onOpenChange, defaultClientId }: Props) {
  const [form, setForm] = useState<ContractCreatePayload>({ ...initialForm });

  useEffect(() => {
    if (open) {
      setForm({ ...initialForm, khach_hang_id: defaultClientId || 0 });
    }
  }, [open, defaultClientId]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: clients = [] } = useDropdownClients();
  const { data: services = [] } = useDropdownServices();
  const { data: employees = [] } = useDropdownEmployees();
  const { data: applications = [] } = useDropdownApplications();
  const createMutation = useCreateContract();

  const updateField = useCallback(<K extends keyof ContractCreatePayload>(
    key: K,
    value: ContractCreatePayload[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    updateField("file_hop_dong", file);
    setFileName(file.name);
  }, [updateField]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmit = useCallback(async () => {
    if (!form.khach_hang_id || !form.so_hop_dong || !form.dich_vu_id || !form.nhan_vien_phu_trach_id) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ các trường bắt buộc.", variant: "destructive" });
      return;
    }
    if (!startDate || !endDate) {
      toast({ title: "Lỗi", description: "Vui lòng chọn ngày bắt đầu và kết thúc.", variant: "destructive" });
      return;
    }

    const payload: ContractCreatePayload = {
      ...form,
      ngay_bat_dau: format(startDate, "yyyy-MM-dd"),
      ngay_ket_thuc: format(endDate, "yyyy-MM-dd"),
    };

    try {
      await createMutation.mutateAsync(payload);
      toast({ title: "Thành công", description: "Đã tạo hợp đồng mới." });
      setForm({ ...initialForm });
      setStartDate(undefined);
      setEndDate(undefined);
      setFileName(null);
      onOpenChange(false);
    } catch {
      toast({ title: "Lỗi", description: "Không thể tạo hợp đồng. Vui lòng thử lại.", variant: "destructive" });
    }
  }, [form, startDate, endDate, createMutation, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Tạo hợp đồng dịch vụ</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Row 1: Khách hàng + Số hợp đồng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Khách hàng <span className="text-destructive">*</span></Label>
              <Select
                value={form.khach_hang_id ? form.khach_hang_id.toString() : ""}
                onValueChange={(v) => updateField("khach_hang_id", Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Số hợp đồng <span className="text-destructive">*</span></Label>
              <Input
                placeholder="VD: HD-2026-001"
                value={form.so_hop_dong}
                onChange={(e) => updateField("so_hop_dong", e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Trạng thái + Dịch vụ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Trạng thái hợp đồng</Label>
              <Select
                value={form.trang_thai}
                onValueChange={(v) => updateField("trang_thai", v as ContractStatus)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dang_thuc_hien">Đang thực hiện</SelectItem>
                  <SelectItem value="tam_ngung">Tạm ngưng</SelectItem>
                  <SelectItem value="da_ket_thuc">Đã kết thúc</SelectItem>
                  <SelectItem value="huy">Huỷ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Dịch vụ <span className="text-destructive">*</span></Label>
              <Select
                value={form.dich_vu_id ? form.dich_vu_id.toString() : ""}
                onValueChange={(v) => updateField("dich_vu_id", Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Chọn dịch vụ" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Giá trị + Cách tính phí */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Giá trị hợp đồng (VNĐ)</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={form.gia_tri_hop_dong || ""}
                onChange={(e) => updateField("gia_tri_hop_dong", Number(e.target.value))}
              />
              {form.gia_tri_hop_dong > 0 && (
                <p className="text-xs text-muted-foreground">{formatCurrency(form.gia_tri_hop_dong)} VNĐ</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Cách tính phí</Label>
              <Select
                value={form.cach_tinh_phi}
                onValueChange={(v) => updateField("cach_tinh_phi", v as FeeCalculation)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="theo_thang">Theo tháng</SelectItem>
                  <SelectItem value="theo_quy">Theo quý</SelectItem>
                  <SelectItem value="theo_nam">Theo năm</SelectItem>
                  <SelectItem value="mot_lan">Một lần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Ngày bắt đầu / kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Ngày bắt đầu <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={vi}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Ngày kết thúc <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={vi}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 5: Nhân viên phụ trách + hỗ trợ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nhân viên phụ trách <span className="text-destructive">*</span></Label>
              <Select
                value={form.nhan_vien_phu_trach_id ? form.nhan_vien_phu_trach_id.toString() : ""}
                onValueChange={(v) => updateField("nhan_vien_phu_trach_id", Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nhân viên hỗ trợ</Label>
              <Select
                value={form.nhan_vien_ho_tro_id ? form.nhan_vien_ho_tro_id.toString() : "none"}
                onValueChange={(v) => updateField("nhan_vien_ho_tro_id", v === "none" ? null : Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Không chọn --</SelectItem>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload file */}
          <div className="space-y-1.5">
            <Label>Upload file hợp đồng</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-foreground">{fileName}</span>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileName(null);
                      updateField("file_hop_dong", null);
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    Kéo thả file vào đây hoặc <span className="text-primary font-medium">nhấn để chọn</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (tối đa 10MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea
              placeholder="Nhập ghi chú..."
              rows={3}
              value={form.ghi_chu}
              onChange={(e) => updateField("ghi_chu", e.target.value)}
            />
          </div>

          {/* Phần mềm hỗ trợ */}
          <div className="space-y-2">
            <Label>Phần mềm hỗ trợ</Label>
            <RadioGroup
              value={form.phan_mem}
              onValueChange={(v) => {
                updateField("phan_mem", v as SoftwareType);
                if (v === "khac") updateField("ung_dung_id", null);
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aketoan" id="sw-aketoan" />
                <Label htmlFor="sw-aketoan" className="font-normal cursor-pointer">
                  Sử dụng phần mềm Aketoan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="khac" id="sw-khac" />
                <Label htmlFor="sw-khac" className="font-normal cursor-pointer">
                  Sử dụng phần mềm khác
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ứng dụng đăng ký (conditional) */}
          {form.phan_mem === "aketoan" && (
            <div className="space-y-1.5">
              <Label>Ứng dụng đăng ký sử dụng</Label>
              <Select
                value={form.ung_dung_id ? form.ung_dung_id.toString() : ""}
                onValueChange={(v) => updateField("ung_dung_id", Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Chọn ứng dụng" /></SelectTrigger>
                <SelectContent>
                  {applications.map((a) => (
                    <SelectItem key={a.id} value={a.id.toString()}>{a.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Cấu hình lương */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cấu hình lương</Label>
              <RadioGroup
                value={form.cau_hinh_luong}
                onValueChange={(v) => updateField("cau_hinh_luong", v as SalaryConfig)}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="co_dinh" id="sal-fixed" />
                  <Label htmlFor="sal-fixed" className="font-normal cursor-pointer">Cố định</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="theo_gia_tri_hop_dong" id="sal-contract" />
                  <Label htmlFor="sal-contract" className="font-normal cursor-pointer">Theo giá trị hợp đồng</Label>
                </div>
              </RadioGroup>
            </div>
            {form.cau_hinh_luong === "co_dinh" && (
              <div className="space-y-1.5">
                <Label>Tiền lương (VNĐ)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.tien_luong || ""}
                  onChange={(e) => updateField("tien_luong", Number(e.target.value))}
                />
                {form.tien_luong > 0 && (
                  <p className="text-xs text-muted-foreground">{formatCurrency(form.tien_luong)} VNĐ</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang tạo..." : "Tạo hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
