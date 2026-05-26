import React, { memo, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { adminCyan500, adminSuccess, adminBlue300 } from '@/constants/adminColors';

interface ScanFrameProps {
  width: number;
  height: number;
}

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 3;

const Corner = ({
  position,
  color,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color: string;
}) => {
  const isTop = position === 'tl' || position === 'tr';
  const isLeft = position === 'tl' || position === 'bl';

  return (
    <View
      style={{
        position: 'absolute',
        top: isTop ? 0 : undefined,
        bottom: isTop ? undefined : 0,
        left: isLeft ? 0 : undefined,
        right: isLeft ? undefined : 0,
        width: CORNER_SIZE,
        height: CORNER_SIZE,
      }}
    >
      {/* Horizontal arm */}
      <View
        style={{
          position: 'absolute',
          top: isTop ? 0 : undefined,
          bottom: isTop ? undefined : 0,
          left: isLeft ? 0 : undefined,
          right: isLeft ? undefined : 0,
          width: CORNER_SIZE,
          height: CORNER_THICKNESS,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
      {/* Vertical arm */}
      <View
        style={{
          position: 'absolute',
          top: isTop ? 0 : undefined,
          bottom: isTop ? undefined : 0,
          left: isLeft ? 0 : undefined,
          right: isLeft ? undefined : 0,
          width: CORNER_THICKNESS,
          height: CORNER_SIZE,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </View>
  );
};

const ScanFrame = ({ width, height }: ScanFrameProps) => {
  const scanY = useSharedValue(-10);
  const cornerColor = useSharedValue(0); // 0=cyan, 1=green, 2=blue
  const frameOpacity = useSharedValue(1);

  // Phase 1: scan line animation (0-2500ms)
  // Phase 2: corners flash green + lock (2500ms+)
  // Phase 3: static blue corners

  const [phase, setPhase] = React.useState<'scanning' | 'locked'>('scanning');
  const [cornerCol, setCornerCol] = React.useState(adminCyan500);

  useEffect(() => {
    // Repeating scan line for first 2.5s
    scanY.value = withSequence(
      withTiming(height + 10, { duration: 1200, easing: Easing.linear }),
      withTiming(-10, { duration: 0 }),
      withTiming(height + 10, { duration: 1200, easing: Easing.linear }),
    );

    const lockTimer = setTimeout(() => {
      setPhase('locked');
      setCornerCol(adminSuccess);
      // Flash briefly green then settle blue
      setTimeout(() => setCornerCol(adminBlue300), 600);
    }, 2500);

    return () => clearTimeout(lockTimer);
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value }],
    opacity: phase === 'scanning' ? 1 : 0,
  }));

  return (
    <View
      style={[StyleSheet.absoluteFill, { pointerEvents: 'none', zIndex: 10 }]}
    >
      {/* Scan line */}
      {phase === 'scanning' && (
        <Animated.View style={[styles.scanLine, { width }, scanLineStyle]} />
      )}

      {/* Corner brackets */}
      <Corner position="tl" color={cornerCol} />
      <Corner position="tr" color={cornerCol} />
      <Corner position="bl" color={cornerCol} />
      <Corner position="br" color={cornerCol} />
    </View>
  );
};

const styles = StyleSheet.create({
  scanLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: adminCyan500,
    opacity: 0.7,
    shadowColor: adminCyan500,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default memo(ScanFrame);
