import api from "@/lib/api";
import type { ClientListParams, ClientListResponse, Client } from "@/types/client";

export const clientService = {
  getClients: async (params: ClientListParams): Promise<ClientListResponse> => {
    const { data } = await api.get<ClientListResponse>("/clients", { params });
    return data;
  },

  getClient: async (id: number): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },

  createClient: async (client: Partial<Client>): Promise<Client> => {
    const { data } = await api.post<Client>("/clients", client);
    return data;
  },

  updateClient: async (id: number, client: Partial<Client>): Promise<Client> => {
    const { data } = await api.put<Client>(`/clients/${id}`, client);
    return data;
  },

  deleteClient: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
