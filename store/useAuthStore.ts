import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, VerificationStatus } from '../types';
import { getVerificationStatus, submitVerification, uploadIDImage } from '../services/verificationService';

interface AuthStore {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  userRole: UserRole | null;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  hasCompletedOnboarding: boolean;
  plan: 'free' | 'premium' | null;
  // Verification
  verificationStatus: VerificationStatus;
  rejectionReason: string | null;
  verificationSubmittedAt: string | null;
  // Guest
  isGuest: boolean;
  // Actions
  setRole: (role: UserRole) => void;
  setSubscribed: (value: boolean) => void;
  setOnboardingComplete: () => void;
  login: (name: string, email?: string, avatar?: string) => void;
  logout: () => void;
  loadPersistedState: () => Promise<void>;
  setPlan: (plan: 'free' | 'premium') => void;
  setGuestMode: (value: boolean) => void;
  setVerificationStatus: (status: VerificationStatus, rejectionReason?: string | null) => void;
  submitIDVerification: (imageUri: string) => Promise<void>;
  checkVerificationStatus: () => Promise<void>;
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

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  isSubscribed: false,
  userRole: null,
  userId: null,
  userName: null,
  userEmail: null,
  userAvatar: null,
  hasCompletedOnboarding: false,
  plan: null,
  verificationStatus: 'unverified',
  rejectionReason: null,
  verificationSubmittedAt: null,
  isGuest: false,

  setRole: (role) => {
    AsyncStorage.setItem(STORAGE_KEYS.role, role);
    set({ userRole: role });
  },

  setSubscribed: (value) => {
    AsyncStorage.setItem(STORAGE_KEYS.subscribed, String(value));
    set({ isSubscribed: value });
  },

  setOnboardingComplete: () => {
    AsyncStorage.setItem(STORAGE_KEYS.onboarding, 'true');
    set({ hasCompletedOnboarding: true });
  },

  login: (name, email, avatar) => {
    const userId = `u_${Date.now()}`;
    AsyncStorage.multiSet([
      [STORAGE_KEYS.authenticated, 'true'],
      [STORAGE_KEYS.userId, userId],
      [STORAGE_KEYS.userName, name],
      [STORAGE_KEYS.userEmail, email ?? ''],
      [STORAGE_KEYS.userAvatar, avatar ?? ''],
      [STORAGE_KEYS.guest, 'false'],
    ]);
    set({
      isAuthenticated: true,
      userName: name,
      userEmail: email ?? null,
      userAvatar: avatar ?? null,
      userId,
      isGuest: false,
    });
  },

  logout: () => {
    AsyncStorage.multiRemove([
      STORAGE_KEYS.onboarding,
      STORAGE_KEYS.role,
      STORAGE_KEYS.subscribed,
      STORAGE_KEYS.plan,
      STORAGE_KEYS.guest,
      STORAGE_KEYS.authenticated,
      STORAGE_KEYS.userId,
      STORAGE_KEYS.userName,
      STORAGE_KEYS.userEmail,
      STORAGE_KEYS.userAvatar,
      STORAGE_KEYS.verificationStatus,
      STORAGE_KEYS.verificationSubmittedAt,
      STORAGE_KEYS.rejectionReason,
    ]);
    set({
      isAuthenticated: false,
      isSubscribed: false,
      userId: null,
      userName: null,
      userEmail: null,
      userAvatar: null,
      isGuest: false,
      plan: null,
      verificationStatus: 'unverified',
      rejectionReason: null,
      verificationSubmittedAt: null,
      hasCompletedOnboarding: false,
      userRole: null,
    });
  },

  setPlan: (plan) => {
    AsyncStorage.setItem(STORAGE_KEYS.plan, plan);
    set({ plan });
  },

  setGuestMode: (value) => {
    AsyncStorage.setItem(STORAGE_KEYS.guest, String(value));
    AsyncStorage.setItem(STORAGE_KEYS.authenticated, 'false');
    set({ isGuest: value, isAuthenticated: false });
  },

  setVerificationStatus: (status, rejectionReason = null) => {
    AsyncStorage.setItem(STORAGE_KEYS.verificationStatus, status);
    if (rejectionReason !== null) {
      AsyncStorage.setItem(STORAGE_KEYS.rejectionReason, rejectionReason);
    }
    set({ verificationStatus: status, rejectionReason });
  },

  submitIDVerification: async (imageUri) => {
    const { userId } = get();
    if (!userId) return;
    const now = new Date().toISOString();
    const imageUrl = await uploadIDImage(imageUri, userId);
    await submitVerification(userId, imageUrl);
    AsyncStorage.setItem(STORAGE_KEYS.verificationStatus, 'pending');
    AsyncStorage.setItem(STORAGE_KEYS.verificationSubmittedAt, now);
    set({ verificationStatus: 'pending', verificationSubmittedAt: now });
  },

  checkVerificationStatus: async () => {
    const { userId } = get();
    if (!userId) return;
    const record = await getVerificationStatus(userId);
    if (!record) return;

    AsyncStorage.multiSet([
      [STORAGE_KEYS.verificationStatus, record.status],
      [STORAGE_KEYS.verificationSubmittedAt, record.submittedAt],
      [STORAGE_KEYS.rejectionReason, record.rejectionReason ?? ''],
    ]);

    set({
      verificationStatus: record.status,
      verificationSubmittedAt: record.submittedAt,
      rejectionReason: record.rejectionReason,
    });
  },

  loadPersistedState: async () => {
    try {
      const [
        onboarding,
        role,
        subscribed,
        plan,
        guest,
        authenticated,
        userId,
        userName,
        userEmail,
        userAvatar,
        verificationStatus,
        verificationSubmittedAt,
        rejectionReason,
      ] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.onboarding),
          AsyncStorage.getItem(STORAGE_KEYS.role),
          AsyncStorage.getItem(STORAGE_KEYS.subscribed),
          AsyncStorage.getItem(STORAGE_KEYS.plan),
          AsyncStorage.getItem(STORAGE_KEYS.guest),
          AsyncStorage.getItem(STORAGE_KEYS.authenticated),
          AsyncStorage.getItem(STORAGE_KEYS.userId),
          AsyncStorage.getItem(STORAGE_KEYS.userName),
          AsyncStorage.getItem(STORAGE_KEYS.userEmail),
          AsyncStorage.getItem(STORAGE_KEYS.userAvatar),
          AsyncStorage.getItem(STORAGE_KEYS.verificationStatus),
          AsyncStorage.getItem(STORAGE_KEYS.verificationSubmittedAt),
          AsyncStorage.getItem(STORAGE_KEYS.rejectionReason),
        ]);
      set({
        hasCompletedOnboarding: onboarding === 'true',
        isAuthenticated: authenticated === 'true',
        userRole: (role as UserRole) ?? null,
        userId: userId ?? null,
        userName: userName ?? null,
        userEmail: userEmail || null,
        userAvatar: userAvatar || null,
        isSubscribed: subscribed === 'true',
        plan: (plan as 'free' | 'premium') ?? null,
        isGuest: guest === 'true',
        verificationStatus: (verificationStatus as VerificationStatus) ?? 'unverified',
        verificationSubmittedAt: verificationSubmittedAt ?? null,
        rejectionReason: rejectionReason ?? null,
      });
    } catch {
      // storage read failed, use defaults
    }
  },
}));
