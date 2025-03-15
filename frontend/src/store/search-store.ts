import { create } from "zustand";

type SearchState = {
  searchTerm: string;
  page: number;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: "",
  page: 1,
  setSearchTerm: (term) => set({ searchTerm: term, page: 1 }),
  setPage: (page) => set({ page }),
}));

export default useSearchStore;
