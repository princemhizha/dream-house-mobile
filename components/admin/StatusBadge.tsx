import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  adminSuccess,
  adminWarning,
  adminDanger,
  adminNeutral,
} from '@/constants/adminColors';

type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { bg: string; border: string; color: string; label: string }
> = {
  pending: {
    bg: 'rgba(245,166,35,0.12)',
    border: 'rgba(245,166,35,0.35)',
    color: adminWarning,
    label: 'PENDING',
  },
  verified: {
    bg: 'rgba(0,196,114,0.10)',
    border: 'rgba(0,196,114,0.30)',
    color: adminSuccess,
    label: 'VERIFIED',
  },
  rejected: {
    bg: 'rgba(255,68,68,0.10)',
    border: 'rgba(255,68,68,0.30)',
    color: adminDanger,
    label: 'REJECTED',
  },
  unverified: {
    bg: 'rgba(74,85,104,0.15)',
    border: 'rgba(74,85,104,0.30)',
    color: adminNeutral,
    label: 'UNVERIFIED',
  },
};

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.unverified;
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          paddingHorizontal: isSmall ? 7 : 10,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.label,
          { color: config.color, fontSize: isSmall ? 8 : 9 },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 1.5,
    includeFontPadding: false,
  },
});

export default memo(StatusBadge);
