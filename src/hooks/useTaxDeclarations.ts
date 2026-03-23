import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMockTaxDeclarations, mockTaxTypes } from "@/mocks/taxDeclarationMock";
import type { TaxView, TaxDeclarationStatus } from "@/types/taxDeclaration";

const delay = () => new Promise<void>((r) => setTimeout(r, 300));

export function useTaxTypes() {
  return useQuery({
    queryKey: ["tax-types"],
    queryFn: async () => { await delay(); return mockTaxTypes; },
  });
}

interface TaxDeclParams {
  view: TaxView;
  taxType: string;
  year: number;
  page: number;
  limit: number;
  search?: string;
}

export function useTaxDeclarations(params: TaxDeclParams) {
  return useQuery({
    queryKey: ["tax-declarations", params],
    queryFn: async () => {
      await delay();
      return getMockTaxDeclarations(params.view, params.page, params.limit, params.search);
    },
  });
}

export function useUpdateTaxStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_payload: { id: string; period: string; status: TaxDeclarationStatus; deadline?: string }) => {
      await new Promise<void>((r) => setTimeout(r, 300));
      return { success: true };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tax-declarations"] }),
  });
}
