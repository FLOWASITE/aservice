import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockBusinessFields,
  mockCirculars,
  mockBusinessSectors,
  mockApplications,
  mockEmployeesDropdown,
  mockGroupsDropdown,
  mockTaxLookup,
} from "@/mocks/clientFormMock";
import type { ClientCreatePayload, TaxLookupResult } from "@/types/clientForm";

const delay = () => new Promise<void>((r) => setTimeout(r, 200));

export function useBusinessFields() {
  return useQuery({ queryKey: ["dropdown", "businessFields"], queryFn: async () => { await delay(); return mockBusinessFields; } });
}

export function useCirculars() {
  return useQuery({ queryKey: ["dropdown", "circulars"], queryFn: async () => { await delay(); return mockCirculars; } });
}

export function useBusinessSectors() {
  return useQuery({ queryKey: ["dropdown", "businessSectors"], queryFn: async () => { await delay(); return mockBusinessSectors; } });
}

export function useApplications() {
  return useQuery({ queryKey: ["dropdown", "applications"], queryFn: async () => { await delay(); return mockApplications; } });
}

export function useEmployeesDropdown() {
  return useQuery({ queryKey: ["dropdown", "employees"], queryFn: async () => { await delay(); return mockEmployeesDropdown; } });
}

export function useGroupsDropdown() {
  return useQuery({ queryKey: ["dropdown", "groups"], queryFn: async () => { await delay(); return mockGroupsDropdown; } });
}

export function useTaxLookup() {
  return useMutation({
    mutationFn: async (taxCode: string): Promise<TaxLookupResult | null> => {
      await delay();
      return mockTaxLookup(taxCode);
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ClientCreatePayload) => {
      await new Promise<void>((r) => setTimeout(r, 500));
      return { id: Date.now(), ...payload };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}
