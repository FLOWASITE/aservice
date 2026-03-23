import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Calculator, Store, FileText } from "lucide-react";
import { APP_LIST } from "@/types/application";

interface Props {
  form: Record<string, any>;
  setField: (key: string, value: any) => void;
}

const APP_ICONS: Record<string, React.ReactNode> = {
  aketoan: <Calculator className="h-5 w-5" />,
  amall: <Store className="h-5 w-5" />,
  aread: <FileText className="h-5 w-5" />,
};

export function ApplicationSection({ form, setField }: Props) {
  const selectedApps: string[] = form.applications || [];
  const desc = form.description || { general: "", businessType: "", mainProducts: "", mainExpenses: "" };

  const toggleApp = (code: string) => {
    const next = selectedApps.includes(code)
      ? selectedApps.filter((c: string) => c !== code)
      : [...selectedApps, code];
    setField("applications", next);
  };

  const removeApp = (code: string) => {
    setField("applications", selectedApps.filter((c: string) => c !== code));
  };

  const setDesc = (key: string, value: string) => {
    setField("description", { ...desc, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Software radio */}
      <div className="space-y-1.5">
        <Label className="text-xs">Phần mềm hỗ trợ</Label>
        <RadioGroup
          value={form.software || "aketoan"}
          onValueChange={(v) => {
            setField("software", v);
            if (v === "other") setField("applications", []);
          }}
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

      {/* Aketoan multi-select cards */}
      {form.software !== "other" && (
        <div className="space-y-3">
          <Label className="text-xs">Ứng dụng đăng ký sử dụng <span className="text-destructive">*</span></Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {APP_LIST.map((app) => {
              const isSelected = selectedApps.includes(app.code);
              return (
                <button
                  key={app.code}
                  type="button"
                  onClick={() => toggleApp(app.code)}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/30 bg-card"
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mt-0.5 pointer-events-none"
                    tabIndex={-1}
                  />
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: app.bgColor, color: app.color }}
                  >
                    {APP_ICONS[app.code]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground">{app.name}</div>
                    <div className="text-xs text-muted-foreground leading-snug">{app.fullName}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected chips */}
          {selectedApps.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedApps.map((code: string) => {
                const app = APP_LIST.find((a) => a.code === code);
                if (!app) return null;
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: app.bgColor, color: app.color }}
                  >
                    {app.name}
                    <button type="button" onClick={() => removeApp(code)} className="hover:opacity-70">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Other software input */}
      {form.software === "other" && (
        <div className="space-y-1.5">
          <Label className="text-xs">Tên phần mềm <span className="text-destructive">*</span></Label>
          <Input
            value={form.otherSoftwareName || ""}
            onChange={(e) => setField("otherSoftwareName", e.target.value)}
            placeholder="Nhập tên phần mềm đang sử dụng"
          />
        </div>
      )}

      {/* Description textareas */}
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
