import { create } from "zustand";

const useRedmineStore = create((set) => ({
  user: null,
  projects: [],
  error: "",
  latestActivity: [],
  addProjects: (projects) => set({ projects: projects }),
  resetProjects: () => set({ projects: [] }),
  addUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  addLatestActivity: (latestActivity) => set({ latestActivity }),
  resetLatestActivity: () => set({ latestActivity: [] }),
  addWorkLogsError: (error) => set({ error }),
  resetWorkLogsError: () => set({ error: "" }),
}));

export default useRedmineStore;
