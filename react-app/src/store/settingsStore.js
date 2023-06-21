import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const useSettingsStore = create((set) => ({
  settings: null,
  currentSettings: null,
  addSettings: (settings) => set({ settings }),
  resetSettings: () => set({ settings: null }),
  updateSettings: (settingData) => {
    set((state) => {
      const existingId = settingData.id;
      let settings = { ...state.settings };

      if (existingId) {
        settings[existingId] = { ...settings[existingId], ...settingData };
      } else {
        const id = uuidv4();
        settings = { ...state.settings, [id]: { ...settingData, id } };
      }

      return { settings };
    });
  },
  deleteSetting: (id) => {
    set((state) => {
      const settings = { ...state.settings };
      delete settings[id];
      return { settings };
    });
  },
  addCurrentSettings: (currentSettings) => set({ currentSettings }),
  resetCurrentSettings: () => set({ currentSettings: null }),
}));

export default useSettingsStore;
