import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockServicesList } from "@/mocks/serviceMock";
import type { Service, ServiceCreatePayload } from "@/types/service";

const delay = () => new Promise((r) => setTimeout(r, 200));

export function useServicesList() {
  return useQuery<Service[]>({
    queryKey: ["services-list"],
    queryFn: async () => { await delay(); return [...mockServicesList]; },
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ServiceCreatePayload) => {
      await delay();
      const svc: Service = { id: `svc_${Date.now()}`, ...payload };
      mockServicesList.push(svc);
      return svc;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-list"] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay();
      const idx = mockServicesList.findIndex((s) => s.id === id);
      if (idx > -1) mockServicesList.splice(idx, 1);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services-list"] }),
  });
}
