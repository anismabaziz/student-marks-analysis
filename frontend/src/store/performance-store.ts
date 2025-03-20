import { create } from "zustand";

type StatsState = {
  module: string;
  setModule: (module: string) => void;
};

export const usePerformanceStore = create<StatsState>((set) => ({
  module: "",
  setModule: (module) => set({ module: module }),
}));

export default usePerformanceStore;
