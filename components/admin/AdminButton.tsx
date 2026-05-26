import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminBlue500,
  adminSuccess,
  adminDanger,
  adminTextMuted,
  adminBorderGlow,
  adminTextPrimary,
} from '@/constants/adminColors';
import { adminShadows } from '@/constants/adminShadows';
import { useScalePress } from '@/constants/adminAnimations';

type ButtonVariant = 'primary' | 'success' | 'danger' | 'ghost';

interface AdminButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  icon?: string;
  iconSide?: 'left' | 'right';
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { bg: string; border?: string; labelColor: string; shadow?: object }> = {
  primary: {
    bg: adminBlue500,
    labelColor: '#FFFFFF',
    shadow: adminShadows.cardGlow,
  },
  success: {
    bg: adminSuccess,
    labelColor: '#FFFFFF',
    shadow: adminShadows.successGlow,
  },
  danger: {
    bg: 'transparent',
    border: adminDanger,
    labelColor: adminDanger,
  },
  ghost: {
    bg: 'transparent',
    labelColor: adminTextMuted,
  },
};

const AdminButton = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  icon,
  iconSide = 'left',
  fullWidth = false,
}: AdminButtonProps) => {
  const { pressHandlers, animatedStyle } = useScalePress();
  const config = VARIANT_STYLES[variant];

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        activeOpacity={1}
        style={[
          styles.button,
          { backgroundColor: config.bg },
          config.border && { borderWidth: 1.5, borderColor: config.border },
          config.shadow as object,
          (disabled || isLoading) && styles.disabled,
          fullWidth && styles.fullWidth,
        ]}
        {...pressHandlers}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={config.labelColor} />
        ) : (
          <View style={styles.row}>
            {icon && iconSide === 'left' && (
              <Ionicons
                name={icon as any}
                size={14}
                color={config.labelColor}
                style={styles.iconLeft}
              />
            )}
            <Text style={[styles.label, { color: config.labelColor }]}>{label}</Text>
            {icon && iconSide === 'right' && (
              <Ionicons
                name={icon as any}
                size={14}
                color={config.labelColor}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
  disabled: {
    opacity: 0.45,
  },
});

export default memo(AdminButton);
