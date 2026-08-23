/**
 * @file useStoreAlert.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { create } from "zustand";

// -------------------------------------------------------------------------------------------------
declare interface AlertState {
  ALERT: {
    open: boolean;
    msg: string;
    severity: `success` | `error` | `warning` | `info`;
  };
  setALERT: (
    payload: Partial<AlertState[`ALERT`]>
  ) => void;
}

// -------------------------------------------------------------------------------------------------
export const useStoreAlert = create<AlertState>((set) => ({
  ALERT: {
    open: false,
    msg: ``,
    severity: `success`,
  },
  setALERT: (payload) => {
    const msg: string = String(payload.msg ?? ``).trim();

    // 취소된 요청의 catch 는 사용자 오류가 아니므로 알림을 열지 않음
    if (payload.open === true && (msg === `` || msg === `requestCanceled`)) {
      return;
    }

    set((state) => ({
      ALERT: {
        ...state.ALERT,
        ...payload,
      },
    }));
  },
}));
