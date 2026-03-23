import { useState } from "react";
import { useContracts, useDeleteContract } from "@/hooks/useContracts";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import { ContractDataTable } from "@/components/contracts/ContractDataTable";
import { ServiceTab } from "@/components/contracts/ServiceTab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings } from "lucide-react";
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hợp đồng dịch vụ</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý hợp đồng và dịch vụ kế toán</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Tổng: {contracts.length}
          </Badge>
          <button className="p-2 rounded-lg hover:bg-muted" title="Cài đặt">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">Hợp đồng</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
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

      {/* Create Modal */}
      <CreateContractModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
