import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { AvailabilityStatus } from '../../types';
import { Strings } from '../../constants/strings';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  style?: ViewStyle;
}

const statusConfig: Record<
  AvailabilityStatus,
  { color: string; bg: string; border: string; label: string }
> = {
  available: {
    color: Colors.available,
    bg: 'rgba(15,106,61,0.10)',
    border: 'rgba(15,106,61,0.35)',
    label: Strings.availability.available,
  },
  reserved: {
    color: Colors.reserved,
    bg: 'rgba(217,119,6,0.10)',
    border: 'rgba(217,119,6,0.40)',
    label: Strings.availability.reserved,
  },
  rented: {
    color: Colors.rented,
    bg: 'rgba(220,38,38,0.10)',
    border: 'rgba(220,38,38,0.40)',
    label: Strings.availability.rented,
  },
  sold: {
    color: Colors.sold,
    bg: 'rgba(107,114,128,0.10)',
    border: 'rgba(107,114,128,0.40)',
    label: Strings.availability.sold,
  },
};

export function AvailabilityBadge({ status, style }: AvailabilityBadgeProps) {
  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
        },
        style,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
  },
});
