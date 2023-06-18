import { create } from "zustand";

const useJiraStore = create((set) => ({
  user: null,
  jiraWorklogs: [],
  assignedIssues: [],
  organizationURL: "",
  addUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  addJiraWorklogs: (jiraWorklogs) => set({ jiraWorklogs }),
  resetJiraWorklogs: () => set({ jiraWorklogs: [] }),
  addAssignedIssues: (assignedIssues) => set({ assignedIssues }),
  resetAssignedIssues: () => set({ assignedIssues: [] }),
  addOrganizationURL: (organizationURL) => set({ organizationURL }),
  resetOrganizationURL: () => set({ organizationURL: "" }),
}));

export default useJiraStore;
