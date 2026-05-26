import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSurface,
  adminBorderDefault,
  adminBorderStrong,
  adminTextPrimary,
  adminTextMuted,
  adminCyan500,
  adminWarning,
  adminSuccess,
  adminDanger,
  adminBlue500,
  adminBlue300,
} from '@/constants/adminColors';
import { adminShadows } from '@/constants/adminShadows';
import { useCountUp, useScanLine } from '@/constants/adminAnimations';

interface MetricCardProps {
  targetValue: number;
  icon: string;
  iconColor: string;
  label: string;
  subtext: string;
  borderColor: string;
  glowColor?: string;
  width?: number;
}

const MetricCard = ({
  targetValue,
  icon,
  iconColor,
  label,
  subtext,
  borderColor,
  glowColor,
  width = 160,
}: MetricCardProps) => {
  const count = useCountUp(targetValue);
  const [containerWidth, setContainerWidth] = useState(width);
  const scanStyle = useScanLine(containerWidth);
  const [showScan, setShowScan] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowScan(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const iconBg = glowColor
    ? glowColor.replace('0.20', '0.12').replace('0.15', '0.12').replace('0.12', '0.12')
    : 'rgba(91,143,234,0.12)';

  return (
    <View
      style={[
        styles.card,
        {
          width,
          borderColor,
          ...(adminShadows.deepCard as object),
        },
      ]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Scan line overlay */}
      {showScan && (
        <Animated.View
          style={[styles.scanLine, scanStyle]}
          pointerEvents="none"
        />
      )}

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>

      {/* Value */}
      <Text style={styles.value}>{count}</Text>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Subtext */}
      <Text style={styles.subtext}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: adminSurface,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    height: 1,
    width: '100%',
    top: '50%',
    backgroundColor: adminCyan500,
    opacity: 0.25,
    zIndex: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 40,
    color: adminTextPrimary,
    marginVertical: 8,
    includeFontPadding: false,
  },
  label: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: adminTextMuted,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    includeFontPadding: false,
  },
  subtext: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    marginTop: 2,
    includeFontPadding: false,
  },
});

export default memo(MetricCard);
