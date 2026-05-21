import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, VerificationStatus } from '../types';
import { api, setTokens, clearTokens, getAccessToken } from '../services/api';
import { getVerificationStatus, submitVerification, uploadIDImage } from '../services/verificationService';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  role: UserRole;
  avatar: string | null;
  plan: 'free' | 'premium';
  verified: boolean;
  onboardingComplete: boolean;
  isVerifiedLandlord: boolean;
  savedCount: number;
  dateJoined: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  userRole: UserRole | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  userPhone: string | null;
  hasCompletedOnboarding: boolean;
  plan: 'free' | 'premium' | null;
  verified: boolean;
  // Verification
  verificationStatus: VerificationStatus;
  rejectionReason: string | null;
  verificationSubmittedAt: string | null;
  // Guest
  isGuest: boolean;
  // Loading
  isLoading: boolean;
  // Actions
  setRole: (role: UserRole) => void;
  setSubscribed: (value: boolean) => void;
  setOnboardingComplete: () => void;
  register: (name: string, email: string, password: string, role?: UserRole, phone?: string) => Promise<void>;
  login: (name: string, email?: string, avatar?: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadPersistedState: () => Promise<void>;
  setPlan: (plan: 'free' | 'premium') => void;
  setGuestMode: (value: boolean) => void;
  setVerificationStatus: (status: VerificationStatus, rejectionReason?: string | null) => void;
  submitIDVerification: (imageUri: string) => Promise<void>;
  checkVerificationStatus: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; whatsapp?: string; avatar?: string; onboardingComplete?: boolean }) => Promise<void>;
}

const STORAGE_KEYS = {
  onboarding: 'dh_onboarding_complete',
  role: 'dh_user_role',
  subscribed: 'dh_subscribed',
  plan: 'dh_plan',
  guest: 'dh_guest',
  authenticated: 'dh_authenticated',
  userId: 'dh_user_id',
  userName: 'dh_user_name',
  userEmail: 'dh_user_email',
  userAvatar: 'dh_user_avatar',
  verificationStatus: 'dh_verification_status',
  verificationSubmittedAt: 'dh_verification_submitted_at',
  rejectionReason: 'dh_rejection_reason',
};

function applyProfile(profile: UserProfile) {
  return {
    isAuthenticated: true,
    userId: profile.id,
    userName: profile.name,
    userEmail: profile.email,
    userAvatar: profile.avatar,
    userPhone: profile.phone,
    userRole: profile.role,
    plan: profile.plan,
    verified: profile.verified,
    hasCompletedOnboarding: profile.onboardingComplete,
    isGuest: false,
  };
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isSubscribed: false,
  userRole: null,
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  userPhone: null,
  hasCompletedOnboarding: false,
  plan: null,
  verified: false,
  verificationStatus: 'unverified',
  rejectionReason: null,
  verificationSubmittedAt: null,
  isGuest: false,
  isLoading: false,

  setRole: (role) => {
    AsyncStorage.setItem(STORAGE_KEYS.role, role);
    set({ userRole: role });
  },

  setSubscribed: (value) => {
    AsyncStorage.setItem(STORAGE_KEYS.subscribed, String(value));
    set({ isSubscribed: value });
  },

  setOnboardingComplete: async () => {
    try {
      await api.patch('/users/me/', { onboardingComplete: true });
    } catch { /* ignore */ }
    set({ hasCompletedOnboarding: true });
  },

  register: async (name, email, password, role = 'renter', phone = '') => {
    set({ isLoading: true });
    try {
      const res = await api.post<{ success: boolean; user: UserProfile; tokens: { access: string; refresh: string } }>(
        '/auth/register/',
        { name, email, password, role, phone },
        true // skipAuth
      );
      await setTokens(res.tokens.access, res.tokens.refresh);
      set({
        ...applyProfile(res.user),
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  // Legacy login for compatibility — used nowhere now but kept as fallback
  login: (name, email, avatar) => {
    set({
      isAuthenticated: true,
      userName: name,
      userEmail: email ?? null,
      userAvatar: avatar ?? null,
      isGuest: false,
    });
  },

  loginWithCredentials: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post<{ success: boolean; user: UserProfile; tokens: { access: string; refresh: string } }>(
        '/auth/login/',
        { email, password },
        true // skipAuth
      );
      await setTokens(res.tokens.access, res.tokens.refresh);
      set({
        ...applyProfile(res.user),
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    await clearTokens();
    AsyncStorage.multiRemove(Object.values(STORAGE_KEYS)).catch(() => null);
    set({
      isAuthenticated: false,
      isSubscribed: false,
      userId: null,
      userName: null,
      userEmail: null,
      userAvatar: null,
      userPhone: null,
      isGuest: false,
      plan: null,
      verified: false,
      verificationStatus: 'unverified',
      rejectionReason: null,
      verificationSubmittedAt: null,
      hasCompletedOnboarding: false,
      userRole: null,
    });
  },

  setPlan: (plan) => {
    set({ plan });
  },

  setGuestMode: (value) => {
    set({ isGuest: value, isAuthenticated: false });
  },

  setVerificationStatus: (status, rejectionReason = null) => {
    set({ verificationStatus: status, rejectionReason });
  },

  submitIDVerification: async (imageUri) => {
    try {
      const imageUrl = await uploadIDImage(imageUri);
      await submitVerification(imageUrl);
      const now = new Date().toISOString();
      set({ verificationStatus: 'pending', verificationSubmittedAt: now });
    } catch (err) {
      throw err;
    }
  },

  checkVerificationStatus: async () => {
    try {
      const record = await getVerificationStatus();
      if (!record) return;
      set({
        verificationStatus: record.status,
        verificationSubmittedAt: record.submittedAt,
        rejectionReason: record.rejectionReason,
      });
    } catch { /* ignore */ }
  },

  refreshProfile: async () => {
    try {
      const profile = await api.get<UserProfile>('/users/me/');
      set(applyProfile(profile));
    } catch { /* ignore - user may not be logged in */ }
  },

  updateProfile: async (data) => {
    const updated = await api.patch<UserProfile>('/users/me/', data);
    set(applyProfile(updated));
  },

  loadPersistedState: async () => {
    try {
      // Check if we have a token stored
      const token = await getAccessToken();
      if (token) {
        // Try to load profile from API
        try {
          const profile = await api.get<UserProfile>('/users/me/');
          set({
            ...applyProfile(profile),
          });
          // Also check verification status for landlords
          if (profile.role === 'landlord') {
            get().checkVerificationStatus();
          }
          return;
        } catch {
          // Token invalid/expired and refresh failed — fall through to guest
          await clearTokens();
        }
      }

      // Check if guest mode was set
      const guest = await AsyncStorage.getItem('dh_guest');
      if (guest === 'true') {
        set({ isGuest: true, isAuthenticated: false });
      }
    } catch {
      // storage read failed, use defaults
    }
  },
}));
