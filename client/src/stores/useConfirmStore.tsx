// useConfirmStore.tsx

import { create } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
declare type ConfirmState = {
  CONFIRM: {
    open: boolean;
    confirm: boolean;
    msg: string;
    callback?: (confirmed: boolean) => void;
  };
  setCONFIRM: (payload: Partial<ConfirmState['CONFIRM']>, callback?: (confirmed: boolean) => void) => void;
}

// -------------------------------------------------------------------------------------------------
export const useConfirmStore = create<ConfirmState>((set) => ({
  CONFIRM: {
    open: false,
    confirm: false,
    msg: '',
    callback: undefined,
  },
  setCONFIRM: (payload, callback) => {
    set((state) => ({
      CONFIRM: {
        ...state.CONFIRM,
        ...payload,
        callback: callback || state.CONFIRM.callback,
      },
    }));
  },
}));