import { api } from './api';

export type AppNotificationType = 'property' | 'system' | 'promo';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  // Computed for display
  time: string;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface ApiNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  results: ApiNotification[];
  count: number;
  next: string | null;
}

function mapNotification(n: ApiNotification): AppNotification {
  return {
    id: String(n.id),
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt,
    time: formatRelativeTime(n.createdAt),
  };
}

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const res = await api.get<PaginatedResponse>('/notifications/', { pageSize: 50 });
    return (res.results || []).map(mapNotification);
  } catch {
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read/`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post('/notifications/read-all/');
}

export async function registerDeviceToken(token: string, platform: 'expo' | 'fcm'): Promise<void> {
  await api.post('/notifications/device-token/', { token, platform });
}
