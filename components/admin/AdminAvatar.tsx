import React, { memo } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { adminBlue200, adminBlue700, adminBorderGlow } from '@/constants/adminColors';

interface AdminAvatarProps {
  name: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AdminAvatar = ({ name, size = 40, style }: AdminAvatarProps) => {
  const fontSize = Math.round(size * 0.35);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: adminBlue700,
    borderWidth: 1,
    borderColor: adminBorderGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: adminBlue200,
    fontFamily: 'Fraunces_700Bold',
    includeFontPadding: false,
  },
});

export default memo(AdminAvatar);
