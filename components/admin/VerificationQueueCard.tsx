import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSurfaceAlt,
  adminBorderSubtle,
  adminTextPrimary,
  adminTextMuted,
  adminWarning,
  adminSuccess,
  adminDanger,
  adminNeutral,
} from '@/constants/adminColors';
import { getRelativeTime } from '@/data/mockAdminData';
import { MockLandlord } from '@/data/mockAdminData';
import { useSlideEnter, useScalePress } from '@/constants/adminAnimations';
import AdminAvatar from './AdminAvatar';
import StatusBadge from './StatusBadge';

interface VerificationQueueCardProps {
  landlord: MockLandlord;
  compact?: boolean;
  index?: number;
}

const ACCENT_COLOR: Record<string, string> = {
  pending:    adminWarning,
  verified:   adminSuccess,
  rejected:   adminDanger,
  unverified: adminNeutral,
};

const VerificationQueueCard = ({
  landlord,
  compact = false,
  index = 0,
}: VerificationQueueCardProps) => {
  const router = useRouter();
  const slideStyle = useSlideEnter(index * 60);
  const { pressHandlers, animatedStyle } = useScalePress();
  const accentColor = ACCENT_COLOR[landlord.verificationStatus] ?? adminNeutral;

  return (
    <Animated.View style={[animatedStyle, slideStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => router.push(`/admin/verifications/${landlord.id}` as any)}
        style={[styles.card, compact && styles.cardCompact]}
        {...pressHandlers}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.row}>
          <AdminAvatar name={landlord.name} size={36} />

          <View style={styles.center}>
            <Text style={styles.name} numberOfLines={1}>
              {landlord.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {landlord.email}
            </Text>
            <View style={styles.metaRow}>
              <StatusBadge status={landlord.verificationStatus} size="sm" />
              <Text style={styles.dot}> · </Text>
              <Text style={styles.time}>
                {getRelativeTime(landlord.submittedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.right}>
            {!compact && (
              <StatusBadge status={landlord.verificationStatus} size="md" />
            )}
            <Ionicons
              name="chevron-forward"
              size={compact ? 16 : 14}
              color={adminTextMuted}
              style={!compact ? { marginTop: 4 } : undefined}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: adminSurfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: adminBorderSubtle,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  cardCompact: {
    padding: 12,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  center: {
    flex: 1,
    marginHorizontal: 12,
  },
  name: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 14,
    color: adminTextPrimary,
    includeFontPadding: false,
  },
  email: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  dot: {
    color: adminTextMuted,
    fontSize: 11,
    marginHorizontal: 2,
    includeFontPadding: false,
  },
  time: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 10,
    color: adminTextMuted,
    includeFontPadding: false,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
});

export default memo(VerificationQueueCard);
