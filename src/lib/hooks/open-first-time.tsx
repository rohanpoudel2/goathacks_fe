import { create } from 'zustand';

interface AppState {
  isFirstTimeOpen: boolean;
  sessionType: 'passenger' | 'driver' | null;
  setFirstTimeOpen: (bool: boolean) => void;
  setSessionType: (type: 'passenger' | 'driver') => void;
}

export const useAppState = create<AppState>((set) => ({
  isFirstTimeOpen: true,
  sessionType: null,

  setFirstTimeOpen: (bool = false) => set({ isFirstTimeOpen: bool }),

  setSessionType: (type) => set({ sessionType: type }),
}));
