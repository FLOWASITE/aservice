import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroups, useCreateGroup, useUpdateGroup, useDeleteGroup, useEmployees } from "@/hooks/useEmployees";
import type { Group, GroupCreatePayload } from "@/types/employee";
import { toast } from "sonner";

export function GroupsTab() {
  const { data: groups, isLoading } = useGroups();
  const { data: employees } = useEmployees("dang_lam_viec");
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();

  const [modalOpen, setModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<GroupCreatePayload>({ ten: "", mo_ta: "" });

  const openCreate = () => { setEditGroup(null); setForm({ ten: "", mo_ta: "" }); setModalOpen(true); };
  const openEdit = (g: Group) => { setEditGroup(g); setForm({ ten: g.ten, truong_nhom_id: g.truong_nhom_id, mo_ta: g.mo_ta }); setModalOpen(true); };

  const handleSubmit = async () => {
    if (!form.ten.trim()) { toast.error("Vui lòng nhập tên nhóm"); return; }
    try {
      if (editGroup) {
        await updateMutation.mutateAsync({ id: editGroup.id, data: form });
        toast.success("Cập nhật nhóm thành công");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Tạo nhóm thành công");
      }
      setModalOpen(false);
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Xóa nhóm thành công");
    } catch {
      toast.error("Có lỗi xảy ra khi xóa nhóm");
    }
  };

  const filtered = groups?.filter((g) => !search || g.ten.toLowerCase().includes(search.toLowerCase())) || [];

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Tìm nhóm..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={openCreate} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
          <Plus className="h-4 w-4 mr-1" /> Thêm nhóm
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-14 text-center">STT</TableHead>
              <TableHead>Tên nhóm</TableHead>
              <TableHead>Trưởng nhóm</TableHead>
              <TableHead className="text-center">Số thành viên</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Không tìm thấy</TableCell></TableRow>
            ) : (
              filtered.map((g, i) => (
                <TableRow key={g.id} className="hover:bg-muted/30">
                  <TableCell className="text-center text-sm">{i + 1}</TableCell>
                  <TableCell className="text-sm font-medium">{g.ten}</TableCell>
                  <TableCell className="text-sm">{g.truong_nhom}</TableCell>
                  <TableCell className="text-center text-sm">{g.so_thanh_vien}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{g.mo_ta}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-primary" onClick={() => openEdit(g)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa nhóm</AlertDialogTitle>
                            <AlertDialogDescription>Bạn có chắc chắn muốn xóa nhóm &quot;{g.ten}&quot;?</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(g.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editGroup ? "Chỉnh sửa nhóm" : "Thêm nhóm"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Tên nhóm <span className="text-destructive">*</span></Label>
              <Input value={form.ten} onChange={(e) => setForm((f) => ({ ...f, ten: e.target.value }))} placeholder="Nhập tên nhóm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trưởng nhóm</Label>
              <Select value={form.truong_nhom_id?.toString() || ""} onValueChange={(v) => setForm((f) => ({ ...f, truong_nhom_id: parseInt(v) }))}>
                <SelectTrigger><SelectValue placeholder="Chọn trưởng nhóm" /></SelectTrigger>
                <SelectContent>
                  {employees?.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>{e.ho_ten}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Mô tả</Label>
              <Textarea value={form.mo_ta || ""} onChange={(e) => setForm((f) => ({ ...f, mo_ta: e.target.value }))} placeholder="Mô tả nhóm" rows={3} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {editGroup ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
