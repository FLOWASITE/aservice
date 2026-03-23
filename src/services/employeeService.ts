import api from "@/lib/api";
import type { Employee, EmployeeStats, EmployeeClient, EmployeeCreatePayload, Group, GroupCreatePayload } from "@/types/employee";

export const employeeService = {
  getStats: () => api.get<EmployeeStats>("/employees/stats").then((r) => r.data),
  getEmployees: (params: Record<string, unknown>) => api.get<Employee[]>("/employees", { params }).then((r) => r.data),
  getEmployee: (id: number) => api.get<Employee>(`/employees/${id}`).then((r) => r.data),
  getEmployeeClients: (id: number) => api.get<EmployeeClient[]>(`/employees/${id}/clients`).then((r) => r.data),
  createEmployee: (data: EmployeeCreatePayload) => api.post<Employee>("/employees", data).then((r) => r.data),
  updateEmployee: (id: number, data: Partial<EmployeeCreatePayload>) => api.put<Employee>(`/employees/${id}`, data).then((r) => r.data),
  deleteEmployee: (id: number) => api.delete(`/employees/${id}`),

  getGroups: () => api.get<Group[]>("/groups").then((r) => r.data),
  createGroup: (data: GroupCreatePayload) => api.post<Group>("/groups", data).then((r) => r.data),
  updateGroup: (id: number, data: GroupCreatePayload) => api.put<Group>(`/groups/${id}`, data).then((r) => r.data),
  deleteGroup: (id: number) => api.delete(`/groups/${id}`),
};
