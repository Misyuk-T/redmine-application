import { create } from "zustand";

const useWorkLogsStore = create((set) => ({
  workLogs: null,
  error: "",
  addWorkLogs: (workLogs) => set({ workLogs }),
  resetWorkLogs: () => set({ workLogs: null }),
  editWorkLog: (date, workLog) =>
    set((state) => ({
      workLogs: {
        ...state.workLogs,
        [date]: workLog,
      },
    })),
  deleteWorkLog: (date) => {
    set((state) => {
      const oldState = { ...state.workLogs };
      delete oldState[date];

      return { workLogs: oldState };
    });
  },
  addWorkLogsError: (error) => set({ error }),
  resetWorkLogsError: () => set({ error: "" }),
}));

export default useWorkLogsStore;
