import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from "./auth.store";

// type Store = AuthSlice & UserSlice & PostSlice & ChatSlice;
type Store = AuthSlice;

export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      //   ...createBlogSlice(...a),
    }),
    {
      name: "app-storage",

      // ⚠️ Persist only what you need
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
