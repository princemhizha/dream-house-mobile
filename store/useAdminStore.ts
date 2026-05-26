import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  mockLandlords,
  mockActivity,
  mockOverviewStats,
  MockLandlord,
  MockActivity,
  MockOverviewStats,
} from '@/data/mockAdminData';

// ─── INTERFACES ───────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  initials: string;
}

export interface ToastData {
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

type VerificationFilter = 'all' | 'pending' | 'verified' | 'rejected' | 'unverified';

interface AdminState {
  // Auth
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;

  // Data
  landlords: MockLandlord[];
  activity: MockActivity[];
  stats: MockOverviewStats;

  // UI
  verificationFilter: VerificationFilter;
  landlordFilter: VerificationFilter;
  searchQuery: string;
  isLoading: boolean;
  activeToast: ToastData | null;

  // Actions
  initSession: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => Promise<void>;
  approveLandlord: (landlordId: string) => void;
  rejectLandlord: (landlordId: string, reason: string) => void;
  setVerificationFilter: (filter: VerificationFilter) => void;
  setLandlordFilter: (filter: VerificationFilter) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, variant: ToastData['variant']) => void;
  clearToast: () => void;
}

// ─── ADMIN CREDENTIALS ────────────────────────────────────────────────────────

const CREDENTIALS_MAP: Record<string, AdminUser & { password: string }> = {
  'admin@dreamhouse.co.zw': {
    id: 'admin_001',
    name: 'System Admin',
    email: 'admin@dreamhouse.co.zw',
    role: 'admin',
    initials: 'SA',
    password: 'Admin2024!',
  },
  'james@dreamhouse.co.zw': {
    id: 'admin_002',
    name: 'James Chirwa',
    email: 'james@dreamhouse.co.zw',
    role: 'admin',
    initials: 'JC',
    password: 'James2024!',
  },
  'priya@dreamhouse.co.zw': {
    id: 'admin_003',
    name: 'Priya Naidoo',
    email: 'priya@dreamhouse.co.zw',
    role: 'admin',
    initials: 'PN',
    password: 'Priya2024!',
  },
};

const STORAGE_KEY = 'dh_admin_session';

// ─── STORE ────────────────────────────────────────────────────────────────────

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdminLoggedIn: false,
  adminUser: null,
  landlords: [...mockLandlords],
  activity: [...mockActivity],
  stats: { ...mockOverviewStats },
  verificationFilter: 'all',
  landlordFilter: 'all',
  searchQuery: '',
  isLoading: false,
  activeToast: null,

  // ── initSession ──────────────────────────────────────────────────────────
  initSession: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { adminUser } = JSON.parse(stored) as { adminUser: AdminUser };
        if (adminUser) {
          set({ isAdminLoggedIn: true, adminUser });
        }
      }
    } catch {
      // Silently fail — start fresh
    }
  },

  // ── adminLogin ───────────────────────────────────────────────────────────
  adminLogin: async (email: string, password: string): Promise<boolean> => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1200));

    const credential = CREDENTIALS_MAP[email.toLowerCase().trim()];
    if (!credential || credential.password !== password) {
      set({ isLoading: false });
      return false;
    }

    const adminUser: AdminUser = {
      id: credential.id,
      name: credential.name,
      email: credential.email,
      role: 'admin',
      initials: credential.initials,
    };

    set({ isAdminLoggedIn: true, adminUser, isLoading: false });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ adminUser }));

    // Log login activity
    const loginActivity: MockActivity = {
      id: `act_${Date.now()}`,
      action: 'login',
      adminName: adminUser.name,
      timestamp: new Date().toISOString(),
    };
    set((s) => ({ activity: [loginActivity, ...s.activity] }));

    return true;
  },

  // ── adminLogout ──────────────────────────────────────────────────────────
  adminLogout: async () => {
    set({ isAdminLoggedIn: false, adminUser: null });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  // ── approveLandlord ──────────────────────────────────────────────────────
  approveLandlord: (landlordId: string) => {
    const { adminUser, activity, stats } = get();
    const now = new Date().toISOString();

    const landlord = get().landlords.find((l) => l.id === landlordId);
    if (!landlord) return;

    set((s) => ({
      landlords: s.landlords.map((l) =>
        l.id === landlordId
          ? {
              ...l,
              verificationStatus: 'verified',
              reviewedAt: now,
              reviewedBy: adminUser?.name ?? 'Admin',
            }
          : l,
      ),
      stats: {
        ...stats,
        pendingCount: Math.max(0, stats.pendingCount - 1),
        totalVerified: stats.totalVerified + 1,
        verifiedToday: stats.verifiedToday + 1,
      },
      activity: [
        {
          id: `act_${Date.now()}`,
          action: 'approved',
          landlordId,
          landlordName: landlord.name,
          adminName: adminUser?.name ?? 'Admin',
          timestamp: now,
        },
        ...activity,
      ],
    }));

    get().showToast('Landlord approved successfully', 'success');
  },

  // ── rejectLandlord ───────────────────────────────────────────────────────
  rejectLandlord: (landlordId: string, reason: string) => {
    const { adminUser, activity, stats } = get();
    const now = new Date().toISOString();

    const landlord = get().landlords.find((l) => l.id === landlordId);
    if (!landlord) return;

    set((s) => ({
      landlords: s.landlords.map((l) =>
        l.id === landlordId
          ? {
              ...l,
              verificationStatus: 'rejected',
              rejectionReason: reason,
              reviewedAt: now,
              reviewedBy: adminUser?.name ?? 'Admin',
            }
          : l,
      ),
      stats: {
        ...stats,
        pendingCount: Math.max(0, stats.pendingCount - 1),
        rejectedToday: stats.rejectedToday + 1,
      },
      activity: [
        {
          id: `act_${Date.now()}`,
          action: 'rejected',
          landlordId,
          landlordName: landlord.name,
          adminName: adminUser?.name ?? 'Admin',
          timestamp: now,
          note: reason,
        },
        ...activity,
      ],
    }));

    get().showToast('Submission rejected', 'error');
  },

  // ── filters ──────────────────────────────────────────────────────────────
  setVerificationFilter: (filter) => set({ verificationFilter: filter }),
  setLandlordFilter: (filter) => set({ landlordFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ── toast ─────────────────────────────────────────────────────────────────
  showToast: (message, variant) => set({ activeToast: { message, variant } }),
  clearToast: () => set({ activeToast: null }),
}));

// ─── DERIVED SELECTORS ────────────────────────────────────────────────────────

export const useFilteredLandlords = () => {
  const landlords = useAdminStore((s) => s.landlords);
  const landlordFilter = useAdminStore((s) => s.landlordFilter);
  const searchQuery = useAdminStore((s) => s.searchQuery);

  const q = searchQuery.toLowerCase().trim();
  return landlords.filter((l) => {
    const matchesFilter =
      landlordFilter === 'all' || l.verificationStatus === landlordFilter;
    const matchesSearch =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.suburb.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });
};

export const usePendingQueue = () => {
  const landlords = useAdminStore((s) => s.landlords);
  return landlords
    .filter((l) => l.verificationStatus === 'pending')
    .sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    );
};

export const useVerificationStats = () => {
  const landlords = useAdminStore((s) => s.landlords);
  return {
    pending:    landlords.filter((l) => l.verificationStatus === 'pending').length,
    verified:   landlords.filter((l) => l.verificationStatus === 'verified').length,
    rejected:   landlords.filter((l) => l.verificationStatus === 'rejected').length,
    unverified: landlords.filter((l) => l.verificationStatus === 'unverified').length,
    total:      landlords.length,
  };
};
