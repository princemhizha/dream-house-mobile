import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSurface,
  adminBorderSubtle,
  adminBlue300,
  adminTextMuted,
  adminWarning,
} from '@/constants/adminColors';
import { usePendingQueue } from '@/store/useAdminStore';
import { useBadgePulse } from '@/constants/adminAnimations';

const NAV_ITEMS = [
  { label: 'Overview',      icon: 'grid-outline',      route: '/admin' },
  { label: 'Queue',         icon: 'id-card-outline',   route: '/admin/verifications', hasBadge: true },
  { label: 'Landlords',     icon: 'people-outline',    route: '/admin/landlords' },
  { label: 'Analytics',     icon: 'bar-chart-outline', route: '/admin/analytics' },
  { label: 'Settings',      icon: 'settings-outline',  route: '/admin/settings' },
] as const;

const AdminBottomBar = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const pendingCount = usePendingQueue().length;
  const badgePulse = useBadgePulse();

  const isActive = (route: string) => {
    if (route === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(route);
  };

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.route);
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.tab}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={item.icon as any}
                size={22}
                color={active ? adminBlue300 : adminTextMuted}
              />
              {item.hasBadge && pendingCount > 0 && (
                <Animated.View style={[styles.badge, badgePulse]}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </Animated.View>
              )}
            </View>
            {active && <View style={styles.activeDot} />}
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: adminSurface,
    borderTopWidth: 1,
    borderTopColor: adminBorderSubtle,
    paddingTop: 8,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 4,
  },
  iconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: adminWarning,
    borderRadius: 100,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 8,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: adminBlue300,
    marginTop: 2,
  },
  tabLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: adminBlue300,
  },
});

export default memo(AdminBottomBar);
