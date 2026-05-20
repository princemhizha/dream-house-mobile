import React, { memo } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

type IconLibrary = 'Ionicons' | 'MaterialCommunityIcons';
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconColor = 'primary' | 'muted' | 'emerald' | 'gold' | 'error' | 'white';

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const COLOR_MAP: Record<IconColor, string> = {
  primary: Colors.textPrimary,
  muted: Colors.textMuted,
  emerald: Colors.emerald500,
  gold: Colors.gold400,
  error: Colors.rented,
  white: Colors.textPrimary,
};

interface IconProps {
  library?: IconLibrary;
  name: string;
  size?: IconSize | number;
  color?: IconColor | string;
}

function IconComponent({ library = 'Ionicons', name, size = 'md', color = 'muted' }: IconProps) {
  const resolvedSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const resolvedColor = COLOR_MAP[color as IconColor] ?? color;

  if (library === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={name as keyof typeof MaterialCommunityIcons.glyphMap}
        size={resolvedSize}
        color={resolvedColor}
      />
    );
  }

  return (
    <Ionicons
      name={name as keyof typeof Ionicons.glyphMap}
      size={resolvedSize}
      color={resolvedColor}
    />
  );
}

export const Icon = memo(IconComponent);
