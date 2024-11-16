import { create } from "zustand";

const useJiraStore = create((set) => ({
  user: null,
  jiraWorklogs: [],
  assignedIssues: [],
  additionalAssignedIssues: {},
  additionalJiraWorklogs: {},
  organizationURL: "",
  addUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),

  addJiraWorklogs: (jiraWorklogs) => set({ jiraWorklogs }),
  resetJiraWorklogs: () => set({ jiraWorklogs: [] }),
  addAssignedIssues: (assignedIssues) => set({ assignedIssues }),
  resetAssignedIssues: () => set({ assignedIssues: [] }),

  addAdditionalAssignedIssues: (jiraUrl, issues) =>
    set((state) => ({
      additionalAssignedIssues: {
        ...state.additionalAssignedIssues,
        [jiraUrl]: issues,
      },
    })),
  addAdditionalJiraWorklogs: (jiraUrl, worklogs) =>
    set((state) => ({
      additionalJiraWorklogs: {
        ...state.additionalJiraWorklogs,
        [jiraUrl]: worklogs,
      },
    })),

  addOrganizationURL: (organizationURL) => set({ organizationURL }),
  resetOrganizationURL: () => set({ organizationURL: "" }),
  resetAdditionalAssignedIssues: () => set({ additionalAssignedIssues: {} }),
  resetAdditionalJiraWorklogs: () => set({ additionalJiraWorklogs: {} }),
}));

export default useJiraStore;
