import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

const DotGridBackground = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg width="100%" height="100%" style={{ opacity: 0.55 }}>
      <Defs>
        <Pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <Circle cx="1" cy="1" r="1" fill="rgba(91,143,234,0.18)" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#dotgrid)" />
    </Svg>
  </View>
);

export default memo(DotGridBackground);
