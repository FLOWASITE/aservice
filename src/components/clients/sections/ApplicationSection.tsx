import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useApplications } from "@/hooks/useClientForm";

interface Props {
  form: Record<string, any>;
  setField: (key: string, value: any) => void;
}

export function ApplicationSection({ form, setField }: Props) {
  const { data: applications } = useApplications();
  const desc = form.description || { general: "", businessType: "", mainProducts: "", mainExpenses: "" };

  const setDesc = (key: string, value: string) => {
    setField("description", { ...desc, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Phần mềm hỗ trợ</Label>
        <RadioGroup
          value={form.software || "aketoan"}
          onValueChange={(v) => setField("software", v)}
          className="flex gap-4 pt-1"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="aketoan" id="sw-aketoan" />
            <Label htmlFor="sw-aketoan" className="text-sm cursor-pointer">Sử dụng phần mềm Aketoan</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="other" id="sw-other" />
            <Label htmlFor="sw-other" className="text-sm cursor-pointer">Sử dụng phần mềm khác</Label>
          </div>
        </RadioGroup>
      </div>

      {form.software === "aketoan" && (
        <div className="space-y-1.5">
          <Label className="text-xs">Ứng dụng đăng ký sử dụng <span className="text-destructive">*</span></Label>
          <Select value={form.applicationId?.toString() || ""} onValueChange={(v) => setField("applicationId", parseInt(v))}>
            <SelectTrigger><SelectValue placeholder="Chọn ứng dụng" /></SelectTrigger>
            <SelectContent>
              {applications?.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>{a.ten}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.applicationId && applications && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-md mt-1">
              {applications.find((a) => a.id === form.applicationId)?.ten}
              <button onClick={() => setField("applicationId", undefined)}>
                <X className="h-3 w-3 hover:text-destructive" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Thông tin chung</Label>
          <Textarea rows={3} value={desc.general} onChange={(e) => setDesc("general", e.target.value)} placeholder="Mô tả chung về công ty" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Loại hình doanh nghiệp</Label>
          <Textarea rows={3} value={desc.businessType} onChange={(e) => setDesc("businessType", e.target.value)} placeholder="Mô tả loại hình" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Sản phẩm kinh doanh chính</Label>
          <Textarea rows={3} value={desc.mainProducts} onChange={(e) => setDesc("mainProducts", e.target.value)} placeholder="Liệt kê sản phẩm chính" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Chi phí chính</Label>
          <Textarea rows={3} value={desc.mainExpenses} onChange={(e) => setDesc("mainExpenses", e.target.value)} placeholder="Liệt kê chi phí chính" />
        </div>
      </div>
    </div>
  );
}
