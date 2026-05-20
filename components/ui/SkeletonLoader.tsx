import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { Radius, Spacing } from '../../constants/spacing';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SKELETON_BASE = '#1D2B1F';
const SKELETON_SHIMMER = 'rgba(38,194,129,0.06)';

export function Skeleton({ width, height, borderRadius = Radius.md, style }: SkeletonProps) {
  const shimmerX = useSharedValue(-1);

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, [shimmerX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * (typeof width === 'number' ? width : 300) }],
  }));

  return (
    <View
      style={[
        { width: width as number, height, borderRadius, backgroundColor: SKELETON_BASE, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', SKELETON_SHIMMER, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '200%', height: '100%', left: '-50%' }}
        />
      </Animated.View>
    </View>
  );
}

export function SkeletonPulse({ width, height, borderRadius = Radius.md, style }: SkeletonProps) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: width as number, height, borderRadius, backgroundColor: SKELETON_BASE },
        animStyle,
        style,
      ]}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={210} borderRadius={0} />
      <View style={styles.content}>
        <Skeleton width="65%" height={16} />
        <Skeleton width="45%" height={12} />
        <Skeleton width="50%" height={28} style={styles.priceSkel} />
        <View style={styles.row}>
          <Skeleton width={40} height={12} />
          <Skeleton width={40} height={12} />
          <Skeleton width={40} height={12} />
        </View>
      </View>
    </View>
  );
}

export function FeaturedCardSkeleton() {
  const { width: CARD_WIDTH } = { width: 300 };
  return (
    <Skeleton width={CARD_WIDTH} height={290} borderRadius={Radius.xl} style={styles.featuredSkel} />
  );
}

export function StatCardSkeleton() {
  return (
    <View style={styles.statCard}>
      <Skeleton width={32} height={32} borderRadius={Radius.sm} />
      <Skeleton width={48} height={36} style={styles.statNum} />
      <Skeleton width={56} height={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  content: {
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  priceSkel: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  featuredSkel: {
    marginRight: Spacing.base,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.base,
  },
  statNum: {
    marginTop: 4,
  },
});
