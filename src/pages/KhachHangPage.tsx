import { useState, useCallback } from "react";
import { useClients } from "@/hooks/useClients";
import { ClientStatCards } from "@/components/clients/ClientStatCards";
import { ClientDataTable } from "@/components/clients/ClientDataTable";
import { AddClientModal } from "@/components/clients/AddClientModal";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import type { ClientStatus, Client } from "@/types/client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, FileDown } from "lucide-react";

const TABS: { value: ClientStatus; label: string }[] = [
  { value: "cho_thuc_hien", label: "Chờ thực hiện" },
  { value: "dang_thuc_hien_ke_toan", label: "Đang thực hiện dịch vụ kế toán" },
  { value: "dang_thuc_hien_ke_toan_khac", label: "Đang thực hiện dịch vụ kế toán khác" },
  { value: "ngung_thuc_hien", label: "Ngừng thực hiện" },
];

const currentYear = new Date().getFullYear();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function KhachHangPage() {
  const [activeTab, setActiveTab] = useState<ClientStatus>("dang_thuc_hien_ke_toan");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [contractModalOpen, setContractModalOpen] = useState(false);

  const handleEditClient = useCallback((client: Client) => {
    setEditClient(client);
    setAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    setAddModalOpen(open);
    if (!open) setEditClient(null);
  }, []);

  const { data, isLoading } = useClients({
    status: activeTab,
    search: search || undefined,
    month,
    year,
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const stats = data?.stats || {
    khach_hang_da_dang_ky: 0,
    nhan_vien: 0,
    nhom: 0,
    doanh_thu_thang: 0,
    doanh_thu_nam: 0,
  };

  const tabCounts = data?.tab_counts || {
    cho_thuc_hien: 0,
    dang_thuc_hien_ke_toan: 0,
    dang_thuc_hien_ke_toan_khac: 0,
    ngung_thuc_hien: 0,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Khách hàng</h1>
        </div>
      </div>

      {/* Stat cards */}
      <ClientStatCards stats={stats} />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ClientStatus)}
      >
        <TabsList className="bg-muted/50 h-auto flex-wrap gap-1 p-1">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm px-3 py-2"
            >
              {tab.label} ({tabCounts[tab.value]})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground">Khách hàng</span>

        <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={m.toString()}>
                Tháng {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm"
              className="pl-9 h-9 w-[200px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="h-9">
            <Search className="h-4 w-4 mr-1" />
            Tìm kiếm
          </Button>
        </form>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm khách hàng
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileDown className="h-4 w-4 mr-1" />
            Xuất dữ liệu
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Tổng: <strong className="ml-1 text-foreground">{data?.total || 0}</strong>
          </span>
        </div>
      </div>

      {/* Data table */}
      <ClientDataTable
        clients={data?.data || []}
        isLoading={isLoading}
        showCreateContract={activeTab === "cho_thuc_hien"}
        onEditClient={handleEditClient}
        onDeleteClient={(client) => console.log("Delete client", client.id)}
        onCreateContract={() => setContractModalOpen(true)}
      />

      <AddClientModal open={addModalOpen} onOpenChange={handleModalClose} editClient={editClient} />
      <CreateContractModal open={contractModalOpen} onOpenChange={setContractModalOpen} />
    </div>
  );
}
