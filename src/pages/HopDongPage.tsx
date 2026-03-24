import { useState } from "react";
import { useContracts, useDeleteContract } from "@/hooks/useContracts";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import { ContractDataTable } from "@/components/contracts/ContractDataTable";
import { ServiceTab } from "@/components/contracts/ServiceTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileSignature, FileText, DollarSign, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const fmt = (v: number) => new Intl.NumberFormat("vi-VN").format(v);

export default function HopDongPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: contracts = [], isLoading } = useContracts();
  const deleteMutation = useDeleteContract();

  const handleDelete = async (contract: any) => {
    await deleteMutation.mutateAsync(contract.id);
    toast.success("Đã xóa hợp đồng");
  };

  const totalValue = contracts.reduce((s, c) => s + (c.contractValue || 0), 0);
  const activeCount = contracts.filter(c => c.status === "active").length;
  const uniqueClients = new Set(contracts.map(c => c.clientId)).size;
  const uniqueStaff = new Set(contracts.map(c => c.staffId)).size;

  const statCards = [
    { icon: FileText, label: "Tổng hợp đồng", value: contracts.length.toString(), gradient: "stat-gradient-blue", iconBg: "bg-primary/10", iconColor: "text-primary" },
    { icon: DollarSign, label: "Tổng giá trị", value: fmt(totalValue), gradient: "stat-gradient-green", iconBg: "bg-success/10", iconColor: "text-success", suffix: "VNĐ" },
    { icon: TrendingUp, label: "Đang hoạt động", value: activeCount.toString(), gradient: "stat-gradient-teal", iconBg: "bg-accent/10", iconColor: "text-accent" },
    { icon: Users, label: "Khách hàng", value: uniqueClients.toString(), gradient: "stat-gradient-amber", iconBg: "bg-warning/10", iconColor: "text-warning" },
  ];

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="page-header-banner">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileSignature className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-title text-[22px]">Hợp đồng dịch vụ</h1>
              <p className="page-subtitle">Quản lý hợp đồng và dịch vụ kế toán</p>
            </div>
          </div>
          <Button size="sm" className="h-9 gap-1.5 shadow-sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card-premium ${card.gradient} group`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="font-bold text-xl leading-tight text-foreground">{card.value}</p>
            {card.suffix && <p className="text-[10px] text-muted-foreground mt-0.5">{card.suffix}</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contracts" className="space-y-5">
        <TabsList className="glass-panel p-1 h-auto">
          <TabsTrigger value="contracts" className="rounded-lg text-xs data-[state=active]:shadow-sm">Hợp đồng</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg text-xs data-[state=active]:shadow-sm">Dịch vụ</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <ContractDataTable contracts={contracts} isLoading={isLoading} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="services">
          <ServiceTab />
        </TabsContent>
      </Tabs>

      <CreateContractModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
