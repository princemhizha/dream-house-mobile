import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { adminSuccess } from '@/constants/adminColors';
import { usePulseGlow } from '@/constants/adminAnimations';

const LiveIndicator = () => {
  const pulseStyle = usePulseGlow();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, pulseStyle]} />
      <View style={styles.dot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: adminSuccess,
    opacity: 0.25,
  },
  dot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: adminSuccess,
  },
});

export default memo(LiveIndicator);
