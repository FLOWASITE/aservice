import { useQuery } from "@tanstack/react-query";
import { clientService } from "@/services/clientService";
import { getMockClientList } from "@/mocks/clientMock";
import type { ClientListParams, ClientListResponse } from "@/types/client";

const USE_MOCK = true; // Toggle to false when API is ready

export function useClients(params: ClientListParams) {
  return useQuery<ClientListResponse>({
    queryKey: ["clients", params],
    queryFn: async () => {
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 300));
        return getMockClientList(params.status || "dang_thuc_hien_ke_toan", params.search);
      }
      return clientService.getClients(params);
    },
  });
}
