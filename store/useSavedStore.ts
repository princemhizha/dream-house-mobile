import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dh_saved_properties';
const MAX_FREE_SAVES = 5;

interface SavedStore {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => void;
  removeAll: () => void;
  loadPersistedState: () => Promise<void>;
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  savedIds: [],

  isSaved: (id) => get().savedIds.includes(id),

  toggleSave: (id) => {
    const current = get().savedIds;
    let next: string[];
    if (current.includes(id)) {
      next = current.filter((s) => s !== id);
    } else {
      next = [...current, id];
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    set({ savedIds: next });
  },

  removeAll: () => {
    AsyncStorage.removeItem(STORAGE_KEY);
    set({ savedIds: [] });
  },

  loadPersistedState: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        set({ savedIds: JSON.parse(raw) });
      }
    } catch {
      // use defaults
    }
  },
}));

export { MAX_FREE_SAVES };
