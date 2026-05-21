import { create } from 'zustand';
import { api } from '../services/api';
import { Property } from '../types';
import { mapApiProperty, ApiProperty } from './usePropertyStore';

const MAX_FREE_SAVES = 5;

interface SavedStore {
  savedIds: string[];
  savedProperties: Property[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => Promise<void>;
  removeAll: () => Promise<void>;
  loadPersistedState: () => Promise<void>;
}

interface PaginatedPropertyList {
  results: ApiProperty[];
}

export const useSavedStore = create<SavedStore>((set, get) => ({
  savedIds: [],
  savedProperties: [],
  isLoading: false,

  isSaved: (id) => get().savedIds.includes(id),

  toggleSave: async (id) => {
    const currentlySaved = get().isSaved(id);

    // Optimistic update
    if (currentlySaved) {
      set({
        savedIds: get().savedIds.filter((s) => s !== id),
        savedProperties: get().savedProperties.filter((p) => p.id !== id),
      });
    } else {
      set({ savedIds: [...get().savedIds, id] });
    }

    try {
      if (currentlySaved) {
        await api.delete(`/users/me/saved-properties/${id}/`);
      } else {
        await api.post(`/users/me/saved-properties/${id}/`);
      }
    } catch (err: any) {
      // Revert optimistic update on error
      if (currentlySaved) {
        set({ savedIds: [...get().savedIds, id] });
      } else {
        set({ savedIds: get().savedIds.filter((s) => s !== id) });
      }

      // Re-throw so UI can show the error (e.g. save limit reached)
      throw err;
    }
  },

  removeAll: async () => {
    set({ savedIds: [], savedProperties: [] });
    try {
      await api.delete('/users/me/saved-properties/');
    } catch { /* ignore */ }
  },

  loadPersistedState: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get<{ success: boolean; data: ApiProperty[] }>('/users/me/saved-properties/');
      const properties = (res.data || []).map(mapApiProperty);
      set({
        savedProperties: properties,
        savedIds: properties.map((p) => p.id),
        isLoading: false,
      });
    } catch {
      // User not logged in or error — use empty
      set({ isLoading: false });
    }
  },
}));

export { MAX_FREE_SAVES };
