import { create } from 'zustand';

declare interface AlertState {
  ALERT: {
    open: boolean;
    msg: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  setALERT: (payload: Partial<AlertState['ALERT']>) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  ALERT: {
    open: false,
    msg: '',
    severity: 'success',
  },
  setALERT: (payload) => (
    set((state) => ({
      ALERT: {
        ...state.ALERT,
        ...payload,
      },
    }))
  ),
}));
