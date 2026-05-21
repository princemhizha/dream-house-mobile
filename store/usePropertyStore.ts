import { create } from 'zustand';
import { FilterState, Property } from '../types';
import { api } from '../services/api';

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

// Map API response to frontend Property shape
interface ApiPropertyImage {
  id: number;
  image: string;
  order: number;
}

interface ApiAmenities {
  id: number;
  wifi: boolean;
  backupPower: boolean;
  borehole: boolean;
  generator: boolean;
  security: boolean;
  cctv: boolean;
  pool: boolean;
  gym: boolean;
  parking: boolean;
  garden: boolean;
  servantQuarters: boolean;
  aircon: boolean;
  petsAllowed: boolean;
  furnished: 'furnished' | 'unfurnished' | 'either';
}

interface ApiProperty {
  id: string;
  title: string;
  suburb: string;
  city: string;
  address: string;
  price: string | number;
  deposit: string | number;
  priceUnit: string;
  propertyType: string;
  listingType: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  sizeSqm: number | null;
  description: string;
  images: ApiPropertyImage[];
  amenities: ApiAmenities | null;
  availability: string;
  featured: boolean;
  verified: boolean;
  views: number;
  saves: number;
  createdAt: string;
  landlord?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    whatsapp: string | null;
    verified: boolean;
    avatar: string | null;
  };
}

function mapPropertyType(apiType: string): Property['propertyType'] {
  if (apiType === 'student_room') return 'studentRoom';
  return apiType as Property['propertyType'];
}

function mapListingType(apiType: string): Property['listingType'] {
  if (apiType === 'short_stay') return 'shortStay';
  return apiType as Property['listingType'];
}

function mapApiProperty(p: ApiProperty): Property {
  const propertyType = mapPropertyType(p.propertyType);
  const listingType = mapListingType(p.listingType);
  const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
  const deposit = typeof p.deposit === 'string' ? parseFloat(p.deposit) : p.deposit;

  return {
    id: p.id,
    title: p.title,
    suburb: p.suburb,
    city: p.city,
    address: p.address || `${p.suburb}, ${p.city}`,
    price,
    priceUnit: (p.priceUnit || 'month') as Property['priceUnit'],
    deposit: deposit || 0,
    propertyType,
    type: p.propertyType as Property['type'],
    listingType,
    category: p.category as Property['category'],
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: (p.parkingSpaces || 0) > 0,
    parkingSpaces: p.parkingSpaces || 0,
    sizeSqm: p.sizeSqm || 0,
    description: p.description || '',
    images: (p.images || []).map((img) => (typeof img === 'string' ? img : img.image)),
    amenities: p.amenities
      ? {
          wifi: p.amenities.wifi,
          backupPower: p.amenities.backupPower,
          borehole: p.amenities.borehole,
          generator: p.amenities.generator,
          security: p.amenities.security,
          cctv: p.amenities.cctv,
          pool: p.amenities.pool,
          gym: p.amenities.gym,
          parking: p.amenities.parking,
          garden: p.amenities.garden,
          servantQuarters: p.amenities.servantQuarters,
          aircon: p.amenities.aircon,
          petsAllowed: p.amenities.petsAllowed,
          furnished: p.amenities.furnished || 'unfurnished',
        }
      : {
          wifi: false, backupPower: false, borehole: false, generator: false,
          security: false, cctv: false, pool: false, gym: false,
          parking: false, garden: false, servantQuarters: false, aircon: false,
          petsAllowed: false, furnished: 'unfurnished' as const,
        },
    availability: (p.availability || 'available') as Property['availability'],
    featured: p.featured,
    verified: p.verified,
    landlord: p.landlord
      ? {
          id: p.landlord.id,
          name: p.landlord.name,
          phone: p.landlord.phone || '',
          whatsapp: p.landlord.whatsapp || '',
          email: p.landlord.email,
          verified: p.landlord.verified,
          avatar: p.landlord.avatar || undefined,
        }
      : { id: '', name: 'Unknown', phone: '', whatsapp: '', email: '', verified: false },
    createdAt: p.createdAt,
    views: p.views,
    saves: p.saves,
  };
}

interface PaginatedResponse {
  results: ApiProperty[];
  count: number;
  next: string | null;
}

interface PropertyStore {
  allProperties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  pendingFilters: FilterState;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalCount: number;

  loadProperties: (resetPage?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  loadPersistedState: () => Promise<void>;
  setFilters: (filters: FilterState) => void;
  setPendingFilters: (filters: FilterState) => void;
  applyPendingFilters: () => void;
  resetFilters: () => void;
  setQuery: (query: string) => void;
  setListingType: (type: FilterState['listingType']) => void;
  addProperty: (formData: FormData) => Promise<void>;
  getPropertyById: (id: string) => Promise<Property | null>;
}

function buildApiParams(filters: FilterState, page: number): Record<string, any> {
  const params: Record<string, any> = {
    page,
    pageSize: 20,
  };

  if (filters.query) params.search = filters.query;
  if (filters.listingType !== 'all') {
    params.listingType = filters.listingType === 'shortStay' ? 'short_stay' : filters.listingType;
  }
  if (filters.propertyType !== 'all') {
    params.propertyType = filters.propertyType === 'studentRoom' ? 'student_room' : filters.propertyType;
  }
  if (filters.minPrice > 0) params.minPrice = filters.minPrice;
  if (filters.maxPrice < 999999) params.maxPrice = filters.maxPrice;
  if (filters.minBedrooms > 0) params.minBedrooms = filters.minBedrooms;
  if (filters.bathrooms) params.bathrooms = filters.bathrooms;
  if (filters.parking === true) params.parking = 1;
  if (filters.furnished && filters.furnished !== 'either') params.furnished = filters.furnished === 'furnished';
  if (filters.shortStay) params.listingType = 'short_stay';

  return params;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  allProperties: [],
  filteredProperties: [],
  filters: defaultFilters,
  pendingFilters: defaultFilters,
  isLoading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  totalCount: 0,

  loadProperties: async (resetPage = true) => {
    const { filters } = get();
    const page = resetPage ? 1 : get().currentPage;
    set({ isLoading: true, error: null });

    try {
      const params = buildApiParams(filters, page);
      const res = await api.get<PaginatedResponse>('/properties/', params, true);
      const properties = (res.results || []).map(mapApiProperty);

      set({
        allProperties: properties,
        filteredProperties: properties,
        currentPage: 1,
        hasMore: !!res.next,
        totalCount: res.count || properties.length,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load properties', isLoading: false });
    }
  },

  loadMore: async () => {
    const { hasMore, isLoading, currentPage, filters, allProperties } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });
    try {
      const params = buildApiParams(filters, currentPage + 1);
      const res = await api.get<PaginatedResponse>('/properties/', params, true);
      const newProperties = (res.results || []).map(mapApiProperty);
      const combined = [...allProperties, ...newProperties];

      set({
        allProperties: combined,
        filteredProperties: combined,
        currentPage: currentPage + 1,
        hasMore: !!res.next,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  loadPersistedState: async () => {
    await get().loadProperties();
  },

  setFilters: (filters) => {
    set({ filters });
    get().loadProperties();
  },

  setPendingFilters: (filters) => {
    set({ pendingFilters: filters });
  },

  applyPendingFilters: () => {
    const { pendingFilters } = get();
    set({ filters: pendingFilters });
    get().loadProperties();
  },

  resetFilters: () => {
    set({ filters: defaultFilters, pendingFilters: defaultFilters });
    get().loadProperties();
  },

  setQuery: (query) => {
    const filters = { ...get().filters, query };
    set({ filters });
    get().loadProperties();
  },

  setListingType: (type) => {
    const filters = { ...get().filters, listingType: type };
    set({ filters });
    get().loadProperties();
  },

  addProperty: async (formData: FormData) => {
    await api.postForm('/properties/', formData);
    // Reload properties to include the new one
    await get().loadProperties();
  },

  getPropertyById: async (id: string) => {
    try {
      const res = await api.get<{ success: boolean; data: ApiProperty }>(`/properties/${id}/`, undefined, true);
      const apiProp = res.data ?? res;
      return mapApiProperty(apiProp);
    } catch {
      return null;
    }
  },
}));

// Export the mapper for use in other files
export { mapApiProperty };
export type { ApiProperty };
