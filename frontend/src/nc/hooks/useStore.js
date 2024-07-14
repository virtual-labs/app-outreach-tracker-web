import { create } from "zustand";

const useStore = create((set) => ({
  user: {},
  setUser: (newUser) => set({ user: newUser }),
  instituteList: [],
  setInstituteList: (newList) => set({ instituteList: newList }),
  help: "",
  setHelp: (newHelp) => set({ help: newHelp }),
  nodalCenterData: [],
  setNodalCenterData: (data) => set({ nodalCenterData: data }),
}));

export default useStore;
