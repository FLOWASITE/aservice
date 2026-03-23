import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/services/employeeService";
import {
  getMockEmployeeStats,
  getMockEmployeeTabCounts,
  getMockEmployees,
  getMockEmployeeClients,
  getMockEmployeeTotals,
  mockGroups,
} from "@/mocks/employeeMock";
import type { EmployeeStatus, EmployeeCreatePayload, GroupCreatePayload, Group } from "@/types/employee";

const USE_MOCK = true;
const delay = () => new Promise<void>((r) => setTimeout(r, 250));

export function useEmployeeStats() {
  return useQuery({
    queryKey: ["employees", "stats"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return getMockEmployeeStats(); }
      return employeeService.getStats();
    },
  });
}

export function useEmployeeTabCounts() {
  return useQuery({
    queryKey: ["employees", "tabCounts"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return getMockEmployeeTabCounts(); }
      return getMockEmployeeTabCounts(); // API would return this
    },
  });
}

export function useEmployees(status: EmployeeStatus, search?: string) {
  return useQuery({
    queryKey: ["employees", status, search],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return getMockEmployees(status, search); }
      return employeeService.getEmployees({ status, search });
    },
  });
}

export function useEmployeeTotals() {
  return useQuery({
    queryKey: ["employees", "totals"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return getMockEmployeeTotals(); }
      return getMockEmployeeTotals();
    },
  });
}

export function useEmployeeClients(employeeId: number | null) {
  return useQuery({
    queryKey: ["employees", employeeId, "clients"],
    enabled: !!employeeId,
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return getMockEmployeeClients(employeeId!); }
      return employeeService.getEmployeeClients(employeeId!);
    },
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EmployeeCreatePayload) => {
      if (USE_MOCK) { await delay(); return { id: Date.now(), ...payload } as any; }
      return employeeService.createEmployee(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (USE_MOCK) {
        await delay();
        // Actually remove from mock data
        const { removeEmployeeFromMock } = await import("@/mocks/employeeMock");
        removeEmployeeFromMock(id);
        return;
      }
      return employeeService.deleteEmployee(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
  });
}

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return mockGroups; }
      return employeeService.getGroups();
    },
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: GroupCreatePayload) => {
      if (USE_MOCK) {
        await delay();
        const newGroup: Group = { id: Date.now(), ten: payload.ten, truong_nhom: "", truong_nhom_id: payload.truong_nhom_id, so_thanh_vien: 0, mo_ta: payload.mo_ta || "" };
        mockGroups.push(newGroup);
        return newGroup;
      }
      return employeeService.createGroup(payload);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GroupCreatePayload }) => {
      if (USE_MOCK) {
        await delay();
        const idx = mockGroups.findIndex((g) => g.id === id);
        if (idx >= 0) Object.assign(mockGroups[idx], data);
        return mockGroups[idx];
      }
      return employeeService.updateGroup(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (USE_MOCK) {
        await delay();
        const idx = mockGroups.findIndex((g) => g.id === id);
        if (idx >= 0) mockGroups.splice(idx, 1);
        return;
      }
      return employeeService.deleteGroup(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["groups"] }),
  });
}
