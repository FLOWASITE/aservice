import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCirculars, useGroupsDropdown } from "@/hooks/useClientForm";

interface Props {
  form: Record<string, any>;
  setField: (key: string, value: any) => void;
}

export function AccountingInfoSection({ form, setField }: Props) {
  const { data: circulars } = useCirculars();
  const { data: groups } = useGroupsDropdown();
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Thông tư áp dụng <span className="text-destructive">*</span></Label>
        <Select value={form.appliedCircular || ""} onValueChange={(v) => setField("appliedCircular", v)}>
          <SelectTrigger><SelectValue placeholder="Chọn thông tư" /></SelectTrigger>
          <SelectContent>
            {circulars?.map((c) => (
              <SelectItem key={c.id} value={c.ten}>{c.ten}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Kỳ kê khai <span className="text-destructive">*</span></Label>
        <Select value={form.declarationPeriod || ""} onValueChange={(v) => setField("declarationPeriod", v)}>
          <SelectTrigger><SelectValue placeholder="Chọn kỳ kê khai" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Kê khai theo tháng</SelectItem>
            <SelectItem value="quarterly">Kê khai theo quý</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Nhóm khách hàng</Label>
        <Select value={form.groupId?.toString() || ""} onValueChange={(v) => setField("groupId", parseInt(v))}>
          <SelectTrigger><SelectValue placeholder="Chọn nhóm" /></SelectTrigger>
          <SelectContent>
            {groups?.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>{g.ten}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
