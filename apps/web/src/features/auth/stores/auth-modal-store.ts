"use client";

import { create } from "zustand";

type AuthModalMode = "signin" | "signup";

type AuthModalStore = {
  isOpen: boolean;
  mode: AuthModalMode;
  open: (mode?: AuthModalMode) => void;
  close: () => void;
};

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  mode: "signin",
  open: (mode = "signin") => set({ isOpen: true, mode }),
  close: () => set({ isOpen: false }),
}));
