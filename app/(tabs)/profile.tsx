import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { useSavedStore } from '../../store/useSavedStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { GlassCard } from '../../components/ui/GlassCard';
import { GoldBadge } from '../../components/ui/GoldBadge';

export default function ProfileScreen() {
  const router = useRouter();
  const { isSubscribed, userName, userRole, isGuest, userId, userEmail } = useAuthStore();
  const { savedIds } = useSavedStore();
  const allProperties = usePropertyStore((s) => s.allProperties);

  const isLandlord = userRole === 'landlord';
  const landlordListings = allProperties.filter((property) => property.landlord.id === userId || (userEmail ? property.landlord.email === userEmail : false));
  const landlordViews = landlordListings.reduce((sum, p) => sum + p.views, 0);
  const landlordSaves = landlordListings.reduce((sum, p) => sum + p.saves, 0);

  const menuItems = [
    { icon: 'home-outline', label: 'My Listings', onPress: () => router.push('/landlord/dashboard'), show: isLandlord },
    { icon: 'add-circle-outline', label: 'New Listing', onPress: () => router.push('/landlord/new-listing'), show: isLandlord },
    { icon: 'heart-outline', label: 'Saved Properties', onPress: () => router.push('/(tabs)/saved'), show: !isLandlord },
    { icon: 'diamond-outline', label: 'Subscription', onPress: () => router.push('/subscription'), show: true },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/notifications'), show: true },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => router.push('/help'), show: true },
    { icon: 'information-circle-outline', label: 'About Dream House', onPress: () => router.push('/about'), show: true },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {isGuest && (
          <View style={styles.guestBanner}>
            <Ionicons name="person-outline" size={20} color={Colors.navy500} />
            <View style={{ flex: 1 }}>
              <Text style={styles.guestBannerText}>You are browsing as a guest</Text>
            </View>
            <View style={styles.guestBannerActions}>
              <TouchableOpacity
                style={styles.guestBannerBtn}
                onPress={() => router.push('/(onboarding)/sign-up')}
                activeOpacity={0.85}
              >
                <Text style={styles.guestBannerBtnText}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.guestBannerBtn, styles.guestBannerBtnOutline]}
                onPress={() => router.push('/(onboarding)/sign-in')}
                activeOpacity={0.85}
              >
                <Text style={[styles.guestBannerBtnText, styles.guestBannerBtnOutlineText]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={Colors.textMuted} />
          </View>
          <Text style={styles.name}>{userName ?? 'Guest User'}</Text>
          <Text style={styles.role}>{userRole ? `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}` : 'Renter'}</Text>
          {isSubscribed && (
            <GoldBadge variant="premium" style={styles.premiumBadge} />
          )}
        </View>

        {/* Stats */}
        <GlassCard style={styles.statsCard}>
          {isLandlord ? (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{landlordListings.length}</Text>
                <Text style={styles.statLabel}>Listings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{landlordViews.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{landlordSaves}</Text>
                <Text style={styles.statLabel}>Saves</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{savedIds.length}</Text>
                <Text style={styles.statLabel}>Saved</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{isSubscribed ? 'All' : '0'}</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{isSubscribed ? 'Pro' : 'Free'}</Text>
                <Text style={styles.statLabel}>Plan</Text>
              </View>
            </>
          )}
        </GlassCard>

        {/* Subscription CTA */}
        {!isSubscribed && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/subscription')}
            activeOpacity={0.9}
          >
            <View style={styles.upgradeBannerContent}>
              <Ionicons name="diamond-outline" size={20} color={Colors.gold} />
              <View style={{ flex: 1 }}>
                <Text style={styles.upgradeBannerTitle}>Unlock Premium</Text>
                <Text style={styles.upgradeBannerSubtitle}>Access all contacts & features</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={18} color={Colors.gold} />
          </TouchableOpacity>
        )}

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.filter((m) => m.show).map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as never} size={20} color={Colors.textMuted} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.base,
  },
  header: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  role: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  premiumBadge: {
    marginTop: Spacing.xs,
  },
  statsCard: {
    flexDirection: 'row',
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldMuted,
    borderWidth: 1,
    borderColor: Colors.goldShimmer,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  upgradeBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  upgradeBannerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.gold,
  },
  upgradeBannerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  menu: {
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.base,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  guestBanner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.navy50,
    borderWidth: 1,
    borderColor: Colors.borderNavy,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  guestBannerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.navy700,
  },
  guestBannerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    width: '100%',
  },
  guestBannerBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    backgroundColor: Colors.navy700,
    borderRadius: Radius.md,
  },
  guestBannerBtnOutline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.navy700,
  },
  guestBannerBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  guestBannerBtnOutlineText: {
    color: Colors.navy700,
  },
});
