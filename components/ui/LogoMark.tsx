import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

const BRAND_LOGO = require('../../assets/brand-logo-live.png');

interface LogoMarkProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  style?: ViewStyle;
}

export function LogoMark({ size = 'large', showTagline = true, style }: LogoMarkProps) {
  const dimensions =
    size === 'large'
      ? styles.large
      : size === 'medium'
        ? styles.medium
        : styles.small;

  return (
    <View style={[styles.container, style]}>
      <Image
        source={BRAND_LOGO}
        style={[styles.image, dimensions, !showTagline && styles.compactImage]}
        resizeMode="contain"
        accessibilityLabel="Dream House logo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 280,
  },
  large: {
    width: 280,
    height: 280,
  },
  medium: {
    width: 220,
    height: 220,
  },
  small: {
    width: 156,
    height: 156,
  },
  compactImage: {
    height: 180,
  },
});
