import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, LetterSpacing } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/spacing';
import { Ionicons } from '@expo/vector-icons';

type BadgeVariant = 'featured' | 'premium' | 'verified' | 'new';

interface GoldBadgeProps {
  variant?: BadgeVariant;
  label?: string;
  style?: ViewStyle;
}

const variantConfig: Record<BadgeVariant, { label: string; icon?: keyof typeof Ionicons.glyphMap }> = {
  featured: { label: 'FEATURED', icon: 'star' },
  premium: { label: 'PREMIUM', icon: 'diamond' },
  verified: { label: 'VERIFIED', icon: 'checkmark-circle' },
  new: { label: 'NEW', icon: undefined },
};

export function GoldBadge({ variant = 'featured', label, style }: GoldBadgeProps) {
  const config = variantConfig[variant];
  const displayLabel = label ?? config.label;

  return (
    <LinearGradient
      colors={Gradients.gold}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.badge, style]}
    >
      {config.icon && (
        <Ionicons name={config.icon} size={9} color={Colors.obsidian} />
      )}
      <Text style={styles.text}>{displayLabel}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
    gap: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    color: Colors.obsidian,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },
});
