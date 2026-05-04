import type { StateCreator } from "zustand";

export interface AuthSlice {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: any, token: string) => void;
  logout: () => void;
  toggleLoading: (loading: boolean) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  toggleLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),
});
