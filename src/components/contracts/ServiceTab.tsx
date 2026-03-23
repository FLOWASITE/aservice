import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import { useServicesList, useDeleteService } from "@/hooks/useServices";
import { useContracts } from "@/hooks/useContracts";
import { CreateServiceModal } from "./CreateServiceModal";
import { toast } from "sonner";
import type { Service } from "@/types/service";

export function ServiceTab() {
  const { data: services = [], isLoading } = useServicesList();
  const { data: contracts = [] } = useContracts();
  const deleteMutation = useDeleteService();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const getContractCount = (serviceId: string) => {
    return contracts.filter(c => c.serviceId === serviceId).length;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    toast.success("Đã xóa dịch vụ");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Quản lý danh mục dịch vụ</p>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm dịch vụ
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">STT</TableHead>
              <TableHead className="min-w-[200px]">Tên dịch vụ</TableHead>
              <TableHead className="min-w-[300px]">Mô tả</TableHead>
              <TableHead className="w-24 text-center">Trạng thái</TableHead>
              <TableHead className="w-28 text-center">Số hợp đồng</TableHead>
              <TableHead className="w-20 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Chưa có dịch vụ nào
                </TableCell>
              </TableRow>
            ) : (
              services.map((svc, idx) => (
                <TableRow key={svc.id} className="hover:bg-muted/30">
                  <TableCell className="text-center text-sm">{idx + 1}</TableCell>
                  <TableCell className="text-sm font-medium">{svc.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{svc.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={svc.status === "active" ? "default" : "secondary"}>
                      {svc.status === "active" ? "Hoạt động" : "Ngưng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">{getContractCount(svc.id)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-full hover:bg-primary/10" title="Sửa">
                        <Edit className="h-4 w-4 text-primary" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-destructive/10" title="Xóa" onClick={() => setDeleteTarget(svc)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateServiceModal open={modalOpen} onOpenChange={setModalOpen} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa dịch vụ <strong>{deleteTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
