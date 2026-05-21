import { api } from './api';
import { VerificationRecord } from '../types';

export async function uploadIDImage(imageUri: string): Promise<string> {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() || 'id_photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('id_image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const res = await api.postForm<{ success: boolean; imageUrl: string }>('/verifications/upload-id/', formData);
  return res.imageUrl;
}

export async function submitVerification(idImageUrl: string): Promise<void> {
  await api.post('/verifications/', { idImageUrl });
}

export async function getVerificationStatus(): Promise<VerificationRecord | null> {
  try {
    const res = await api.get<{ success: boolean; data: VerificationRecord }>('/verifications/me/');
    return res.data ?? res;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}
