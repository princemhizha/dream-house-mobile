import React, { useEffect } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { shadows } from '../../constants/shadows';

type DHLogoVariant = 'badge' | 'circle' | 'lockup' | 'hero';
type DHLogoTheme = 'navy' | 'white' | 'transparent';

const BRAND_LOGO = require('../../assets/brand-logo-live.png');
const BRAND_MARK = require('../../assets/brand-mark.png');

interface DHLogoProps {
  variant?: DHLogoVariant;
  theme?: DHLogoTheme;
  style?: ViewStyle;
  pulse?: boolean;
}

export function DHLogo({ variant = 'lockup', theme = 'navy', style, pulse = false }: DHLogoProps) {
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [pulse, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  const wrapperStyle =
    variant === 'hero'
      ? styles.heroContainer
      : variant === 'lockup'
        ? styles.lockup
        : variant === 'circle'
          ? styles.circle
          : styles.badge;

  const imageStyle =
    variant === 'hero'
      ? styles.heroImage
      : variant === 'lockup'
        ? styles.lockupImage
        : variant === 'circle'
          ? styles.circleImage
          : styles.badgeImage;

  const source = variant === 'circle' || variant === 'badge' ? BRAND_MARK : BRAND_LOGO;

  const surfaceStyle =
    variant === 'hero'
      ? shadows.xl
      : variant === 'lockup'
        ? null
        : shadows.md;

  return (
    <Animated.View style={[wrapperStyle, surfaceStyle, style, pulse && pulseStyle]}>
      <Image
        source={source}
        style={imageStyle}
        resizeMode="contain"
        accessibilityLabel="Dream House logo"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: 280,
    height: 280,
    borderRadius: 36,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 18,
    overflow: 'hidden',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  lockup: {
    justifyContent: 'center',
  },
  lockupImage: {
    width: 136,
    height: 46,
  },
});
