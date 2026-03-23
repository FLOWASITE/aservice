import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockContracts, mockClients, mockServices, mockEmployees, mockApplications } from "@/mocks/contractMock";
import type { Contract, ContractCreatePayload, DropdownOption } from "@/types/contract";

const USE_MOCK = true;
const delay = () => new Promise((r) => setTimeout(r, 300));

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return [...mockContracts]; }
      return [];
    },
  });
}

export function useDropdownClients() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "contract-clients"],
    queryFn: async () => { await delay(); return mockClients; },
  });
}

export function useDropdownServices() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "contract-services"],
    queryFn: async () => { await delay(); return mockServices; },
  });
}

export function useDropdownEmployees() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "contract-employees"],
    queryFn: async () => { await delay(); return mockEmployees; },
  });
}

export function useDropdownApplications() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "contract-applications"],
    queryFn: async () => { await delay(); return mockApplications; },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ContractCreatePayload) => {
      await delay();
      const staff = mockEmployees.find((e) => e.id === Number(payload.staffId));
      const newContract: Contract = {
        id: `con_${Date.now()}`,
        clientId: payload.clientId,
        clientName: mockClients.find((c) => c.id === Number(payload.clientId))?.ten || "",
        clientInitial: "?",
        clientInitialColor: "#9E9E9E",
        contractNumber: payload.contractNumber,
        startDate: payload.startDate,
        endDate: payload.endDate || null,
        contractValue: payload.contractValue,
        feeType: payload.feeType,
        feeTypeLabel: payload.feeType === "monthly" ? "Tháng" : "Năm",
        status: payload.status,
        staffId: payload.staffId,
        staffName: staff?.ten || "",
        staffInitial: staff?.ten?.[staff.ten.length - 1]?.[0] || "?",
        staffInitialColor: "#9E9E9E",
        supportStaff: [],
        serviceId: payload.serviceId,
        serviceName: mockServices.find((s) => s.id === Number(payload.serviceId))?.ten || "",
        software: payload.software,
        applications: payload.applications,
        salaryType: payload.salaryType,
        salaryAmount: payload.salaryAmount,
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      };
      mockContracts.push(newContract);
      return newContract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay();
      const idx = mockContracts.findIndex((c) => c.id === id);
      if (idx > -1) mockContracts.splice(idx, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
