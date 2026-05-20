import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing, LineHeight } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function SpringBtn({
  style,
  onPress,
  children,
  activeOpacity = 0.85,
}: {
  style?: object;
  onPress: () => void;
  children: React.ReactNode;
  activeOpacity?: number;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedTouchable
      style={[style, anim]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 12, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 400 }); }}
      activeOpacity={activeOpacity}
    >
      {children}
    </AnimatedTouchable>
  );
}

const HEADLINES: Record<string, string> = {
  renter: 'Find Your Next Home',
  buyer: 'Find Your Dream Property',
  student: 'Find Student Accommodation',
};

const CREATE_BENEFITS = [
  'Save unlimited properties',
  'Get notified of new listings',
  'Unlock landlord contacts',
  'Access premium listings',
];

const GUEST_LIMITS = [
  'Cannot save properties',
  'Landlord contacts hidden',
  'No price drop alerts',
  'Limited to basic listings',
];

const LANDLORD_FEATURES = [
  'List up to 5 properties (Basic)',
  'Featured listing placement',
  'Direct tenant inquiries',
  'Performance analytics',
  'Verified Landlord badge',
];

export default function AccessGateScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const { setGuestMode, setOnboardingComplete } = useAuthStore();

  const handleGuest = () => {
    setGuestMode(true);
    setOnboardingComplete();
    router.replace('/(tabs)');
  };

  if (role === 'landlord') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.landlordIconWrap}>
            <Ionicons name="business-outline" size={48} color={Colors.navy500} />
          </View>

          <Text style={styles.headline}>List Your Properties</Text>
          <Text style={styles.subHeadline}>
            Reach thousands of verified tenants and buyers across Zimbabwe.
          </Text>

          <View style={styles.featureCard}>
            <Text style={styles.cardLabel}>AS A REGISTERED LANDLORD:</Text>
            {LANDLORD_FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Ionicons name="checkmark" size={14} color={Colors.navy500} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.cardLabel}>LISTING FEES</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planName}>Basic listing</Text>
              <Text style={styles.priceValue}>$5 / listing / month</Text>
            </View>
            <View style={[styles.priceRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.planName}>Featured listing</Text>
              <Text style={styles.priceValue}>$15 / listing / month</Text>
            </View>
          </View>

          <SpringBtn onPress={() => router.push('/(onboarding)/landlord-signup')} style={styles.primaryBtnWrap}>
            <LinearGradient
              colors={Gradients.navyLight}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryBtnText}>Create Landlord Account</Text>
            </LinearGradient>
          </SpringBtn>

          <TouchableOpacity
            style={styles.signInLink}
            onPress={() => router.push('/(onboarding)/sign-in')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInLinkText}>Already registered? </Text>
            <Text style={styles.signInLinkHighlight}>Sign In</Text>
          </TouchableOpacity>

          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const headline = HEADLINES[role ?? 'renter'] ?? 'Find Your Next Home';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleGuest} style={styles.skipBtn} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.subHeadline}>
          Join thousands of Zimbabweans finding their perfect property on Dream House.
        </Text>

        {/* Create Account Card */}
        <View style={[styles.optionCard, styles.createCard]}>
          <View style={styles.recommendedRow}>
            <LinearGradient colors={Gradients.gold} style={styles.recommendedPill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.recommendedText}>RECOMMENDED</Text>
            </LinearGradient>
          </View>

          <Ionicons name="person-add-outline" size={32} color={Colors.navy500} style={{ marginBottom: Spacing.xs }} />
          <Text style={styles.cardTitle}>Create Free Account</Text>

          <View style={styles.benefitsList}>
            {CREATE_BENEFITS.map((b) => (
              <View key={b} style={styles.benefitRow}>
                <Ionicons name="checkmark" size={14} color={Colors.navy500} />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>

          <SpringBtn onPress={() => router.push('/(onboarding)/sign-up')} style={styles.fullBtnWrap}>
            <LinearGradient
              colors={Gradients.navyLight}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryBtnText}>Sign Up — It&apos;s Free</Text>
            </LinearGradient>
          </SpringBtn>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={() => router.push('/(onboarding)/sign-up')}>
              <Ionicons name="logo-google" size={18} color={Colors.textSecondary} />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8} onPress={() => router.push('/(onboarding)/sign-up')}>
                <Ionicons name="logo-apple" size={18} color={Colors.textSecondary} />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Guest Card */}
        <View style={styles.guestCard}>
          <Ionicons name="eye-outline" size={28} color={Colors.textMuted} style={{ marginBottom: Spacing.xs }} />
          <Text style={styles.guestTitle}>Browse as Guest</Text>

          <View style={styles.limitsList}>
            {GUEST_LIMITS.map((l) => (
              <View key={l} style={styles.limitRow}>
                <Ionicons name="remove-circle-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.limitText}>{l}</Text>
              </View>
            ))}
          </View>

          <SpringBtn onPress={handleGuest} style={styles.fullBtnWrap} activeOpacity={0.8}>
            <View style={styles.ghostBtn}>
              <Text style={styles.ghostBtnText}>Continue as Guest</Text>
            </View>
          </SpringBtn>
        </View>

        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => router.push('/(onboarding)/sign-in')}
          activeOpacity={0.7}
        >
          <Text style={styles.signInLinkText}>Already have an account? </Text>
          <Text style={styles.signInLinkHighlight}>Sign In</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  skipBtn: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  skipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.navy500,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
  },
  landlordIconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.xl,
    backgroundColor: Colors.navy50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xs,
  },
  headline: {
    fontFamily: FontFamily.displayBold,
    fontSize: 32,
    color: Colors.textPrimary,
    lineHeight: 32 * LineHeight.tight,
  },
  subHeadline: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  optionCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  createCard: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.navy400,
    ...Shadow.navy,
  },
  recommendedRow: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  recommendedPill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  recommendedText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 8,
    color: Colors.white,
    letterSpacing: LetterSpacing.label,
  },
  cardTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  benefitsList: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textBody,
    flex: 1,
  },
  fullBtnWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  primaryBtnWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderDefault,
  },
  dividerText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  socialBtnText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  guestCard: {
    backgroundColor: Colors.mist,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  guestTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  limitsList: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  limitText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  ghostBtn: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
  },
  ghostBtnText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textBody,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  cardLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.label,
    marginBottom: Spacing['2xs'],
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
  pricingCard: {
    backgroundColor: Colors.navy50,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderNavy,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderNavy,
  },
  planName: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textBody,
  },
  priceValue: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.navy700,
  },
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  signInLinkText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  signInLinkHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.navy500,
  },
});
