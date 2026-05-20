import React, { useEffect, useState } from 'react';
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
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Shadow, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { getAdminStats, AdminStats } from '../../services/adminService';
import { GlassCard } from '../../components/ui/GlassCard';

export default function AdminIndexScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => null);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {stats && (
          <View style={styles.statsRow}>
            <StatCard label="Pending Reviews" value={stats.pendingCount} color={Colors.warning} icon="time-outline" />
            <StatCard label="Approved Today" value={stats.approvedToday} color={Colors.success} icon="checkmark-circle-outline" />
            <StatCard label="Rejected Today" value={stats.rejectedToday} color={Colors.error} icon="close-circle-outline" />
            <StatCard label="Total Verified" value={stats.totalVerified} color={Colors.navy500} icon="shield-checkmark-outline" />
          </View>
        )}

        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

        <GlassCard style={styles.actionCard}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => router.push('/admin/verifications')}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: Colors.navy50 }]}>
              <Ionicons name="id-card-outline" size={22} color={Colors.navy500} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Review Pending IDs</Text>
              {stats && stats.pendingCount > 0 && (
                <Text style={styles.actionSub}>{stats.pendingCount} awaiting review</Text>
              )}
            </View>
            <View style={[styles.badge, { backgroundColor: Colors.navy500 }]}>
              <Text style={styles.badgeText}>{stats?.pendingCount ?? 0}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => router.push('/admin/verifications')}>
            <View style={[styles.actionIconWrap, { backgroundColor: 'rgba(15,158,82,0.10)' }]}>
              <Ionicons name="people-outline" size={22} color={Colors.success} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>All Landlords</Text>
              <Text style={styles.actionSub}>Full landlord list with status filters</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.actionRow, styles.actionRowDisabled]} activeOpacity={0.6} onPress={() => router.push('/admin/verifications')}>
            <View style={[styles.actionIconWrap, { backgroundColor: Colors.mist }]}>
              <Ionicons name="flag-outline" size={22} color={Colors.textDisabled} />
            </View>
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: Colors.textDisabled }]}>Flagged Listings</Text>
              <Text style={styles.actionSub}>Coming soon</Text>
            </View>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={[statStyles.card, ...Shadow.sm ? [Shadow.sm] : []]}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={[statStyles.value, { color }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
    ...Shadow.xs,
  },
  value: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    letterSpacing: LetterSpacing.wide,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 26,
    color: Colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoutText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.error,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.label,
  },
  actionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
  },
  actionRowDisabled: {
    opacity: 0.5,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  actionSub: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.base,
  },
});
