/**
 * @file useStoreConfirm.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { create } from "zustand";

// -------------------------------------------------------------------------------------------------
declare interface ConfirmState {
  CONFIRM: {
    open: boolean;
    msg: string;
    callback?: (confirmed: boolean) => void;
  };
  setCONFIRM: (
    payload: Partial<ConfirmState[`CONFIRM`]>,
    callback?: (confirmed: boolean) => void
  ) => void;
}

// -------------------------------------------------------------------------------------------------
export const useStoreConfirm = create<ConfirmState>((set) => ({
  CONFIRM: {
    open: false,
    msg: ``,
    callback: undefined,
  },
  setCONFIRM: (payload, callback) => {
    set((state) => ({
      CONFIRM: {
        ...state.CONFIRM,
        ...payload,
        // 닫힐 때는 콜백을 버려 이전 confirm 의 처리기가 다음 요청에 재사용되지 않게 함
        callback: payload.open === false ? undefined : (callback ?? state.CONFIRM.callback),
      },
    }));
  },
}));
