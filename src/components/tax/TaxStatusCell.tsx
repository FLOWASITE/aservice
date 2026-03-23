import { useState } from "react";
import type { TaxDeclarationStatus, TaxPeriodCell } from "@/types/taxDeclaration";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUpdateTaxStatus } from "@/hooks/useTaxDeclarations";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: TaxDeclarationStatus; label: string; color: string }[] = [
  { value: "not_synced", label: "Chưa đồng bộ", color: "text-[hsl(187,71%,40%)]" },
  { value: "submitted", label: "Đã nộp", color: "text-emerald-600" },
  { value: "overdue", label: "Trễ hạn", color: "text-destructive" },
  { value: "processing", label: "Đang xử lý", color: "text-orange-500" },
  { value: "completed", label: "Hoàn thành", color: "text-emerald-600" },
  { value: "not_required", label: "Không phát sinh", color: "text-muted-foreground" },
];

function getStatusColor(status: TaxDeclarationStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color || "text-muted-foreground";
}

interface Props {
  cell: TaxPeriodCell;
  declarationId: string;
  period: string;
}

export function TaxStatusCell({ cell, declarationId, period }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(cell.status);
  const updateMutation = useUpdateTaxStatus();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: declarationId, period, status: selectedStatus });
      toast.success("Cập nhật trạng thái thành công");
      setOpen(false);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const colorClass = getStatusColor(cell.status);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="text-left w-full p-1.5 rounded hover:bg-muted/50 transition-colors">
          <div className="text-[11px] text-foreground leading-tight">
            {cell.deadline || "Chưa xác định thời gian"}
          </div>
          <div className="text-[10px] leading-tight mt-0.5">
            <span className="text-muted-foreground">Trạng thái: </span>
            <span className={`font-medium ${colorClass}`}>{cell.statusLabel}</span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-foreground">Cập nhật trạng thái</div>
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as TaxDeclarationStatus)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  <span className={opt.color}>{opt.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>Hủy</Button>
            <Button size="sm" className="h-7 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "..." : "Lưu"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
