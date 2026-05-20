import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { GlassCard } from '../ui/GlassCard';

interface Item {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const ITEMS: Item[] = [
  { icon: 'card-outline', text: 'Your national ID card or passport' },
  { icon: 'sunny-outline', text: 'Good lighting for a clear photo' },
  { icon: 'phone-portrait-outline', text: 'Less than 2 minutes of your time' },
];

export function IDCaptureCard() {
  return (
    <GlassCard style={styles.card}>
      <Text style={styles.sectionLabel}>WHAT YOU NEED</Text>
      {ITEMS.map((item) => (
        <View key={item.icon} style={styles.row}>
          <View style={styles.iconWrap}>
            <Ionicons name={item.icon} size={18} color={Colors.navy500} />
          </View>
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.label,
    marginBottom: Spacing['2xs'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.navy50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textBody,
  },
});
