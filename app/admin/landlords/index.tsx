import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  adminBase,
  adminSurface,
  adminSurfaceAlt,
  adminBorderSubtle,
  adminBorderDefault,
  adminTextPrimary,
  adminTextMuted,
  adminTextSecondary,
  adminSuccess,
  adminWarning,
  adminDanger,
  adminBlue300,
  adminBlue500,
  adminNeutral,
} from '@/constants/adminColors';
import { useFilteredLandlords, useAdminStore } from '@/store/useAdminStore';
import { MockLandlord } from '@/data/mockAdminData';
import AdminInput from '@/components/admin/AdminInput';
import AdminAvatar from '@/components/admin/AdminAvatar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import DotGridBackground from '@/components/admin/DotGridBackground';

type StatusFilter = 'all' | 'pending' | 'verified' | 'rejected' | 'unverified';
type AccountFilter = 'all' | 'individual' | 'agency';

const STATUS_OPTIONS: { key: StatusFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All', color: adminBlue300 },
  { key: 'pending', label: 'Pending', color: adminWarning },
  { key: 'verified', label: 'Verified', color: adminSuccess },
  { key: 'rejected', label: 'Rejected', color: adminDanger },
  { key: 'unverified', label: 'Unverified', color: adminNeutral },
];

function LandlordRow({
  landlord,
  onPress,
}: {
  landlord: MockLandlord;
  onPress: () => void;
}) {
  const accentColor =
    landlord.verificationStatus === 'verified'
      ? adminSuccess
      : landlord.verificationStatus === 'rejected'
      ? adminDanger
      : landlord.verificationStatus === 'pending'
      ? adminWarning
      : adminNeutral;

  return (
    <TouchableOpacity
      style={styles.rowCard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.rowContent}>
        <AdminAvatar name={landlord.name} size={42} />
        <View style={styles.rowInfo}>
          <View style={styles.rowTopLine}>
            <Text style={styles.rowName} numberOfLines={1}>{landlord.name}</Text>
            {landlord.accountType === 'premium' && (
              <View style={styles.premiumChip}>
                <Ionicons name="star" size={9} color="#F5A623" />
                <Text style={styles.premiumText}> PRO</Text>
              </View>
            )}
          </View>
          <Text style={styles.rowEmail} numberOfLines={1}>{landlord.email}</Text>
          <View style={styles.rowMeta}>
            <View style={styles.metaPill}>
              <Ionicons name="home-outline" size={10} color={adminTextMuted} />
              <Text style={styles.metaPillText}> {landlord.propertiesListed} listings</Text>
            </View>
          </View>
        </View>
        <View style={styles.rowRight}>
          <StatusBadge status={landlord.verificationStatus} size="sm" />
          <Ionicons name="chevron-forward" size={14} color={adminTextMuted} style={{ marginTop: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function LandlordsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const searchQuery = useAdminStore((s) => s.searchQuery);
  const setSearchQuery = useAdminStore((s) => s.setSearchQuery);
  const landlords = useFilteredLandlords();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [accountFilter, setAccountFilter] = useState<AccountFilter>('all');

  const displayed = useMemo(() => {
    let list = landlords;
    if (statusFilter !== 'all') {
      list = list.filter((l) => l.verificationStatus === statusFilter);
    }
    if (accountFilter !== 'all') {
      list = list.filter((l) => l.accountType === accountFilter);
    }
    return list;
  }, [landlords, statusFilter, accountFilter]);

  const handleLandlordPress = (landlord: MockLandlord) => {
    router.push(`/admin/verifications/${landlord.id}` as any);
  };

  const renderItem = ({ item }: { item: MockLandlord }) => (
    <LandlordRow landlord={item} onPress={() => handleLandlordPress(item)} />
  );

  const ListHeader = () => (
    <>
      <View style={styles.searchWrap}>
        <AdminInput
          placeholder="Search by name or email..."
          icon="search-outline"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Status filter chips */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>STATUS</Text>
        <View style={styles.chipsRow}>
          {STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.chip,
                  active && { backgroundColor: opt.color + '22', borderColor: opt.color },
                ]}
                onPress={() => setStatusFilter(opt.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, { color: active ? opt.color : adminTextMuted }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Account type filter */}
      <View style={[styles.filterSection, { marginBottom: 12 }]}>
        <Text style={styles.filterLabel}>ACCOUNT</Text>
        <View style={styles.chipsRow}>
          {(['all', 'individual', 'agency'] as AccountFilter[]).map((type) => {
            const active = accountFilter === type;
            const labels = { all: 'All', individual: 'Individual', agency: 'Agency' };
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  active && { backgroundColor: adminBlue300 + '22', borderColor: adminBlue300 },
                ]}
                onPress={() => setAccountFilter(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, { color: active ? adminBlue300 : adminTextMuted }]}>
                  {labels[type]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{displayed.length} landlord{displayed.length !== 1 ? 's' : ''}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <DotGridBackground />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Landlords</Text>
        <Ionicons name="people-outline" size={20} color={adminTextMuted} />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <AdminEmptyState
            icon="people-outline"
            iconColor={adminTextMuted}
            title="No landlords found"
            subtitle="Try adjusting your filters or search query"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminBase },
  header: {
    backgroundColor: adminSurface,
    borderBottomWidth: 1,
    borderBottomColor: adminBorderSubtle,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 24,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  searchWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  filterSection: { paddingHorizontal: 20, marginBottom: 10 },
  filterLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 9,
    color: adminTextMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    includeFontPadding: false,
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: adminBorderDefault,
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    includeFontPadding: false,
  },
  resultsRow: { paddingHorizontal: 20, marginBottom: 8 },
  resultsText: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    includeFontPadding: false,
  },
  listContent: { paddingBottom: 40 },
  rowCard: {
    flexDirection: 'row',
    backgroundColor: adminSurface,
    borderBottomWidth: 1,
    borderBottomColor: adminBorderSubtle,
    overflow: 'hidden',
  },
  accentBar: { width: 3 },
  rowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowInfo: { flex: 1 },
  rowTopLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: adminTextPrimary,
    flex: 1,
    includeFontPadding: false,
  },
  premiumChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5A62318',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F5A62333',
  },
  premiumText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 9,
    color: '#F5A623',
    includeFontPadding: false,
  },
  rowEmail: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
  rowMeta: { flexDirection: 'row', marginTop: 5, gap: 8 },
  metaPill: { flexDirection: 'row', alignItems: 'center' },
  metaPillText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: adminTextMuted,
    includeFontPadding: false,
  },
  rowRight: { alignItems: 'flex-end' },
});
