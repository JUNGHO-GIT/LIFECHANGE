/**
 * @file useStoreLoading.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { create } from "zustand";

// -------------------------------------------------------------------------------------------------
declare interface LoadingState {
  LOADING: boolean;
  NAVIGATING: boolean;
  setLOADING: (loading: boolean) => void;
  setNAVIGATING: (navigating: boolean) => void;
}

// -------------------------------------------------------------------------------------------------
export const useStoreLoading = create<LoadingState>((set) => ({
  LOADING: false,
  NAVIGATING: false,
  setLOADING: (loading) => {
    set({ LOADING: loading });
  },
  setNAVIGATING: (navigating) => {
    set({ NAVIGATING: navigating });
  },
}));
