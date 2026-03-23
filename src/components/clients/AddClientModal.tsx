import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { X, Building2, Calculator, Link2 } from "lucide-react";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { AccountingInfoSection } from "./sections/AccountingInfoSection";
import { RelatedInfoSection } from "./sections/RelatedInfoSection";

import { useCreateClient } from "@/hooks/useClientForm";
import { toast } from "sonner";
import type { ClientCreatePayload } from "@/types/clientForm";
import type { Client } from "@/types/client";

const DRAFT_KEY = "add_client_draft";

function getDefaultForm(): Record<string, any> {
  return {
    taxCode: "", name: "", businessType: "company", charterCapital: 0,
    businessField: "", businessSectors: [], establishmentDate: "", address: "",
    legalRepresentative: "", appliedCircular: "", declarationPeriod: "",
    groupId: undefined, assignedStaffId: undefined,
    digitalSignatures: [], bankAccounts: [],
    eTax: { taxCode: "", username: "", password: "" },
    socialInsurance: { unitCode: "", username: "", password: "" },
    eInvoicePortal: { provider: "", username: "", password: "" },
    invoiceReceivingEmails: [], invoiceSendingEmails: [],
  };
}

function clientToForm(client: Client): Record<string, any> {
  return {
    ...getDefaultForm(),
    taxCode: client.id.toString(),
    name: client.ten,
    businessType: "company",
    address: "",
    legalRepresentative: "",
  };
}

function loadDraft(): Record<string, any> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : getDefaultForm();
  } catch {
    return getDefaultForm();
  }
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editClient?: Client | null;
}

export function AddClientModal({ open, onOpenChange, editClient }: Props) {
  const isEditMode = !!editClient;
  const [form, setForm] = useState<Record<string, any>>(getDefaultForm);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const createMutation = useCreateClient();

  // Initialize form when modal opens
  useEffect(() => {
    if (open) {
      if (editClient) {
        setForm(clientToForm(editClient));
      } else {
        setForm(loadDraft());
      }
    }
  }, [open, editClient]);

  // Auto-save draft (only for create mode)
  useEffect(() => {
    if (open && !isEditMode) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [form, open, isEditMode]);

  const setField = useCallback((key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isDirty = form.taxCode || form.name;

  const handleClose = () => {
    if (isDirty) {
      setShowCloseConfirm(true);
    } else {
      onOpenChange(false);
    }
  };

  const confirmClose = () => {
    if (!isEditMode) localStorage.removeItem(DRAFT_KEY);
    setForm(getDefaultForm());
    setShowCloseConfirm(false);
    onOpenChange(false);
  };

  const validate = (): string | null => {
    if (!form.taxCode?.trim()) return "Vui lòng nhập mã số thuế";
    if (!form.name?.trim()) return "Vui lòng nhập tên công ty";
    if (!form.appliedCircular) return "Vui lòng chọn thông tư áp dụng";
    if (!form.declarationPeriod) return "Vui lòng chọn kỳ kê khai";
    return null;
  };

  const handleSaveClick = () => {
    const error = validate();
    if (error) { toast.error(error); return; }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    try {
      await createMutation.mutateAsync(form as ClientCreatePayload);
      toast.success(isEditMode ? "Cập nhật khách hàng thành công!" : "Tạo khách hàng thành công!");
      if (!isEditMode) localStorage.removeItem(DRAFT_KEY);
      setForm(getDefaultForm());
      onOpenChange(false);
    } catch {
      toast.error(isEditMode ? "Có lỗi xảy ra khi cập nhật khách hàng" : "Có lỗi xảy ra khi tạo khách hàng");
    }
  };

  const groupLabel = form.groupId ? `Nhóm #${form.groupId}` : "—";

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-[900px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <h2 className="text-lg font-semibold text-foreground">
              {isEditMode ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
            </h2>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Accordion type="multiple" defaultValue={["basic", "accounting"]} className="space-y-3">
              <AccordionItem value="basic" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4 text-primary" />
                    Thông tin cơ bản
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <BasicInfoSection form={form} setField={setField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="accounting" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Calculator className="h-4 w-4 text-primary" />
                    Thông tin kế toán
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <AccountingInfoSection form={form} setField={setField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="related" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Link2 className="h-4 w-4 text-primary" />
                    Thông tin liên quan
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <RelatedInfoSection form={form} setField={setField} />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t bg-card">
            <Button variant="ghost" onClick={handleClose}>Hủy</Button>
            <Button
              onClick={handleSaveClick}
              disabled={createMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {createMutation.isPending ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Lưu khách hàng"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isEditMode ? "Xác nhận cập nhật" : "Xác nhận tạo khách hàng"}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div><span className="text-muted-foreground">Tên công ty:</span> <strong>{form.name}</strong></div>
                  <div><span className="text-muted-foreground">MST:</span> <strong>{form.taxCode}</strong></div>
                  <div><span className="text-muted-foreground">Loại hình:</span> <strong>{form.businessType === "company" ? "Công ty" : "Hộ KD"}</strong></div>
                  <div><span className="text-muted-foreground">Thông tư:</span> <strong>{form.appliedCircular || "—"}</strong></div>
                  <div><span className="text-muted-foreground">Nhóm KH:</span> <strong>{groupLabel}</strong></div>
                  
                  <div><span className="text-muted-foreground">Phần mềm:</span> <strong>{form.software === "aketoan" ? "Aketoan" : "Khác"}</strong></div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>Dữ liệu chưa lưu sẽ bị mất. Bạn có muốn đóng form?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục chỉnh sửa</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Đóng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}