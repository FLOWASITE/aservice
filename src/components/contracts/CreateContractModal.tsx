import { useState, useCallback, useRef, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_LIST } from "@/types/application";
import { Checkbox } from "@/components/ui/checkbox";
import logoAketoan from "@/assets/logo-aketoan.png";
import logoAmall from "@/assets/logo-amall.png";
import logoAread from "@/assets/logo-aread.png";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  useDropdownClients, useDropdownServices, useDropdownEmployees,
  useCreateContract,
} from "@/hooks/useContracts";
import type { ContractCreatePayload, FeeType, SoftwareType, SalaryConfig, ContractStatus } from "@/types/contract";

const APP_LOGOS: Record<string, string> = { aketoan: logoAketoan, amall: logoAmall, aread: logoAread };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClientId?: string;
}

const initialForm: ContractCreatePayload = {
  clientId: "",
  contractNumber: "",
  startDate: "",
  endDate: "",
  contractValue: 0,
  feeType: "monthly",
  status: "active",
  staffId: "",
  supportStaffIds: [],
  serviceId: "",
  software: "aketoan",
  applications: [],
  salaryType: "co_dinh",
  salaryAmount: 0,
  notes: "",
  fileHopDong: null,
};

const formatCurrency = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

export function CreateContractModal({ open, onOpenChange, defaultClientId }: Props) {
  const [form, setForm] = useState<ContractCreatePayload>({ ...initialForm });
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [otherSoftwareName, setOtherSoftwareName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setForm({ ...initialForm, clientId: defaultClientId || "" });
      setStartDate(undefined);
      setEndDate(undefined);
      setFileName(null);
      setSelectedApps([]);
      setOtherSoftwareName("");
    }
  }, [open, defaultClientId]);

  const { data: clients = [] } = useDropdownClients();
  const { data: services = [] } = useDropdownServices();
  const { data: employees = [] } = useDropdownEmployees();
  const createMutation = useCreateContract();

  const updateField = useCallback(<K extends keyof ContractCreatePayload>(key: K, value: ContractCreatePayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    updateField("fileHopDong", file);
    setFileName(file.name);
  }, [updateField]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmit = useCallback(async () => {
    if (!form.clientId || !form.contractNumber || !form.serviceId || !form.staffId) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ các trường bắt buộc.", variant: "destructive" });
      return;
    }
    if (!startDate || !endDate) {
      toast({ title: "Lỗi", description: "Vui lòng chọn ngày bắt đầu và kết thúc.", variant: "destructive" });
      return;
    }
    const payload: ContractCreatePayload = {
      ...form,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      applications: selectedApps,
    };
    try {
      await createMutation.mutateAsync(payload);
      toast({ title: "Thành công", description: "Đã tạo hợp đồng mới." });
      onOpenChange(false);
    } catch {
      toast({ title: "Lỗi", description: "Không thể tạo hợp đồng.", variant: "destructive" });
    }
  }, [form, startDate, endDate, selectedApps, createMutation, onOpenChange, toast]);

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
              <Select value={form.clientId} onValueChange={(v) => updateField("clientId", v)}>
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
              <Input placeholder="VD: 004/HDKT/2025/TAF" value={form.contractNumber} onChange={(e) => updateField("contractNumber", e.target.value)} />
            </div>
          </div>

          {/* Row 2: Trạng thái + Dịch vụ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select value={form.status} onValueChange={(v) => updateField("status", v as ContractStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang thực hiện</SelectItem>
                  <SelectItem value="suspended">Tạm ngưng</SelectItem>
                  <SelectItem value="stopped">Ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Dịch vụ <span className="text-destructive">*</span></Label>
              <Select value={form.serviceId} onValueChange={(v) => updateField("serviceId", v)}>
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
              <Input type="number" min={0} placeholder="0" value={form.contractValue || ""} onChange={(e) => updateField("contractValue", Number(e.target.value))} />
              {form.contractValue > 0 && <p className="text-xs text-muted-foreground">{formatCurrency(form.contractValue)} VNĐ</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Cách tính phí</Label>
              <Select value={form.feeType} onValueChange={(v) => updateField("feeType", v as FeeType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Theo tháng</SelectItem>
                  <SelectItem value="yearly">Theo năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Ngày bắt đầu <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={vi} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Ngày kết thúc <span className="text-destructive">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={vi} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 5: Staff */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>NV phụ trách <span className="text-destructive">*</span></Label>
              <Select value={form.staffId} onValueChange={(v) => updateField("staffId", v)}>
                <SelectTrigger><SelectValue placeholder="Chọn nhân viên" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>NV hỗ trợ</Label>
              <Select value={form.supportStaffIds[0] || "none"} onValueChange={(v) => updateField("supportStaffIds", v === "none" ? [] : [v])}>
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
              className={cn("border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors", dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/50")}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-foreground">{fileName}</span>
                  <button type="button" className="p-1 rounded hover:bg-muted" onClick={(e) => { e.stopPropagation(); setFileName(null); updateField("fileHopDong", null); }}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Kéo thả hoặc <span className="text-primary font-medium">nhấn để chọn</span></p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (tối đa 10MB)</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file); }} />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea placeholder="Nhập ghi chú..." rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
          </div>

          {/* Phần mềm hỗ trợ */}
          <div className="space-y-2">
            <Label>Phần mềm hỗ trợ</Label>
            <RadioGroup value={form.software} onValueChange={(v) => { updateField("software", v as SoftwareType); if (v === "khac") setSelectedApps([]); }} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="aketoan" id="sw-aketoan" />
                <Label htmlFor="sw-aketoan" className="font-normal cursor-pointer">Sử dụng phần mềm Aketoan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="khac" id="sw-khac" />
                <Label htmlFor="sw-khac" className="font-normal cursor-pointer">Sử dụng phần mềm khác</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ứng dụng cards */}
          {form.software === "aketoan" && (
            <div className="space-y-3">
              <Label>Ứng dụng đăng ký sử dụng <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-3 gap-3">
                {APP_LIST.map((app) => {
                  const isSelected = selectedApps.includes(app.code);
                  return (
                    <button key={app.code} type="button" onClick={() => setSelectedApps(prev => prev.includes(app.code) ? prev.filter(c => c !== app.code) : [...prev, app.code])}
                      className={cn("flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all", isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-muted-foreground/30 bg-card")}>
                      <Checkbox checked={isSelected} className="mt-0.5 pointer-events-none" tabIndex={-1} />
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white">
                        <img src={APP_LOGOS[app.code]} alt={app.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{app.name}</div>
                        <div className="text-xs text-muted-foreground leading-snug">{app.fullName}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedApps.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedApps.map((code) => {
                    const app = APP_LIST.find(a => a.code === code);
                    if (!app) return null;
                    return (
                      <span key={code} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: app.bgColor, color: app.color }}>
                        {app.name}
                        <button type="button" onClick={() => setSelectedApps(prev => prev.filter(c => c !== code))} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {form.software === "khac" && (
            <div className="space-y-1.5">
              <Label>Tên phần mềm <span className="text-destructive">*</span></Label>
              <Input value={otherSoftwareName} onChange={(e) => setOtherSoftwareName(e.target.value)} placeholder="Nhập tên phần mềm đang sử dụng" />
            </div>
          )}

          {/* Mô tả */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Thông tin chung</Label>
              <Textarea rows={3} placeholder="Mô tả chung về công ty" />
            </div>
            <div className="space-y-1.5">
              <Label>Loại hình doanh nghiệp</Label>
              <Textarea rows={3} placeholder="Mô tả loại hình" />
            </div>
            <div className="space-y-1.5">
              <Label>Sản phẩm kinh doanh chính</Label>
              <Textarea rows={3} placeholder="Liệt kê sản phẩm chính" />
            </div>
            <div className="space-y-1.5">
              <Label>Chi phí chính</Label>
              <Textarea rows={3} placeholder="Liệt kê chi phí chính" />
            </div>
          </div>

          {/* Cấu hình lương */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cấu hình lương</Label>
              <RadioGroup value={form.salaryType} onValueChange={(v) => updateField("salaryType", v as SalaryConfig)} className="flex flex-col gap-2">
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
            {form.salaryType === "co_dinh" && (
              <div className="space-y-1.5">
                <Label>Tiền lương (VNĐ)</Label>
                <Input type="number" min={0} placeholder="0" value={form.salaryAmount || ""} onChange={(e) => updateField("salaryAmount", Number(e.target.value))} />
                {form.salaryAmount > 0 && <p className="text-xs text-muted-foreground">{formatCurrency(form.salaryAmount)} VNĐ</p>}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang tạo..." : "Tạo hợp đồng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
