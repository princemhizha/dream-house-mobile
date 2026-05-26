import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { adminBase } from '@/constants/adminColors';
import { useAdminStore } from '@/store/useAdminStore';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminBottomBar from '@/components/admin/AdminBottomBar';
import AdminToast from '@/components/admin/AdminToast';

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isAdminLoggedIn = useAdminStore((s) => s.isAdminLoggedIn);
  const initSession = useAdminStore((s) => s.initSession);

  const [fontsLoaded] = useFonts({
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_900Black,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    initSession();
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return (
    <View style={[styles.full, isTablet && isAdminLoggedIn ? styles.row : undefined]}>
      <StatusBar style="light" />
      {isTablet && isAdminLoggedIn && <AdminSidebar />}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Protected guard={isAdminLoggedIn}>
            <Stack.Screen name="index" />
            <Stack.Screen name="analytics/index" />
            <Stack.Screen name="landlords/index" />
            <Stack.Screen name="settings/index" />
            <Stack.Screen name="verifications/index" />
            <Stack.Screen name="verifications/[landlordId]" />
          </Stack.Protected>
          <Stack.Protected guard={!isAdminLoggedIn}>
            <Stack.Screen name="sign-in" />
          </Stack.Protected>
        </Stack>
      </View>
      {!isTablet && isAdminLoggedIn && <AdminBottomBar />}
      <AdminToast />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: adminBase,
  },
  full: {
    flex: 1,
    backgroundColor: adminBase,
  },
  row: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    backgroundColor: adminBase,
  },
});
