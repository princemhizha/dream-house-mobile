import React, { memo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  adminGlowGreen,
  adminGlowRed,
  adminSuccess,
  adminDanger,
  adminWarning,
  adminBlue300,
  adminBorderGlow,
  adminTextPrimary,
} from '@/constants/adminColors';
import { adminSprings } from '@/constants/adminAnimations';
import { useAdminStore } from '@/store/useAdminStore';

const TOAST_CONFIG = {
  success: { bg: adminGlowGreen,           border: adminSuccess, icon: 'checkmark-circle-outline', color: adminSuccess },
  error:   { bg: 'rgba(255,68,68,0.15)',   border: adminDanger,  icon: 'close-circle-outline',     color: adminDanger  },
  warning: { bg: 'rgba(245,166,35,0.12)',  border: adminWarning, icon: 'warning-outline',           color: adminWarning },
  info:    { bg: 'rgba(21,71,184,0.20)',   border: adminBorderGlow, icon: 'information-circle-outline', color: adminBlue300 },
} as const;

const AdminToast = () => {
  const insets = useSafeAreaInsets();
  const activeToast = useAdminStore((s) => s.activeToast);
  const clearToast = useAdminStore((s) => s.clearToast);
  const translateY = useSharedValue(-120);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeToast) {
      translateY.value = withSpring(0, adminSprings.smooth);

      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      dismissTimer.current = setTimeout(() => {
        translateY.value = withTiming(-120, { duration: 300 });
        setTimeout(clearToast, 320);
      }, 2800);
    }

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [activeToast]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!activeToast) return null;

  const config = TOAST_CONFIG[activeToast.variant];

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 10 },
        animStyle,
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.card,
          { backgroundColor: config.bg, borderColor: config.border },
        ]}
      >
        <Ionicons name={config.icon as any} size={16} color={config.color} />
        <Text style={styles.message}>{activeToast.message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: adminTextPrimary,
    marginLeft: 10,
    flex: 1,
    includeFontPadding: false,
  },
});

export default memo(AdminToast);
