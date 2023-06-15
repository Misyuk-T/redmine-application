import { create } from "zustand";

const useJiraStore = create((set) => ({
  user: null,
  jiraWorklogs: [],
  organizationURL: "",
  error: "",
  addUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  addJiraWorklogs: (jiraWorklogs) => set({ jiraWorklogs }),
  resetJiraWorklogs: () => set({ jiraWorklogs: [] }),
  addOrganizationURL: (organizationURL) => set({ organizationURL }),
  resetOrganizationURL: () => set({ organizationURL: "" }),
  addJiraError: (error) => set({ error }),
  resetJiraError: () => set({ error: "" }),
}));

export default useJiraStore;