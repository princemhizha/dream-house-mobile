import React, { useCallback, useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Role definitions ─────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'renter'  as UserRole,
    iconName:    'home-outline'     as const,
    label:       Strings.onboarding.roles.renting,
    subtitle:    'Find rental properties in Harare & beyond',
    accentColor: Colors.primaryColor,
    gradStart:   Colors.primaryColor,
    gradEnd:     Colors.primaryDark,
    chipLabel:   'Most popular',
  },
  {
    key: 'buyer'   as UserRole,
    iconName:    'business-outline' as const,
    label:       Strings.onboarding.roles.buying,
    subtitle:    'Explore properties available for purchase',
    accentColor: Colors.primaryColor,
    gradStart:   '#1A8C52',
    gradEnd:     Colors.primaryColor,
    chipLabel:   '',
  },
  {
    key: 'student' as UserRole,
    iconName:    'school-outline'   as const,
    label:       Strings.onboarding.roles.student,
    subtitle:    'Affordable rooms near universities',
    accentColor: Colors.gold400,
    gradStart:   Colors.gold400,
    gradEnd:     Colors.gold500,
    chipLabel:   'Budget-friendly',
  },
  {
    key: 'landlord' as UserRole,
    iconName:    'key-outline'      as const,
    label:       Strings.onboarding.roles.landlord,
    subtitle:    'List, manage & grow your portfolio',
    accentColor: Colors.gold400,
    gradStart:   Colors.gold500,
    gradEnd:     Colors.gold400,
    chipLabel:   'For owners',
  },
];

// ─── AnimatedTouchable ────────────────────────────────────────────────────────
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// ─── RoleCard ─────────────────────────────────────────────────────────────────
function RoleCard({
  role,
  index,
  onSelect,
}: {
  role: typeof ROLES[0];
  index: number;
  onSelect: () => void;
}) {
  const scale      = useSharedValue(1);
  const translateX = useSharedValue(72);
  const opacity    = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100 + 260;
    opacity.value    = withDelay(delay, withTiming(1,  { duration: 380, easing: Easing.out(Easing.ease) }));
    translateX.value = withDelay(delay, withSpring(0,  { damping: 18, stiffness: 130 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[styles.card, cardStyle]}
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 16, stiffness: 420 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1,    { damping: 12, stiffness: 320 });
      }}
      activeOpacity={1}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: role.accentColor }]} />

      {/* Icon with gradient background */}
      <LinearGradient
        colors={[role.gradStart, role.gradEnd]}
        style={styles.iconBubble}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={role.iconName} size={26} color={Colors.white} />
      </LinearGradient>

      {/* Text content */}
      <View style={styles.cardText}>
        <View style={styles.cardLabelRow}>
          <Text style={styles.cardLabel}>{role.label}</Text>
          {role.chipLabel ? (
            <View style={[styles.chip, { backgroundColor: `${role.accentColor}18` }]}>
              <Text style={[styles.chipText, { color: role.accentColor }]}>{role.chipLabel}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
      </View>

      {/* Arrow */}
      <View style={[styles.arrowCircle, { backgroundColor: `${role.accentColor}14` }]}>
        <Ionicons name="chevron-forward" size={16} color={role.accentColor} />
      </View>
    </AnimatedTouchable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function RoleSelectScreen() {
  const router  = useRouter();
  const { setRole } = useAuthStore();

  const headerOpacity = useSharedValue(0);
  const headerY       = useSharedValue(24);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    headerOpacity.value = withTiming(1, { duration: 500, easing: ease });
    headerY.value       = withTiming(0, { duration: 520, easing: ease });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const handleSelect = useCallback(
    (role: UserRole) => {
      setRole(role);
      router.push({ pathname: '/(onboarding)/access-gate', params: { role } });
    },
    [router, setRole],
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Soft background bloom */}
      <LinearGradient
        colors={['rgba(15,106,61,0.06)', 'transparent']}
        style={styles.bgBloom}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.55 }}
      />

      {/* Back button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, headerStyle]}>
          {/* Step indicator */}
          <View style={styles.stepRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i === 0 && styles.stepDotActive,
                ]}
              />
            ))}
            <Text style={styles.stepLabel}>Step 1 of 3</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{Strings.onboarding.roleTitle}</Text>

          {/* Green gradient underline accent */}
          <LinearGradient
            colors={Gradients.emerald}
            style={styles.titleUnderline}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />

          <Text style={styles.subtitle}>{Strings.onboarding.roleSubtitle}</Text>
        </Animated.View>

        {/* ── Cards ── */}
        <View style={styles.cards}>
          {ROLES.map((role, i) => (
            <RoleCard
              key={role.key}
              role={role}
              index={i}
              onSelect={() => handleSelect(role.key)}
            />
          ))}
        </View>

        {/* ── Sign-in link ── */}
        <TouchableOpacity
          style={styles.signInRow}
          onPress={() => router.push('/(onboarding)/sign-in')}
          activeOpacity={0.7}
        >
          <Text style={styles.signInText}>
            Already have an account?{'  '}
            <Text style={styles.signInHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgBloom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 320,
  },

  // Top bar
  topBar: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.lg,
  },

  // Header
  header: {
    gap: Spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  stepDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.borderDefault,
  },
  stepDotActive: {
    backgroundColor: Colors.primaryColor,
    width: 20,
    borderRadius: 4,
  },
  stepLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.primaryColor,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['3xl'] * 1.15,
  },
  titleUnderline: {
    width: 52,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
    lineHeight: FontSize.base * 1.65,
  },

  // Cards
  cards: {
    gap: Spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    overflow: 'hidden',
    paddingVertical: Spacing.base,
    paddingRight: Spacing.base,
    paddingLeft: Spacing.base + 4,   // extra left to clear accent bar
    gap: Spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconBubble: {
    width: 58,
    height: 58,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  cardLabel: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    lineHeight: FontSize.lg * 1.2,
  },
  chip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  chipText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs - 1,
    letterSpacing: LetterSpacing.wide,
  },
  cardSubtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // Sign-in
  signInRow: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  signInText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  signInHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primaryColor,
  },
});
