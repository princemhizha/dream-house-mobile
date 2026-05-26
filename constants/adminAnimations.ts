import { useEffect, useRef, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

// ─── SPRING CONFIGS ───────────────────────────────────────────────────────────
export const adminSprings = {
  precise: { damping: 30, stiffness: 350 },
  smooth:  { damping: 22, stiffness: 200 },
  gentle:  { damping: 18, stiffness: 150 },
  bouncy:  { damping: 12, stiffness: 220 },
} as const;

// ─── useCountUp ───────────────────────────────────────────────────────────────
/** Returns a plain number that counts from 0 to targetValue over `duration` ms. */
export const useCountUp = (targetValue: number, duration = 800): number => {
  const [count, setCount] = useState(0);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCount(0);
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(targetValue * eased));
      if (progress < 1) {
        rafRef.current = setTimeout(tick, 16);
      }
    };
    rafRef.current = setTimeout(tick, 16);
    return () => {
      if (rafRef.current !== null) clearTimeout(rafRef.current);
    };
  }, [targetValue, duration]);

  return count;
};

// ─── usePulseGlow ─────────────────────────────────────────────────────────────
/** Repeating opacity pulse: 1.0 -> 0.35 -> 1.0 every 1400ms */
export const usePulseGlow = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(1.0, { duration: 700 }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};

// ─── useSlideEnter ────────────────────────────────────────────────────────────
/** Slide in from left with opacity fade, with optional delay. */
export const useSlideEnter = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, adminSprings.smooth));
    translateX.value = withDelay(delay, withSpring(0, adminSprings.smooth));
  }, [delay]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));
};

// ─── useScalePress ────────────────────────────────────────────────────────────
/** Returns { pressHandlers, animatedStyle } for press scale feedback. */
export const useScalePress = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressHandlers = {
    onPressIn: () => {
      scale.value = withSpring(0.97, adminSprings.precise);
    },
    onPressOut: () => {
      scale.value = withSpring(1.0, adminSprings.precise);
    },
  };

  return { pressHandlers, animatedStyle };
};

// ─── useScanLine ──────────────────────────────────────────────────────────────
/** Scan line that sweeps left-to-right repeatedly. */
export const useScanLine = (containerWidth: number) => {
  const translateX = useSharedValue(-containerWidth);

  useEffect(() => {
    if (containerWidth <= 0) return;
    translateX.value = withRepeat(
      withTiming(containerWidth, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [containerWidth]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
};

// ─── useStatusFlash ───────────────────────────────────────────────────────────
/** Full-screen colored flash on approve / reject. */
export const useStatusFlash = () => {
  const opacity = useSharedValue(0);
  const colorRef = useRef('#00C472');

  const [flashColor, setFlashColor] = useState('#00C472');

  const flashStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const setColor = (c: string) => {
    colorRef.current = c;
    setFlashColor(c);
  };

  const triggerFlash = (color: string) => {
    runOnJS(setColor)(color);
    opacity.value = withSequence(
      withTiming(0.20, { duration: 150 }),
      withTiming(0, { duration: 500 }),
    );
  };

  return { flashStyle, flashColor, triggerFlash };
};

// ─── useBadgePulse ────────────────────────────────────────────────────────────
/** Scale pulse for pending count badges. */
export const useBadgePulse = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.08, adminSprings.gentle),
        withSpring(1.0, adminSprings.gentle),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};
