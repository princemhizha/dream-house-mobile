import React from 'react';
import {
  Linking,
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
import { Radius, Spacing } from '../../constants/spacing';
import { GlassCard } from '../../components/ui/GlassCard';

const APP_VERSION = '1.0.0';
const BUILD = '100';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', url: 'https://dreamhouse.co.zw/privacy' },
  { label: 'Terms of Service', url: 'https://dreamhouse.co.zw/terms' },
  { label: 'Cookie Policy', url: 'https://dreamhouse.co.zw/cookies' },
] as const;

export default function AboutScreen() {
  const router = useRouter();
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Dream House</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Text style={styles.logoBrandName}>Dream House</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>
              v{APP_VERSION} ({BUILD})
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Dream House is Zimbabwe's premier property platform, connecting renters, buyers, and
          landlords with elegance and ease. Browse, save, and unlock your dream home from anywhere.
        </Text>

        <GlassCard style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={16} color={Colors.emerald500} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Based In</Text>
              <Text style={styles.infoValue}>Harare, Zimbabwe</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="code-slash-outline" size={16} color={Colors.emerald500} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Built With</Text>
              <Text style={styles.infoValue}>Expo SDK 54 + React Native</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.emerald500} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Payments</Text>
              <Text style={styles.infoValue}>Paynow, EcoCash, Card</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Legal</Text>

        <View style={styles.legalList}>
          {LEGAL_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={styles.legalItem}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.8}
            >
              <Text style={styles.legalLabel}>{link.label}</Text>
              <Ionicons name="open-outline" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.copyright}>
          (c) 2024 Dream House Zimbabwe. All rights reserved.
        </Text>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  logoBrandName: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.tighter,
  },
  versionBadge: {
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
  },
  versionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wider,
  },
  description: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.7,
    letterSpacing: LetterSpacing.wide,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  infoCard: {
    marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.base,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: Radius.xs,
    backgroundColor: Colors.emeraldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
  },
  infoValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  legalList: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  legalLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wide,
  },
  copyright: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'center',
    letterSpacing: LetterSpacing.wide,
  },
  bottomPad: {
    height: 48,
  },
});
