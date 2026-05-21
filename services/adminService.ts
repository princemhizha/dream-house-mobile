import { api } from './api';
import { VerificationRecord, VerificationStatus } from '../types';

export interface AdminStats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  totalVerified: number;
  totalProperties: number;
  totalUsers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get<{ success: boolean; data: AdminStats }>('/admin/stats/');
  return res.data;
}

interface PaginatedVerifications {
  results: VerificationRecord[];
  count: number;
  next: string | null;
}

export async function getAllVerifications(
  filter?: VerificationStatus
): Promise<VerificationRecord[]> {
  const params: Record<string, any> = { pageSize: 100 };
  if (filter) params.status = filter;
  const res = await api.get<PaginatedVerifications>('/admin/verifications/', params);
  return res.results || [];
}

export async function getPendingVerifications(): Promise<VerificationRecord[]> {
  return getAllVerifications('pending');
}

export async function getVerificationRecord(landlordId: string): Promise<VerificationRecord | null> {
  try {
    const res = await api.get<{ success: boolean; data: VerificationRecord }>(`/admin/verifications/${landlordId}/`);
    return res.data ?? res;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}

export async function approveVerification(landlordId: string): Promise<void> {
  await api.post(`/admin/verifications/${landlordId}/approve/`);
}

export async function rejectVerification(
  landlordId: string,
  reason: string
): Promise<void> {
  await api.post(`/admin/verifications/${landlordId}/reject/`, { reason });
}
