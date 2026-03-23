import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useCreateService } from "@/hooks/useServices";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateServiceModal({ open, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const { toast } = useToast();
  const createMutation = useCreateService();

  useEffect(() => {
    if (open) { setName(""); setDescription(""); setActive(true); }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tên dịch vụ.", variant: "destructive" });
      return;
    }
    await createMutation.mutateAsync({ name: name.trim(), description: description.trim(), status: active ? "active" : "inactive" });
    toast({ title: "Thành công", description: "Đã tạo dịch vụ mới." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tên dịch vụ <span className="text-destructive">*</span></Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên dịch vụ" />
          </div>
          <div className="space-y-1.5">
            <Label>Mô tả</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả dịch vụ" rows={3} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Trạng thái</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{active ? "Hoạt động" : "Ngưng"}</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
