import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTaxLookup, useBusinessFields, useBusinessSectors } from "@/hooks/useClientForm";
import { toast } from "sonner";

interface Props {
  form: Record<string, any>;
  setField: (key: string, value: any) => void;
}

export function BasicInfoSection({ form, setField }: Props) {
  const { data: businessFields } = useBusinessFields();
  const { data: allSectors } = useBusinessSectors();
  const taxLookup = useTaxLookup();
  const [sectorSearch, setSectorSearch] = useState("");
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const sectorRef = useRef<HTMLDivElement>(null);

  const handleTaxBlur = async () => {
    if (!form.taxCode || form.taxCode.length < 10) return;
    const result = await taxLookup.mutateAsync(form.taxCode);
    if (result) {
      setField("name", result.name);
      setField("address", result.address);
      setField("legalRepresentative", result.legalRepresentative);
      if (result.establishmentDate) setField("establishmentDate", result.establishmentDate);
      toast.success("Tự động điền thông tin từ MST");
    }
  };

  const sectors: string[] = form.businessSectors || [];
  const filteredSectors = (allSectors || []).filter(
    (s) => !sectors.includes(s) && s.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const addSector = (s: string) => {
    setField("businessSectors", [...sectors, s]);
    setSectorSearch("");
    setShowSectorDropdown(false);
  };

  const removeSector = (s: string) => {
    setField("businessSectors", sectors.filter((x: string) => x !== s));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Mã số thuế <span className="text-destructive">*</span></Label>
          <Input
            value={form.taxCode || ""}
            onChange={(e) => setField("taxCode", e.target.value)}
            onBlur={handleTaxBlur}
            placeholder="Nhập MST để tự động tra cứu"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Loại hình <span className="text-destructive">*</span></Label>
          <RadioGroup
            value={form.businessType || "company"}
            onValueChange={(v) => setField("businessType", v)}
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="company" id="bt-company" />
              <Label htmlFor="bt-company" className="text-sm cursor-pointer">Công ty</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="household" id="bt-household" />
              <Label htmlFor="bt-household" className="text-sm cursor-pointer">Hộ kinh doanh</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Tên công ty <span className="text-destructive">*</span></Label>
          <Input value={form.name || ""} onChange={(e) => setField("name", e.target.value)} placeholder="Tên công ty" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Vốn điều lệ</Label>
          <Input type="number" value={form.charterCapital || ""} onChange={(e) => setField("charterCapital", parseInt(e.target.value) || 0)} placeholder="VNĐ" />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Người đại diện pháp luật</Label>
          <Input value={form.legalRepresentative || ""} onChange={(e) => setField("legalRepresentative", e.target.value)} placeholder="Họ tên" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Lĩnh vực hoạt động</Label>
          <Select value={form.businessField || ""} onValueChange={(v) => setField("businessField", v)}>
            <SelectTrigger><SelectValue placeholder="Chọn lĩnh vực" /></SelectTrigger>
            <SelectContent>
              {businessFields?.map((f) => (
                <SelectItem key={f.id} value={f.ten}>{f.ten}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Ngày thành lập</Label>
          <DatePickerField
            value={form.establishmentDate}
            onChange={(v) => setField("establishmentDate", v)}
          />
        </div>
        <div />

        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-xs">Địa chỉ</Label>
          <Input value={form.address || ""} onChange={(e) => setField("address", e.target.value)} placeholder="Địa chỉ đầy đủ" />
        </div>
      </div>

      {/* Business sectors multi-select tags */}
      <div className="space-y-1.5">
        <Label className="text-xs">Ngành nghề kinh doanh</Label>
        <div className="border rounded-md p-2 min-h-[42px] flex flex-wrap gap-1.5" ref={sectorRef}>
          {sectors.map((s: string) => (
            <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md">
              {s}
              <button onClick={() => removeSector(s)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[150px] text-sm outline-none bg-transparent placeholder:text-muted-foreground"
            placeholder="Tìm và thêm ngành nghề..."
            value={sectorSearch}
            onChange={(e) => { setSectorSearch(e.target.value); setShowSectorDropdown(true); }}
            onFocus={() => setShowSectorDropdown(true)}
            onBlur={() => setTimeout(() => setShowSectorDropdown(false), 200)}
          />
        </div>
        {showSectorDropdown && filteredSectors.length > 0 && (
          <div className="border rounded-md bg-popover shadow-md max-h-[200px] overflow-y-auto mt-1">
            {filteredSectors.slice(0, 10).map((s) => (
              <button
                key={s}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                onMouseDown={() => addSector(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DatePickerField({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const date = value ? new Date(value) : undefined;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );
}
