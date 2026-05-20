import React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/colors';
import { Radius } from '../../constants/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  blur?: boolean;
  intensity?: number;
}

export function GlassCard({ children, style, blur = false, intensity = 40 }: GlassCardProps) {
  if (blur) {
    return (
      <BlurView intensity={intensity} tint="light" style={[styles.card, styles.blurCard, style]}>
        {children}
      </BlurView>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  blurCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
