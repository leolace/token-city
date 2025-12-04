import type { Reporter, User } from "@app/types/user";
import { create } from "zustand";

interface UserState {
  reporter: Reporter | null;
  user: User | null;
}

interface SetReporterAction {
  setReporter: (reporter: Reporter) => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState & SetReporterAction>((set) => ({
  reporter: null,
  setReporter: (reporter) => set({ reporter }),
  user: null,
  setUser: (user: User) => set({ user }),
}));
