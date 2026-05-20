import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dh_notifications';

export type AppNotificationType = 'property' | 'system' | 'promo';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const SEEDED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'seed-1',
    type: 'property',
    title: 'New Match in Borrowdale',
    message: 'A 3-bed home matching your search just listed at $1,200/mo.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'seed-2',
    type: 'promo',
    title: 'Upgrade to Premium',
    message: 'Get unlimited contact access. First month at 50% off.',
    time: 'Yesterday',
    read: true,
  },
];

async function readNotifications(): Promise<AppNotification[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEEDED_NOTIFICATIONS));
    return SEEDED_NOTIFICATIONS;
  }

  try {
    return JSON.parse(raw) as AppNotification[];
  } catch {
    return SEEDED_NOTIFICATIONS;
  }
}

async function writeNotifications(notifications: AppNotification[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export async function getNotifications(): Promise<AppNotification[]> {
  return readNotifications();
}

export async function markNotificationRead(id: string): Promise<void> {
  const notifications = await readNotifications();
  await writeNotifications(notifications.map((item) => item.id === id ? { ...item, read: true } : item));
}

export async function markAllNotificationsRead(): Promise<void> {
  const notifications = await readNotifications();
  await writeNotifications(notifications.map((item) => ({ ...item, read: true })));
}

async function prependNotification(notification: Omit<AppNotification, 'id' | 'time' | 'read'>): Promise<void> {
  const notifications = await readNotifications();
  const next: AppNotification = {
    id: `n_${Date.now()}`,
    time: 'Just now',
    read: false,
    ...notification,
  };
  await writeNotifications([next, ...notifications]);
}

export async function requestPushPermissions(): Promise<string | null> {
  return 'local-demo-token';
}

export async function sendVerificationApproved(landlordPushToken: string): Promise<void> {
  void landlordPushToken;
  await prependNotification({
    type: 'system',
    title: 'Identity Verified',
    message: 'Your ID has been approved. You can now publish property listings.',
  });
}

export async function sendVerificationRejected(
  landlordPushToken: string,
  reason: string
): Promise<void> {
  void landlordPushToken;
  await prependNotification({
    type: 'system',
    title: 'Verification Needs Attention',
    message: `Your ID submission was rejected: ${reason}`,
  });
}
