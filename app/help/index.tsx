import React, { useState, useCallback } from 'react';
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

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How do I unlock contact details?',
    a: 'Upgrade to Dream House Premium to access all landlord and agent contact details. Go to Profile > Subscription to get started.',
  },
  {
    q: 'How do I save a property?',
    a: 'Tap the heart icon on any property card or detail page. Saved properties appear in your Saved tab.',
  },
  {
    q: 'What is the difference between Rent, Buy, and Short Stay?',
    a: 'Rent shows long-term rentals billed monthly. Buy shows properties for sale. Short Stay shows properties available by the night or week.',
  },
  {
    q: 'How do I filter search results?',
    a: 'Tap the filter icon in the Search tab to filter by price range, bedrooms, bathrooms, property type, and listing type.',
  },
  {
    q: 'Is my information secure?',
    a: 'Yes. Dream House does not store sensitive payment information. All transactions are handled by Paynow, EcoCash, or your card provider.',
  },
  {
    q: 'How do I list my property?',
    a: 'Switch your account role to Landlord from the Profile settings. You can then access the Landlord Dashboard to add and manage listings.',
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setExpanded((prev) => (prev === index ? null : index));
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqList}>
          {FAQS.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqItem, expanded === index && styles.faqItemExpanded]}
              onPress={() => toggle(index)}
              activeOpacity={0.85}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion} numberOfLines={expanded === index ? undefined : 2}>
                  {faq.q}
                </Text>
                <Ionicons
                  name={expanded === index ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={Colors.textMuted}
                />
              </View>
              {expanded === index && (
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact Us</Text>

        <GlassCard style={styles.contactCard}>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('https://wa.me/263771234567')}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, styles.contactIconWhatsapp]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>WhatsApp Support</Text>
              <Text style={styles.contactSubLabel}>+263 77 123 4567</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.contactDivider} />

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL('mailto:support@dreamhouse.co.zw')}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, styles.contactIconEmail]}>
              <Ionicons name="mail-outline" size={20} color={Colors.emerald500} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactSubLabel}>support@dreamhouse.co.zw</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </GlassCard>

        <Text style={styles.responseNote}>
          We typically respond within 24 hours on business days.
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
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  faqList: {
    gap: 2,
    marginBottom: Spacing.xl,
  },
  faqItem: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    padding: Spacing.base,
    overflow: 'hidden',
  },
  faqItemExpanded: {
    borderColor: Colors.borderEmerald,
    backgroundColor: Colors.surfaceRaised,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
  faqAnswer: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * 1.65,
    letterSpacing: LetterSpacing.wide,
    marginTop: Spacing.sm,
  },
  contactCard: {
    marginBottom: Spacing.base,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.base,
  },
  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIconWhatsapp: {
    backgroundColor: 'rgba(37,211,102,0.12)',
  },
  contactIconEmail: {
    backgroundColor: Colors.emeraldMuted,
  },
  contactText: {
    flex: 1,
    gap: 2,
  },
  contactLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  contactSubLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  contactDivider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginHorizontal: Spacing.base,
  },
  responseNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'center',
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.xs * 1.6,
  },
  bottomPad: {
    height: 48,
  },
});
