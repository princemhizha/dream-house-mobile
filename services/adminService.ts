import { sendVerificationApproved, sendVerificationRejected } from './notificationService';
import { getAllVerificationRecords, getVerificationStatus, upsertVerificationRecord } from './verificationService';
import { VerificationRecord, VerificationStatus } from '../types';

export async function getPendingVerifications(): Promise<VerificationRecord[]> {
  const records = await getAllVerificationRecords();
  return records.filter((r) => r.status === 'pending');
}

export async function getAllVerifications(
  filter?: VerificationStatus
): Promise<VerificationRecord[]> {
  const records = await getAllVerificationRecords();
  if (!filter) return records;
  return records.filter((r) => r.status === filter);
}

export async function getVerificationRecord(
  landlordId: string
): Promise<VerificationRecord | null> {
  return getVerificationStatus(landlordId);
}

export async function approveVerification(
  landlordId: string,
  adminId: string
): Promise<void> {
  const current = await getVerificationStatus(landlordId);
  if (!current) return;

  await upsertVerificationRecord({
    ...current,
    status: 'verified',
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminId,
    rejectionReason: null,
  });

  await sendVerificationApproved(landlordId);
}

export async function rejectVerification(
  landlordId: string,
  adminId: string,
  reason: string
): Promise<void> {
  const current = await getVerificationStatus(landlordId);
  if (!current) return;

  await upsertVerificationRecord({
    ...current,
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminId,
    rejectionReason: reason,
  });

  await sendVerificationRejected(landlordId, reason);
}

export interface AdminStats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  totalVerified: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const records = await getAllVerificationRecords();
  const today = new Date().toDateString();

  return {
    pendingCount: records.filter((r) => r.status === 'pending').length,
    approvedToday: records.filter((r) => r.status === 'verified' && r.reviewedAt && new Date(r.reviewedAt).toDateString() === today).length,
    rejectedToday: records.filter((r) => r.status === 'rejected' && r.reviewedAt && new Date(r.reviewedAt).toDateString() === today).length,
    totalVerified: records.filter((r) => r.status === 'verified').length,
  };
}
