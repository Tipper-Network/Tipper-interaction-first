"use client";

import { create } from "zustand";
import { getSessionUser } from "../api/auth_api";

export enum UserRole__Enum {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
}

type User = {
  email_verified: boolean;
  federated_identity_user: boolean;
  user_role: UserRole__Enum;
  email: string;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  reputation: number;
  interests_setup: boolean;
} | null;

type AuthStore = {
  user: User | null;
  profile: Profile;
  loading: boolean;
  refetch: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  refetch: async () => {
    set({ loading: true });
    try {
      const data = await getSessionUser();
      set({
        user: data.user ?? null,
        profile: data.profile ?? null,
      });
    } catch (err) {
      set({ user: null, profile: null });
    } finally {
      set({ loading: false });
    }
  },
}));
