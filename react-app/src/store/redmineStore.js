import { create } from "zustand";

const useRedmineStore = create((set) => ({
  user: null,
  redmineWorkLogs: [],
  projects: [],
  error: "",
  addWorkLogs: (workLogs) => set({ redmineWorkLogs: workLogs }),
  resetWorkLogs: () => set({ redmineWorkLogs: [] }),
  addProjects: (projects) => set({ projects: projects }),
  resetProjects: () => set({ projects: [] }),
  addUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  addWorkLogsError: (error) => set({ error }),
  resetWorkLogsError: () => set({ error: "" }),
}));

export default useRedmineStore;
