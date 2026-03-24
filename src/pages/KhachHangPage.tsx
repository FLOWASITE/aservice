import { useState, useCallback } from "react";
import { useClients } from "@/hooks/useClients";
import { ClientStatCards } from "@/components/clients/ClientStatCards";
import { ClientDataTable } from "@/components/clients/ClientDataTable";
import { AddClientModal } from "@/components/clients/AddClientModal";
import { CreateContractModal } from "@/components/contracts/CreateContractModal";
import type { ClientStatus, Client } from "@/types/client";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, Users, Calendar } from "lucide-react";

const TABS: { value: ClientStatus; label: string }[] = [
  { value: "cho_thuc_hien", label: "Chờ thực hiện" },
  { value: "dang_thuc_hien_ke_toan", label: "DV Kế toán" },
  { value: "dang_thuc_hien_ke_toan_khac", label: "DV Kế toán khác" },
  { value: "ngung_thuc_hien", label: "Ngừng thực hiện" },
];

const currentYear = new Date().getFullYear();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function KhachHangPage() {
  const [activeTab, setActiveTab] = useState<ClientStatus>("dang_thuc_hien_ke_toan");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractClientId, setContractClientId] = useState<string | undefined>();

  const handleEditClient = useCallback((client: Client) => {
    setEditClient(client);
    setAddModalOpen(true);
  }, []);

  const handleModalClose = useCallback((open: boolean) => {
    setAddModalOpen(open);
    if (!open) setEditClient(null);
  }, []);

  const { data, isLoading } = useClients({ status: activeTab, month, year });

  const stats = data?.stats || { khach_hang_da_dang_ky: 0, nhan_vien: 0, nhom: 0, doanh_thu_thang: 0, doanh_thu_nam: 0 };
  const tabCounts = data?.tab_counts || { cho_thuc_hien: 0, dang_thuc_hien_ke_toan: 0, dang_thuc_hien_ke_toan_khac: 0, ngung_thuc_hien: 0 };

  return (
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="page-header-banner">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-title text-[22px]">Khách hàng</h1>
              <p className="page-subtitle">Quản lý danh sách và thông tin khách hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-card/50 backdrop-blur-sm">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Xuất dữ liệu</span>
            </Button>
            <Button size="sm" className="h-9 gap-1.5 shadow-sm" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Thêm khách hàng
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <ClientStatCards stats={stats} />

      {/* Controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 rounded-xl bg-muted/40 border border-border/50">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`tab-pill ${activeTab === tab.value ? "tab-pill-active" : "tab-pill-inactive"}`}
            >
              {tab.label}
              <span className={`inline-flex items-center justify-center rounded-md min-w-[20px] h-[18px] px-1 text-[10px] font-bold ${
                activeTab === tab.value ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background text-muted-foreground"
              }`}>
                {tabCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[110px] h-8 text-xs rounded-lg bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[90px] h-8 text-xs rounded-lg bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-5 w-px bg-border mx-1" />
          <span className="text-xs text-muted-foreground">
            Tổng: <strong className="text-foreground">{data?.total || 0}</strong>
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
        onCreateContract={(client) => { setContractClientId(client.id.toString()); setContractModalOpen(true); }}
      />

      <AddClientModal open={addModalOpen} onOpenChange={handleModalClose} editClient={editClient} />
      <CreateContractModal open={contractModalOpen} onOpenChange={setContractModalOpen} defaultClientId={contractClientId} />
    </div>
  );
}
