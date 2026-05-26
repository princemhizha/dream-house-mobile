import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSurface,
  adminBorderSubtle,
  adminBorderGlow,
  adminGlowBlue,
  adminBlue400,
  adminBlue300,
  adminTextPrimary,
  adminTextMuted,
  adminWarning,
} from '@/constants/adminColors';
import { useAdminStore } from '@/store/useAdminStore';
import { usePendingQueue } from '@/store/useAdminStore';
import { useScalePress, useBadgePulse } from '@/constants/adminAnimations';
import AdminAvatar from './AdminAvatar';
import LiveIndicator from './LiveIndicator';

const NAV_ITEMS = [
  { label: 'Overview',      icon: 'grid-outline',        route: '/admin' },
  { label: 'Verifications', icon: 'id-card-outline',     route: '/admin/verifications', hasBadge: true },
  { label: 'Landlords',     icon: 'people-outline',      route: '/admin/landlords' },
  { label: 'Analytics',     icon: 'bar-chart-outline',   route: '/admin/analytics' },
  { label: 'Settings',      icon: 'settings-outline',    route: '/admin/settings' },
] as const;

const NavItem = ({
  item,
  isActive,
  pendingCount,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
  pendingCount: number;
}) => {
  const router = useRouter();
  const { pressHandlers, animatedStyle } = useScalePress();
  const badgePulse = useBadgePulse();

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.navItem, isActive && styles.navItemActive]}
        onPress={() => router.push(item.route as any)}
        activeOpacity={1}
        {...pressHandlers}
      >
        {isActive && <View style={styles.activeAccent} />}
        <Ionicons
          name={item.icon as any}
          size={18}
          color={isActive ? adminBlue300 : adminTextMuted}
        />
        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
          {item.label}
        </Text>
        {item.hasBadge && pendingCount > 0 && (
          <Animated.View style={[styles.badge, badgePulse]}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const AdminSidebar = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const adminUser = useAdminStore((s) => s.adminUser);
  const adminLogout = useAdminStore((s) => s.adminLogout);
  const router = useRouter();
  const pendingQueue = usePendingQueue();
  const pendingCount = pendingQueue.length;

  const isActive = (route: string) => {
    if (route === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(route);
  };

  const handleLogout = async () => {
    await adminLogout();
    router.replace('/admin/sign-in');
  };

  return (
    <View style={[styles.sidebar, { paddingTop: insets.top + 16 }]}>
      {/* Brand */}
      <View style={styles.brand}>
        <View style={styles.row}>
          <View style={styles.dhBadge}>
            <Text style={styles.dhText}>DH</Text>
          </View>
          <View style={styles.brandText}>
            <Text style={styles.brandName}>DH Admin</Text>
            <Text style={styles.brandSub}>SYSTEM CONSOLE</Text>
          </View>
        </View>
        <View style={[styles.row, styles.liveRow]}>
          <LiveIndicator />
          <Text style={styles.liveText}>  System live</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* Nav items */}
      <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.route}
              item={item}
              isActive={isActive(item.route)}
              pendingCount={pendingCount}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom user section */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.divider} />
        <View style={[styles.row, styles.userRow]}>
          <AdminAvatar name={adminUser?.name ?? 'Admin'} size={40} />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {adminUser?.name ?? 'Admin'}
            </Text>
            <Text style={styles.userRole}>ADMINISTRATOR</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={18} color={adminTextMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: adminSurface,
    borderRightWidth: 1,
    borderRightColor: adminBorderSubtle,
    flexDirection: 'column',
  },
  brand: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dhBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0D1F5C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhText: {
    fontFamily: 'Fraunces_900Black',
    fontSize: 15,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  brandText: {
    marginLeft: 10,
  },
  brandName: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 15,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  brandSub: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 9,
    color: adminTextMuted,
    letterSpacing: 2.5,
    includeFontPadding: false,
  },
  liveRow: {
    marginTop: 12,
  },
  liveText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 11,
    color: '#00C472',
    includeFontPadding: false,
  },
  divider: {
    height: 1,
    backgroundColor: adminBorderSubtle,
    marginTop: 16,
  },
  navScroll: {
    flex: 1,
  },
  navList: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom: 4,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: adminGlowBlue,
    borderWidth: 1,
    borderColor: adminBorderGlow,
  },
  activeAccent: {
    position: 'absolute',
    left: 0,
    width: 3,
    height: '80%',
    backgroundColor: adminBlue400,
    borderRadius: 2,
    alignSelf: 'center',
  },
  navLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: adminTextMuted,
    marginLeft: 10,
    flex: 1,
    includeFontPadding: false,
  },
  navLabelActive: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: adminTextPrimary,
  },
  badge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: adminWarning,
    borderRadius: 100,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  bottom: {
    paddingHorizontal: 12,
  },
  userRow: {
    marginTop: 12,
    gap: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 13,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  userRole: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 10,
    color: adminTextMuted,
    letterSpacing: 2,
    includeFontPadding: false,
  },
});

export default memo(AdminSidebar);
