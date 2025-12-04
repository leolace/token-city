import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Operator {
  cpf: string;
  nome: string;
  email: string;
  matricula: string;
  cargo: string;
  nivel: string;
  departamentos: string[];
}

interface OperatorStore {
  operator: Operator | null;
  setOperator: (operator: Operator) => void;
  clearOperator: () => void;
}

export const useOperatorStore = create<OperatorStore>()(
  persist(
    (set) => ({
      operator: null,
      setOperator: (operator) => set({ operator }),
      clearOperator: () => set({ operator: null }),
    }),
    {
      name: "operator-storage",
    }
  )
);
