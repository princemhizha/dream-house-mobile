import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Colors } from '../../constants/colors';

export default function AdminLayout() {
  const router = useRouter();
  const userRole = useAuthStore((s) => s.userRole);

  useEffect(() => {
    if (userRole !== 'admin') {
      router.replace('/');
    }
  }, [userRole, router]);

  if (userRole !== 'admin') return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
