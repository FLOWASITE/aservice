import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "@/services/contractService";
import { mockContracts, mockClients, mockServices, mockEmployees, mockApplications } from "@/mocks/contractMock";
import type { Contract, ContractCreatePayload, DropdownOption } from "@/types/contract";

const USE_MOCK = true;

const delay = () => new Promise((r) => setTimeout(r, 300));

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return [...mockContracts]; }
      return contractService.getContracts();
    },
  });
}

export function useDropdownClients() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "clients"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return mockClients; }
      return contractService.getClients();
    },
  });
}

export function useDropdownServices() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "services"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return mockServices; }
      return contractService.getServices();
    },
  });
}

export function useDropdownEmployees() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "employees"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return mockEmployees; }
      return contractService.getEmployees();
    },
  });
}

export function useDropdownApplications() {
  return useQuery<DropdownOption[]>({
    queryKey: ["dropdown", "applications"],
    queryFn: async () => {
      if (USE_MOCK) { await delay(); return mockApplications; }
      return contractService.getApplications();
    },
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ContractCreatePayload) => {
      if (USE_MOCK) {
        await delay();
        const newContract: Contract = {
          id: Date.now(),
          khach_hang_id: payload.khach_hang_id,
          khach_hang_ten: mockClients.find((c) => c.id === payload.khach_hang_id)?.ten || "",
          so_hop_dong: payload.so_hop_dong,
          trang_thai: payload.trang_thai,
          dich_vu_id: payload.dich_vu_id,
          dich_vu_ten: mockServices.find((s) => s.id === payload.dich_vu_id)?.ten || "",
          gia_tri_hop_dong: payload.gia_tri_hop_dong,
          cach_tinh_phi: payload.cach_tinh_phi,
          ngay_bat_dau: payload.ngay_bat_dau,
          ngay_ket_thuc: payload.ngay_ket_thuc,
          nhan_vien_phu_trach_id: payload.nhan_vien_phu_trach_id,
          nhan_vien_phu_trach_ten: mockEmployees.find((e) => e.id === payload.nhan_vien_phu_trach_id)?.ten || "",
          nhan_vien_ho_tro_id: payload.nhan_vien_ho_tro_id,
          nhan_vien_ho_tro_ten: payload.nhan_vien_ho_tro_id
            ? mockEmployees.find((e) => e.id === payload.nhan_vien_ho_tro_id)?.ten || null
            : null,
          file_hop_dong: null,
          ghi_chu: payload.ghi_chu,
          phan_mem: payload.phan_mem,
          ung_dung_id: payload.ung_dung_id,
          ung_dung_ten: payload.ung_dung_id
            ? mockApplications.find((a) => a.id === payload.ung_dung_id)?.ten || null
            : null,
          cau_hinh_luong: payload.cau_hinh_luong,
          tien_luong: payload.tien_luong,
          created_at: new Date().toISOString(),
        };
        mockContracts.push(newContract);
        return newContract;
      }
      return contractService.createContract(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
