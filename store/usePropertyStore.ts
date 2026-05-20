import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { FilterState, Property } from '../types';
import { mockProperties } from '../data/mockProperties';

const STORAGE_KEY = 'dh_custom_properties';

const defaultFilters: FilterState = {
  query: '',
  listingType: 'all',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 999999,
  minBedrooms: 0,
  bathrooms: null,
  parking: null,
  amenities: {},
  furnished: null,
  shortStay: false,
};

function applyFilters(properties: Property[], filters: FilterState): Property[] {
  return properties.filter((p) => {
    if (
      filters.query &&
      !p.title.toLowerCase().includes(filters.query.toLowerCase()) &&
      !p.suburb.toLowerCase().includes(filters.query.toLowerCase()) &&
      !p.city.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }
    if (filters.listingType !== 'all' && p.listingType !== filters.listingType) return false;
    if (filters.propertyType !== 'all' && p.propertyType !== filters.propertyType) return false;
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
    if (filters.minBedrooms > 0 && p.bedrooms < filters.minBedrooms) return false;
    if (filters.parking === true && !p.amenities.parking) return false;
    if (filters.furnished && filters.furnished !== 'either') {
      if (p.amenities.furnished !== filters.furnished) return false;
    }
    if (filters.shortStay && p.listingType !== 'shortStay') return false;

    const amenityKeys = Object.keys(filters.amenities) as (keyof typeof filters.amenities)[];
    for (const key of amenityKeys) {
      if (filters.amenities[key] && !p.amenities[key]) return false;
    }

    return true;
  });
}

interface PropertyStore {
  customProperties: Property[];
  allProperties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  pendingFilters: FilterState;
  isLoading: boolean;
  loadPersistedState: () => Promise<void>;
  setFilters: (filters: FilterState) => void;
  setPendingFilters: (filters: FilterState) => void;
  applyPendingFilters: () => void;
  resetFilters: () => void;
  setQuery: (query: string) => void;
  setListingType: (type: FilterState['listingType']) => void;
  addProperty: (property: Property) => Promise<void>;
}

function combineProperties(customProperties: Property[]) {
  return [...customProperties, ...mockProperties];
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  customProperties: [],
  allProperties: mockProperties,
  filteredProperties: mockProperties,
  filters: defaultFilters,
  pendingFilters: defaultFilters,
  isLoading: false,

  loadPersistedState: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const customProperties = raw ? (JSON.parse(raw) as Property[]) : [];
      const allProperties = combineProperties(customProperties);
      const filters = get().filters;

      set({
        customProperties,
        allProperties,
        filteredProperties: applyFilters(allProperties, filters),
      });
    } catch {
      // use seeded properties
    }
  },

  setFilters: (filters) => {
    const allProperties = get().allProperties;
    set({
      filters,
      filteredProperties: applyFilters(allProperties, filters),
    });
  },

  setPendingFilters: (filters) => {
    set({ pendingFilters: filters });
  },

  applyPendingFilters: () => {
    const { pendingFilters, allProperties } = get();
    set({
      filters: pendingFilters,
      filteredProperties: applyFilters(allProperties, pendingFilters),
    });
  },

  resetFilters: () => {
    set({
      filters: defaultFilters,
      pendingFilters: defaultFilters,
      filteredProperties: get().allProperties,
    });
  },

  setQuery: (query) => {
    const { filters, allProperties } = get();
    const newFilters = { ...filters, query };
    set({
      filters: newFilters,
      filteredProperties: applyFilters(allProperties, newFilters),
    });
  },

  setListingType: (type) => {
    const { filters, allProperties } = get();
    const newFilters = { ...filters, listingType: type };
    set({
      filters: newFilters,
      filteredProperties: applyFilters(allProperties, newFilters),
    });
  },

  addProperty: async (property) => {
    const customProperties = [property, ...get().customProperties];
    const allProperties = combineProperties(customProperties);
    const filters = get().filters;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customProperties));

    set({
      customProperties,
      allProperties,
      filteredProperties: applyFilters(allProperties, filters),
    });
  },
}));
