import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Shadow, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { useAuthStore } from '../../store/useAuthStore';
import { GlassCard } from '../../components/ui/GlassCard';

const PREMIUM_PRICE = 9;

export default function SubscriptionScreen() {
  const router = useRouter();
  const { isSubscribed, setSubscribed } = useAuthStore();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.8}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{Strings.subscription.title}</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>{Strings.subscription.title}</Text>
        <Text style={styles.subheadline}>{Strings.subscription.subtitle}</Text>

        {/* Free Plan */}
        <GlassCard style={[styles.planCard, !isSubscribed ? styles.currentPlan : undefined]}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{Strings.subscription.free}</Text>
            <View style={styles.priceBlock}>
              <Text style={styles.planPrice}>$0</Text>
              <Text style={styles.planPriceLabel}>{Strings.subscription.perMonth}</Text>
            </View>
          </View>
          {!isSubscribed && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>{Strings.subscription.currentPlan}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.featureList}>
            {Strings.subscription.features.free.map((f) => (
              <FeatureRow key={f} label={f} included={true} muted />
            ))}
            <FeatureRow label="Unlock contact details" included={false} />
            <FeatureRow label="Premium listings" included={false} />
          </View>
        </GlassCard>

        {/* Most Popular label */}
        <View style={styles.mostPopularRow}>
          <View style={styles.mostPopularLine} />
          <Text style={styles.mostPopularText}>MOST POPULAR</Text>
          <View style={styles.mostPopularLine} />
        </View>

        {/* Premium Plan */}
        <View style={[styles.planCard, styles.premiumPlan]}>
          <LinearGradient
            colors={['rgba(201,168,76,0.12)', 'rgba(201,168,76,0.04)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <LinearGradient
            colors={Gradients.gold}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumTopBar}
          />
          <View style={styles.planCardInner}>
            <View style={styles.premiumTopRow}>
              <View style={styles.planHeader}>
                <Text style={[styles.planName, styles.premiumPlanName]}>
                  {Strings.subscription.premium}
                </Text>
                <View style={styles.priceBlock}>
                  <Text style={[styles.planPrice, styles.premiumPrice]}>${PREMIUM_PRICE}</Text>
                  <Text style={styles.planPriceLabel}>{Strings.subscription.perMonth}</Text>
                </View>
              </View>
              <View style={styles.popularBadge}>
                <Ionicons name="star" size={9} color={Colors.obsidian} />
                <Text style={styles.popularBadgeText}>BEST</Text>
              </View>
            </View>
            {isSubscribed && (
              <View style={[styles.currentBadge, styles.currentBadgePremium]}>
                <Text style={[styles.currentBadgeText, styles.currentBadgeTextGold]}>
                  {Strings.subscription.currentPlan}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.featureList}>
              {Strings.subscription.features.premium.map((f) => (
                <FeatureRow key={f} label={f} included={true} />
              ))}
            </View>
          </View>
        </View>

        {/* CTA */}
        {!isSubscribed ? (
          <TouchableOpacity
            style={styles.ctaBtnWrap}
            onPress={() => {
              setSubscribed(true);
              router.back();
            }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={Gradients.gold}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtn}
            >
              <Ionicons name="lock-open-outline" size={16} color={Colors.obsidian} />
              <Text style={styles.ctaBtnText}>{Strings.subscription.upgradeCta}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.downgradeCta}
            onPress={() => setSubscribed(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.downgradeText}>Cancel Subscription</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.disclaimer}>
          Cancel anytime. No hidden fees. Secure payment via Paynow, EcoCash, or card.
        </Text>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

function FeatureRow({
  label,
  included,
  muted = false,
}: {
  label: string;
  included: boolean;
  muted?: boolean;
}) {
  return (
    <View style={fStyles.row}>
      <View style={[fStyles.iconWrap, included ? fStyles.iconIncluded : fStyles.iconExcluded]}>
        <Ionicons
          name={included ? 'checkmark' : 'close'}
          size={11}
          color={included ? Colors.emerald500 : Colors.textDisabled}
        />
      </View>
      <Text style={[fStyles.label, (!included || muted) && fStyles.labelMuted]}>{label}</Text>
    </View>
  );
}

const fStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 5,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconIncluded: {
    backgroundColor: Colors.emeraldMuted,
  },
  iconExcluded: {
    backgroundColor: 'rgba(61,77,65,0.4)',
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    letterSpacing: LetterSpacing.wide,
  },
  labelMuted: {
    color: Colors.textMuted,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
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
  headerTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.base,
    paddingTop: Spacing.xl,
  },
  headline: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subheadline: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.base * 1.6,
  },
  planCard: {
    marginBottom: Spacing.base,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.cardBg,
    overflow: 'hidden',
    padding: Spacing.base,
    ...Shadow.sm,
  },
  currentPlan: {
    borderColor: Colors.borderEmerald,
  },
  premiumPlan: {
    padding: 0,
    borderColor: Colors.borderGold,
    borderWidth: 1.5,
    ...Shadow.gold,
  },
  premiumTopBar: {
    height: 3,
  },
  planCardInner: {
    padding: Spacing.base,
  },
  premiumTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: Spacing.sm,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  planName: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  premiumPlanName: {
    color: Colors.gold400,
  },
  planPrice: {
    fontFamily: FontFamily.displayLight,
    fontSize: FontSize['4xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['4xl'] * 1.0,
  },
  premiumPrice: {
    color: Colors.gold400,
  },
  planPriceLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'right',
    letterSpacing: LetterSpacing.wide,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.gold400,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 4,
  },
  popularBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 8,
    color: Colors.obsidian,
    letterSpacing: LetterSpacing.widest,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.emeraldMuted,
    borderWidth: 1,
    borderColor: Colors.borderEmerald,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 3,
    marginBottom: Spacing.sm,
  },
  currentBadgePremium: {
    backgroundColor: Colors.goldMuted,
    borderColor: Colors.borderGold,
  },
  currentBadgeText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize['2xs'],
    color: Colors.emerald500,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
  },
  currentBadgeTextGold: {
    color: Colors.gold400,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.sm,
  },
  featureList: {
    gap: 0,
  },
  mostPopularRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  mostPopularLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderGold,
  },
  mostPopularText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    color: Colors.gold400,
    letterSpacing: LetterSpacing.widest,
  },
  ctaBtnWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    ...Shadow.gold,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.base + 2,
    borderRadius: Radius.lg,
  },
  ctaBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.obsidian,
    letterSpacing: LetterSpacing.widest,
    textTransform: 'uppercase',
  },
  downgradeCta: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  downgradeText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    letterSpacing: LetterSpacing.wide,
  },
  disclaimer: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.sm,
    letterSpacing: LetterSpacing.wide,
  },
});
