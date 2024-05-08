import { create } from "zustand";

const useStore = create((set) => ({
  user: {},
  setUser: (newUser) => set({ user: newUser }),
  instituteList: [],
  setInstituteList: (newList) => set({ instituteList: newList }),
}));

export default useStore;
