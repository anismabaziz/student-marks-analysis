import { create } from "zustand";

type StatsState = {
  tableID: string;
  setTableID: (module: string) => void;
};

export const useTableStore = create<StatsState>((set) => ({
  tableID: "",
  setTableID: (tableID) => set({ tableID }),
}));

export default useTableStore;
