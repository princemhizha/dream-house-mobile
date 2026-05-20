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
import { ListingRow } from '../../components/landlord/ListingRow';
import { StatCard } from '../../components/landlord/StatCard';
import { VerificationBanner } from '../../components/verification/VerificationBanner';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';

export default function LandlordDashboardScreen() {
  const router = useRouter();
  const { userId, userEmail } = useAuthStore((s) => ({ userId: s.userId, userEmail: s.userEmail }));
  const allProperties = usePropertyStore((s) => s.allProperties);
  const landlordListings = allProperties.filter((property) => property.landlord.id === userId || (userEmail ? property.landlord.email === userEmail : false));

  const totalViews = landlordListings.reduce((sum, p) => sum + p.views, 0);
  const totalSaves = landlordListings.reduce((sum, p) => sum + p.saves, 0);
  const totalUnlocks = Math.floor(totalSaves * 0.4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <VerificationBanner />
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{Strings.landlord.dashboard}</Text>
            <Text style={styles.subtitle}>{landlordListings.length} active listings</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/landlord/new-listing')}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color={Colors.textInverse} />
            <Text style={styles.addBtnText}>{Strings.landlord.addNew}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            label={Strings.landlord.stats.views}
            value={totalViews}
            icon={<Ionicons name="eye-outline" size={18} color={Colors.primaryColor} />}
            color={Colors.primaryColor}
          />
          <StatCard
            label={Strings.landlord.stats.saves}
            value={totalSaves}
            icon={<Ionicons name="heart-outline" size={18} color={Colors.error} />}
            color={Colors.error}
          />
          <StatCard
            label={Strings.landlord.stats.unlocks}
            value={totalUnlocks}
            icon={<Ionicons name="lock-open-outline" size={18} color={Colors.gold} />}
            color={Colors.gold}
          />
        </View>

        {/* Listings */}
        <View style={styles.listingsSection}>
          <Text style={styles.sectionTitle}>Your Listings</Text>
          {landlordListings.length === 0 ? (
            <Text style={styles.emptyText}>You have no published listings yet.</Text>
          ) : landlordListings.map((property) => (
            <ListingRow
              key={property.id}
              property={property}
              onBoost={() => router.push('/subscription')}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.newListingCta}
          onPress={() => router.push('/landlord/new-listing')}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color={Colors.primaryColor} />
          <Text style={styles.newListingCtaText}>Add a New Listing</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    paddingTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  addBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textInverse,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  listingsSection: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.base,
  },
  newListingCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primaryColor,
    borderRadius: 16,
    borderStyle: 'dashed',
    paddingVertical: Spacing.lg,
  },
  newListingCtaText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.primaryColor,
  },
});
