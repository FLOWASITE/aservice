import { useQuery } from "@tanstack/react-query";
import {
  mockClientDropdown, getMockRevenueChart, getMockVatSummary,
  getMockCredentials, getMockServiceInfo, getMockTaxDeclaration,
  getMockAnnualTax, getMockBusinessStatus,
} from "@/mocks/businessStatusMock";

const delay = () => new Promise<void>((r) => setTimeout(r, 300));

export function useClientDropdown() {
  return useQuery({
    queryKey: ["clients", "dropdown"],
    queryFn: async () => { await delay(); return mockClientDropdown; },
  });
}

export function useRevenueChart(clientId: number | null) {
  return useQuery({
    queryKey: ["business-status", "revenue-chart", clientId],
    queryFn: async () => { await delay(); return getMockRevenueChart(); },
    enabled: !!clientId,
  });
}

export function useVatSummary(clientId: number | null) {
  return useQuery({
    queryKey: ["business-status", "vat-summary", clientId],
    queryFn: async () => { await delay(); return getMockVatSummary(); },
    enabled: !!clientId,
  });
}

export function useCredentials(clientId: number | null) {
  return useQuery({
    queryKey: ["business-status", "credentials", clientId],
    queryFn: async () => { await delay(); return getMockCredentials(); },
    enabled: !!clientId,
  });
}

export function useServiceInfo(clientId: number | null) {
  return useQuery({
    queryKey: ["business-status", "service-info", clientId],
    queryFn: async () => { await delay(); return getMockServiceInfo(); },
    enabled: !!clientId,
  });
}

export function useTaxDeclaration(clientId: number | null) {
  return useQuery({
    queryKey: ["business-status", "tax-declaration", clientId],
    queryFn: async () => { await delay(); return getMockTaxDeclaration(); },
    enabled: !!clientId,
  });
}

export function useAnnualTax(clientId: number | null, year: number) {
  return useQuery({
    queryKey: ["business-status", "annual-tax", clientId, year],
    queryFn: async () => { await delay(); return getMockAnnualTax(); },
    enabled: !!clientId,
  });
}

export function useBusinessStatusData(clientId: number | null, year: number) {
  return useQuery({
    queryKey: ["business-status", "data", clientId, year],
    queryFn: async () => { await delay(); return getMockBusinessStatus(); },
    enabled: !!clientId,
  });
}
