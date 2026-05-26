import { Platform } from 'react-native';

interface IosShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
}

const makeShadow = (ios: IosShadow, elevation: number) =>
  Platform.select({ ios, android: { elevation }, default: {} });

export const adminShadows = {
  cardGlow: makeShadow(
    { shadowColor: '#1547B8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12 },
    8,
  ),
  metricGlow: makeShadow(
    { shadowColor: '#2D63D4', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 16 },
    10,
  ),
  successGlow: makeShadow(
    { shadowColor: '#00C472', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 12 },
    8,
  ),
  dangerGlow: makeShadow(
    { shadowColor: '#FF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 12 },
    8,
  ),
  warningGlow: makeShadow(
    { shadowColor: '#F5A623', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10 },
    6,
  ),
  deepCard: makeShadow(
    { shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.40, shadowRadius: 20 },
    12,
  ),
} as const;

export const adminPlatformShadow = (shadow: ReturnType<typeof makeShadow>) =>
  Platform.select({ ios: shadow, android: { elevation: (shadow as any)?.elevation ?? 4 }, default: {} });
