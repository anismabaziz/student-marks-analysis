import { create } from "zustand";

type StatsState = {
  module: string;
  setModule: (module: string) => void;
};

export const useStatsStore = create<StatsState>((set) => ({
  module: "moyenne_semestre",
  setModule: (module) => set({ module: module }),
}));

export default useStatsStore;
