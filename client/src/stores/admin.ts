import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  cpf: string;
  nome: string;
  email: string;
  matricula: string;
  cargo: string;
  nivel: string;
}

interface AdminStore {
  admin: Admin | null;
  setAdmin: (admin: Admin) => void;
  clearAdmin: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      setAdmin: (admin) => set({ admin }),
      clearAdmin: () => set({ admin: null }),
    }),
    {
      name: "admin-storage",
    }
  )
);
