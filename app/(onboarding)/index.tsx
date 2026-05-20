import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';

const LANDING_LOGO = require('../../assets/brand-logo-live.png');
const LANDING_BG = require('../../assets/3d-render-contemporary-living-space.jpg');

// ─── Floating particle config ────────────────────────────────────────────────
const PARTICLES: { x: number; size: number; delay: number; dur: number; alpha: number }[] = [
  { x: 0.08, size: 5,  delay: 0,    dur: 3400, alpha: 0.22 },
  { x: 0.22, size: 3,  delay: 700,  dur: 2800, alpha: 0.14 },
  { x: 0.48, size: 7,  delay: 1300, dur: 3800, alpha: 0.18 },
  { x: 0.65, size: 4,  delay: 400,  dur: 2600, alpha: 0.20 },
  { x: 0.82, size: 6,  delay: 1000, dur: 3200, alpha: 0.16 },
  { x: 0.35, size: 3,  delay: 1900, dur: 3000, alpha: 0.12 },
  { x: 0.90, size: 4,  delay: 200,  dur: 2900, alpha: 0.15 },
];

function Particle({
  cfg,
  screenWidth,
  screenHeight,
}: {
  cfg: typeof PARTICLES[0];
  screenWidth: number;
  screenHeight: number;
}) {
  const y       = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const fadeEase = Easing.inOut(Easing.ease);
    opacity.value = withDelay(
      cfg.delay,
      withRepeat(
        withSequence(
          withTiming(cfg.alpha, { duration: cfg.dur * 0.25, easing: fadeEase }),
          withTiming(cfg.alpha, { duration: cfg.dur * 0.50 }),
          withTiming(0,         { duration: cfg.dur * 0.25, easing: fadeEase }),
        ),
        -1,
        false,
      ),
    );
    y.value = withDelay(
      cfg.delay,
      withRepeat(
        withTiming(-screenHeight * 0.40, { duration: cfg.dur, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [cfg.alpha, cfg.delay, cfg.dur, screenHeight]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: screenWidth * cfg.x,
          bottom: screenHeight * 0.08,
          width: cfg.size,
          height: cfg.size,
          borderRadius: cfg.size / 2,
        },
        style,
      ]}
    />
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isSmallPhone = screenWidth < 380;
  const isShortScreen = screenHeight < 760;
  const isTablet = screenWidth >= 768;
  const logoSize = isTablet ? 240 : isSmallPhone ? 176 : 216;
  const ringSize = isTablet ? 300 : isSmallPhone ? 232 : 280;

  // Logo
  const logoScale   = useSharedValue(0.75);
  const logoOpacity = useSharedValue(0);
  const logoY       = useSharedValue(36);
  const logoFloat   = useSharedValue(0);

  // Pulsing ring behind logo
  const ringScale   = useSharedValue(0.88);
  const ringOpacity = useSharedValue(0);

  // Brand text
  const brandOpacity = useSharedValue(0);
  const brandY       = useSharedValue(20);

  // Stats badge
  const badgeOpacity = useSharedValue(0);
  const badgeScale   = useSharedValue(0.88);

  // CTA section
  const ctaOpacity = useSharedValue(0);
  const ctaY       = useSharedValue(28);

  // CTA shimmer
  const shimmerX = useSharedValue(-120);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);

    // Logo entrance — dramatic spring overshoot
    logoScale.value   = withSpring(1, { damping: 9, stiffness: 72 });
    logoOpacity.value = withTiming(1, { duration: 600, easing: ease });
    logoY.value       = withTiming(0, { duration: 700, easing: ease });

    // Pulsing ring
    ringOpacity.value = withDelay(350, withTiming(1, { duration: 500 }));
    ringScale.value   = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(1.0,  { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.88, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );

    // Logo idle float
    logoFloat.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(-9, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0,  { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      ),
    );

    // Brand text
    brandOpacity.value = withDelay(200, withTiming(1, { duration: 600, easing: ease }));
    brandY.value       = withDelay(200, withTiming(0, { duration: 600, easing: ease }));

    // Stats badge — spring pop
    badgeOpacity.value = withDelay(420, withTiming(1, { duration: 500 }));
    badgeScale.value   = withDelay(420, withSpring(1, { damping: 11, stiffness: 180 }));

    // CTA block
    ctaOpacity.value = withDelay(560, withTiming(1, { duration: 700, easing: ease }));
    ctaY.value       = withDelay(560, withTiming(0, { duration: 700, easing: ease }));

    // Shimmer sweep — start after CTA is visible, then loop
    shimmerX.value = withDelay(
      1400,
      withRepeat(
        withTiming(screenWidth + 120, { duration: 2200, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [screenWidth]);

  const logoStyle  = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value + logoFloat.value }, { scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const ringStyle  = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));
  const brandStyle = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
    transform: [{ translateY: brandY.value }],
  }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));
  const ctaStyle   = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaY.value }],
  }));
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <ImageBackground
      source={LANDING_BG}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{
        width: screenWidth + 8,
        height: screenHeight + 8,
        marginLeft: -4,
        marginTop: -4,
      }}
    >

      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(6,18,13,0.44)', 'rgba(10,24,17,0.20)', 'rgba(6,18,13,0.48)']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Top green radial bloom */}
      <LinearGradient
        colors={['rgba(15,106,61,0.18)', 'transparent']}
        style={[styles.radialGlow, { height: screenHeight * 0.52 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Ambient orbs */}
      <View
        style={[
          styles.orb,
          {
            width: screenWidth * 0.75,
            height: screenWidth * 0.75,
            backgroundColor: Colors.emeraldMuted,
            top: -screenWidth * 0.22,
            right: -screenWidth * 0.28,
          },
        ]}
      />
      <View
        style={[
          styles.orb,
          {
            width: screenWidth * 0.55,
            height: screenWidth * 0.55,
            backgroundColor: Colors.goldMuted,
            bottom: -screenWidth * 0.15,
            left: -screenWidth * 0.2,
          },
        ]}
      />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} cfg={p} screenWidth={screenWidth} screenHeight={screenHeight} />
      ))}

      <SafeAreaView style={styles.safe}>
        <View
          style={[
            styles.content,
            {
              paddingHorizontal: isSmallPhone ? Spacing.lg : Spacing.xl,
              paddingTop: isShortScreen ? screenHeight * 0.05 : screenHeight * 0.09,
              paddingBottom: isSmallPhone ? Spacing.xl : Spacing['2xl'],
            },
          ]}
        >

          {/* ── Logo section ── */}
          <View style={styles.logoSection}>
            {/* Pulsing glow ring */}
            <Animated.View
              style={[
                styles.logoRing,
                { width: ringSize, height: ringSize, borderRadius: ringSize / 2, top: -18 },
                ringStyle,
              ]}
            />

            <Animated.View style={logoStyle}>
              <Image
                source={LANDING_LOGO}
                style={[styles.logoImage, { width: logoSize, height: logoSize }]}
                resizeMode="contain"
                accessibilityLabel="Dream House logo"
              />
            </Animated.View>

            <Animated.View style={[styles.brandBlock, brandStyle]}>
              <Text style={[styles.brandName, isSmallPhone && styles.brandNameCompact]}>Dream House</Text>
              <Text style={[styles.brandTagline, isSmallPhone && styles.brandTaglineCompact]}>
                {Strings.app.tagline.toUpperCase()}
              </Text>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDot} />
                <View style={styles.dividerLine} />
              </View>
            </Animated.View>
          </View>

          {/* ── Stats badge ── */}
          <Animated.View style={[styles.statsRow, isSmallPhone && styles.statsRowCompact, badgeStyle]}>
            <View style={styles.statChip}>
              <Ionicons name="home" size={12} color={Colors.primaryColor} />
              <Text style={styles.statText}>5,000+ Homes</Text>
            </View>
            <View style={[styles.statSep, isSmallPhone && styles.statSepHidden]} />
            <View style={styles.statChip}>
              <Ionicons name="people" size={12} color={Colors.gold400} />
              <Text style={styles.statText}>12k+ Happy Clients</Text>
            </View>
            <View style={[styles.statSep, isSmallPhone && styles.statSepHidden]} />
            <View style={styles.statChip}>
              <Ionicons name="location" size={12} color={Colors.primaryColor} />
              <Text style={styles.statText}>Zimbabwe</Text>
            </View>
          </Animated.View>

          {/* ── CTA section ── */}
          <Animated.View style={[styles.ctaContainer, isTablet && styles.ctaContainerTablet, ctaStyle]}>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => router.push('/(onboarding)/role-select')}
              activeOpacity={0.86}
            >
              <LinearGradient
                colors={Gradients.emerald}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>{Strings.onboarding.getStarted}</Text>
                <Ionicons
                  name="arrow-forward-circle"
                  size={20}
                  color={Colors.textInverse}
                  style={styles.ctaIcon}
                />
                {/* Shimmer sweep */}
                <Animated.View
                  style={[styles.shimmerWrap, shimmerStyle]}
                  pointerEvents="none"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.22)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmerBar}
                  />
                </Animated.View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(onboarding)/sign-in')}
              activeOpacity={0.7}
              style={styles.signInRow}
            >
              <Text style={[styles.signInText, isSmallPhone && styles.signInTextCompact]}>
                Already have an account?{'  '}
                <Text style={styles.signInHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>

            <Text style={[styles.disclaimer, isSmallPhone && styles.disclaimerCompact]}>
              By continuing you agree to our Terms &amp; Privacy Policy
            </Text>
          </Animated.View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  radialGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Logo ──
  logoSection: {
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: 'rgba(6, 18, 13, 0.30)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  logoRing: {
    position: 'absolute',
    backgroundColor: Colors.emeraldMuted,
  },
  logoImage: {
    width: 216,
    height: 216,
  },
  brandBlock: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  brandName: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textInverse,
    letterSpacing: LetterSpacing.tighter,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  brandNameCompact: {
    fontSize: FontSize.xl,
  },
  brandTagline: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.xs,
    color: 'rgba(244, 251, 247, 0.88)',
    letterSpacing: LetterSpacing.wider,
    textShadowColor: 'rgba(0,0,0,0.28)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  brandTaglineCompact: {
    fontSize: FontSize.xs - 1,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: Spacing.sm,
  },
  dividerLine: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#A8FFD0',
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'rgba(6, 18, 13, 0.62)',
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    gap: 10,
  },
  statsRowCompact: {
    flexWrap: 'wrap',
    borderRadius: Radius.xl,
    rowGap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    minWidth: 0,
  },
  statText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: '#F2FBF6',
    flexShrink: 1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statSep: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.34)',
    flexShrink: 0,
  },
  statSepHidden: {
    display: 'none',
  },

  // ── CTA ──
  ctaContainer: {
    width: '100%',
    gap: Spacing.base,
    alignItems: 'center',
  },
  ctaContainerTablet: {
    maxWidth: 460,
  },
  ctaBtn: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    paddingVertical: Spacing.base + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  ctaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textInverse,
    letterSpacing: LetterSpacing.wide,
  },
  ctaIcon: {
    marginLeft: Spacing.xs,
  },
  shimmerWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
  },
  shimmerBar: {
    flex: 1,
    width: 80,
  },
  signInRow: {
    paddingVertical: 2,
  },
  signInText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: 'rgba(244, 251, 247, 0.92)',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  signInTextCompact: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
  signInHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    color: '#A8FFD0',
  },
  disclaimer: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: 'rgba(244, 251, 247, 0.82)',
    textAlign: 'center',
    lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.22)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  disclaimerCompact: {
    lineHeight: 16,
    paddingHorizontal: Spacing.sm,
  },

  // ── Orbs ──
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.30,
  },

  // ── Particles ──
  particle: {
    position: 'absolute',
    backgroundColor: Colors.primaryColor,
  },
});
