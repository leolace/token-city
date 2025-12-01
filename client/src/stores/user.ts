import type { Reporter } from "@app/types/user";
import { create } from "zustand";

interface UserState {
  reporter: Reporter | null;
}

interface SetReporterAction {
  setReporter: (reporter: Reporter) => void;
}

export const useUserStore = create<UserState & SetReporterAction>((set) => ({
  reporter: null,
  setReporter: (reporter: Reporter) => set({ reporter }),
}));
