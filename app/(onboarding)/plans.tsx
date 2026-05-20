import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LineHeight } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function PlanCard({
  plan,
  onSelect,
}: {
  plan: 'free' | 'premium';
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const isFree = plan === 'free';

  return (
    <AnimatedTouchable
      style={[styles.planCard, !isFree && styles.premiumCard, anim]}
      onPress={onSelect}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 12, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 400 }); }}
      activeOpacity={1}
    >
      {!isFree && (
        <View style={styles.popularLabelWrap}>
          <LinearGradient colors={Gradients.gold} style={styles.popularPill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.popularText}>MOST POPULAR</Text>
          </LinearGradient>
        </View>
      )}

      <Text style={styles.planName}>{isFree ? 'Free' : 'Premium'}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceAmount}>{isFree ? '$0' : '$5'}</Text>
        <Text style={styles.priceUnit}>{isFree ? '/forever' : '/month'}</Text>
      </View>

      <View style={styles.featuresList}>
        {isFree ? (
          <>
            <FeatureItem icon="checkmark-circle" color={Colors.navy300} text="Browse all property listings" />
            <FeatureItem icon="checkmark-circle" color={Colors.navy300} text="Save up to 5 properties" />
            <FeatureItem icon="close-circle" color={Colors.ash} text="Landlord contact details hidden" muted />
            <FeatureItem icon="close-circle" color={Colors.ash} text="No price drop alerts" muted />
            <FeatureItem icon="close-circle" color={Colors.ash} text="Cannot access premium listings" muted />
          </>
        ) : (
          <>
            <FeatureItem icon="checkmark-circle" color={Colors.navy500} text="Unlock all landlord contacts" />
            <FeatureItem icon="checkmark-circle" color={Colors.navy500} text="Unlimited property saves" />
            <FeatureItem icon="checkmark-circle" color={Colors.navy500} text="Access premium listings" />
            <FeatureItem icon="checkmark-circle" color={Colors.navy500} text="Price drop notifications" />
            <FeatureItem icon="checkmark-circle" color={Colors.navy500} text="Priority customer support" />
          </>
        )}
      </View>

      {isFree ? (
        <View style={styles.freeCtaWrap}>
          <Text style={styles.freeCtaText}>Start for Free</Text>
        </View>
      ) : (
        <LinearGradient
          colors={Gradients.navyLight}
          style={styles.premiumCtaWrap}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.premiumCtaText}>Get Premium</Text>
        </LinearGradient>
      )}
    </AnimatedTouchable>
  );
}

function FeatureItem({
  icon,
  color,
  text,
  muted = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.featureText, muted && styles.featureTextMuted]}>{text}</Text>
    </View>
  );
}

export default function PlansScreen() {
  const router = useRouter();
  const { setPlan, setOnboardingComplete, setSubscribed } = useAuthStore();

  const handleSelect = (plan: 'free' | 'premium') => {
    setPlan(plan);
    if (plan === 'premium') setSubscribed(true);
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Start free. Upgrade when you&apos;re ready.</Text>

        <PlanCard plan="free" onSelect={() => handleSelect('free')} />
        <PlanCard plan="premium" onSelect={() => handleSelect('premium')} />

        <TouchableOpacity style={styles.compareLink} activeOpacity={0.7} onPress={() => router.push('/subscription')}>
          <Text style={styles.compareLinkText}>Compare plans</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    gap: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
  subtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.lg,
    gap: Spacing.base,
    ...Shadow.sm,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: Colors.gold400,
    ...Shadow.gold,
  },
  popularLabelWrap: {
    alignItems: 'center',
    marginBottom: -Spacing.xs,
  },
  popularPill: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  popularText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    color: Colors.white,
    letterSpacing: 2,
  },
  planName: {
    fontFamily: FontFamily.displayBold,
    fontSize: 28,
    color: Colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  priceAmount: {
    fontFamily: FontFamily.displayLight,
    fontSize: 48,
    color: Colors.navy700,
    lineHeight: 52,
  },
  priceUnit: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  featuresList: {
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textBody,
    flex: 1,
  },
  featureTextMuted: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  freeCtaWrap: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.navy700,
    borderRadius: Radius.md,
  },
  freeCtaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.navy700,
  },
  premiumCtaWrap: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  premiumCtaText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  compareLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
  },
  compareLinkText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.navy500,
    textDecorationLine: 'underline',
  },
});
