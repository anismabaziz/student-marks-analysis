import { create } from "zustand";

type StatsState = {
  tableName: string;
  setTableName: (module: string) => void;
};

export const useTableStore = create<StatsState>((set) => ({
  tableName: "",
  setTableName: (tableName) => set({ tableName }),
}));

export default useTableStore;
