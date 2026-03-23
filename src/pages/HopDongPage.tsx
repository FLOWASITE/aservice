import { useState } from "react";
import { useContracts, useDeleteContract } from "@/hooks/useContracts";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import { ContractDataTable } from "@/components/contracts/ContractDataTable";
import { ServiceTab } from "@/components/contracts/ServiceTab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileSignature } from "lucide-react";
import { toast } from "sonner";

export default function HopDongPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: contracts = [], isLoading } = useContracts();
  const deleteMutation = useDeleteContract();

  const handleDelete = async (contract: any) => {
    await deleteMutation.mutateAsync(contract.id);
    toast.success("Đã xóa hợp đồng");
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileSignature className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="page-title">Hợp đồng dịch vụ</h1>
            <p className="page-subtitle">Quản lý hợp đồng và dịch vụ kế toán</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs px-3 py-1 rounded-lg">
            Tổng: {contracts.length}
          </Badge>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="space-y-5">
        <TabsList className="glass-panel p-1 h-auto">
          <TabsTrigger value="contracts" className="rounded-lg text-xs data-[state=active]:shadow-sm">Hợp đồng</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg text-xs data-[state=active]:shadow-sm">Dịch vụ</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <ContractDataTable
            contracts={contracts}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="services">
          <ServiceTab />
        </TabsContent>
      </Tabs>

      <CreateContractModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
