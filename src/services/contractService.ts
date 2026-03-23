import api from "@/lib/api";
import type { Contract, ContractCreatePayload, DropdownOption } from "@/types/contract";

export const contractService = {
  getContracts: async (): Promise<Contract[]> => {
    const { data } = await api.get<Contract[]>("/contracts");
    return data;
  },

  createContract: async (payload: ContractCreatePayload): Promise<Contract> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    const { data } = await api.post<Contract>("/contracts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getClients: async (): Promise<DropdownOption[]> => {
    const { data } = await api.get<DropdownOption[]>("/dropdown/clients");
    return data;
  },

  getServices: async (): Promise<DropdownOption[]> => {
    const { data } = await api.get<DropdownOption[]>("/dropdown/services");
    return data;
  },

  getEmployees: async (): Promise<DropdownOption[]> => {
    const { data } = await api.get<DropdownOption[]>("/dropdown/employees");
    return data;
  },

  getApplications: async (): Promise<DropdownOption[]> => {
    const { data } = await api.get<DropdownOption[]>("/dropdown/applications");
    return data;
  },
};
