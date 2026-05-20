import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import type { VerificationStatus as VerificationStatusType } from '../../types';

interface Props {
  status: VerificationStatusType;
  size?: 'sm' | 'md';
}

const CONFIG: Record<VerificationStatusType, { label: string; bg: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  unverified: {
    label: 'Unverified',
    bg: Colors.mist,
    color: Colors.textMuted,
    icon: 'alert-circle-outline',
  },
  pending: {
    label: 'Pending Review',
    bg: 'rgba(217,119,6,0.10)',
    color: Colors.warning,
    icon: 'time-outline',
  },
  verified: {
    label: 'Verified',
    bg: 'rgba(15,158,82,0.10)',
    color: Colors.success,
    icon: 'checkmark-circle',
  },
  rejected: {
    label: 'Rejected',
    bg: 'rgba(220,38,38,0.10)',
    color: Colors.error,
    icon: 'close-circle',
  },
};

export function VerificationStatus({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status];
  const iconSize = size === 'sm' ? 12 : 14;
  const fontSize = size === 'sm' ? FontSize['2xs'] : FontSize.xs;

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }, size === 'sm' && styles.badgeSm]}>
      <Ionicons name={cfg.icon} size={iconSize} color={cfg.color} />
      <Text style={[styles.label, { color: cfg.color, fontSize }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2xs'],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 3,
  },
  label: {
    fontFamily: FontFamily.bodySemiBold,
    letterSpacing: LetterSpacing.wide,
  },
});
