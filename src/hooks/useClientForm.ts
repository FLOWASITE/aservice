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
import { addClientToMock } from "@/mocks/clientMock";
import type { ClientCreatePayload, TaxLookupResult } from "@/types/clientForm";
import type { Client, ClientStatus } from "@/types/client";

const delay = () => new Promise<void>((r) => setTimeout(r, 200));

const AVATAR_COLORS = [
  "hsl(215 70% 42%)", "hsl(152 60% 42%)", "hsl(0 72% 51%)",
  "hsl(280 60% 50%)", "hsl(38 92% 50%)", "hsl(195 70% 45%)",
];

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

      const newId = Date.now();
      const initial = payload.name.charAt(0) || "?";
      const status: ClientStatus = "dang_thuc_hien_ke_toan";

      const newClient: Client = {
        id: newId,
        stt: newId,
        ten: payload.name,
        ten_viet_tat: initial,
        nhom: "—",
        nhan_vien_phu_trach: "—",
        nhan_vien_ho_tro: [],
        ung_dung: false,
        ung_dung_list: [],
        phi_dich_vu_toi_thieu: 0,
        phi_dich_vu_toi_da: 0,
        cong_no: 0,
        hoa_don_di: 0,
        hoa_don_dien_tu: "chua_ket_noi",
        thue_dien_tu: "chua_nop",
        chu_ky_so: "chua_dang_ky",
        trang_thai: status,
        avatar_color: AVATAR_COLORS[newId % AVATAR_COLORS.length],
      };

      addClientToMock(newClient);
      return newClient;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}