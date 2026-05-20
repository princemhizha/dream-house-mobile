import { Easing } from 'react-native-reanimated';

export const springs = {
  gentle: { damping: 20, stiffness: 150 },
  bouncy: { damping: 12, stiffness: 200 },
  snappy: { damping: 25, stiffness: 300 },
  slow: { damping: 30, stiffness: 100 },
} as const;

export const timings = {
  fast: { duration: 200, easing: Easing.out(Easing.ease) },
  base: { duration: 350, easing: Easing.out(Easing.ease) },
  slow: { duration: 600, easing: Easing.out(Easing.ease) },
} as const;
