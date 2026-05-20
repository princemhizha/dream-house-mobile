import AsyncStorage from '@react-native-async-storage/async-storage';
import { VerificationRecord } from '../types';

const STORAGE_KEY = 'dh_verification_records';

const SEEDED_RECORDS: VerificationRecord[] = [
  {
    landlordId: 'landlord_001',
    idImageUrl: 'https://placehold.co/600x380',
    status: 'pending',
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  {
    landlordId: 'landlord_002',
    idImageUrl: 'https://placehold.co/600x380',
    status: 'pending',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
];

async function readRecords(): Promise<VerificationRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(SEEDED_RECORDS));
    return SEEDED_RECORDS;
  }

  try {
    return JSON.parse(raw) as VerificationRecord[];
  } catch {
    return SEEDED_RECORDS;
  }
}

async function writeRecords(records: VerificationRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export async function getAllVerificationRecords(): Promise<VerificationRecord[]> {
  return readRecords();
}

export async function upsertVerificationRecord(record: VerificationRecord): Promise<void> {
  const records = await readRecords();
  const next = records.filter((item) => item.landlordId !== record.landlordId);
  next.unshift(record);
  await writeRecords(next);
}

export async function uploadIDImage(imageUri: string, landlordId: string): Promise<string> {
  void landlordId;
  return imageUri;
}

export async function submitVerification(
  landlordId: string,
  idImageUrl: string
): Promise<void> {
  const now = new Date().toISOString();
  await upsertVerificationRecord({
    landlordId,
    idImageUrl,
    status: 'pending',
    submittedAt: now,
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  });
}

export async function getVerificationStatus(
  landlordId: string
): Promise<VerificationRecord | null> {
  const records = await readRecords();
  return records.find((record) => record.landlordId === landlordId) ?? null;
}
