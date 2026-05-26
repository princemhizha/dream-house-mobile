import React, { memo, useState } from 'react';
import {
  Platform,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Suppress browser native focus ring on web (prevents double-box)
const webInputReset: object =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {};
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminSurfaceHigh,
  adminBorderSubtle,
  adminBorderGlow,
  adminDanger,
  adminTextPrimary,
  adminTextMuted,
  adminBlue300,
} from '@/constants/adminColors';

interface AdminInputProps {
  label?: string;
  placeholder: string;
  icon?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  maxLength?: number;
}

const AdminInput = ({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  maxLength,
}: AdminInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const borderColor = error
    ? adminDanger
    : isFocused
    ? adminBorderGlow
    : adminBorderSubtle;

  return (
    <View style={[styles.container, style]}>
      {label !== undefined && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View
        style={[
          styles.inputRow,
          { borderColor },
          multiline && { alignItems: 'flex-start', paddingTop: 12 },
        ]}
      >
        {icon !== undefined && (
          <Ionicons
            name={icon as any}
            size={16}
            color={isFocused ? adminBlue300 : adminTextMuted}
            style={multiline ? { marginTop: 2 } : undefined}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={adminTextMuted}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          style={[
            styles.input,
            icon !== undefined && styles.inputWithIcon,
            multiline && { minHeight: numberOfLines * 22, textAlignVertical: 'top' },
            webInputReset,
          ]}
          selectionColor={adminBlue300}
        />
        {(rightIcon !== undefined || secureTextEntry) && (
          <TouchableOpacity
            onPress={secureTextEntry ? () => setSecure((p) => !p) : onRightIconPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? secure
                    ? 'eye-off-outline'
                    : 'eye-outline'
                  : (rightIcon as any)
              }
              size={16}
              color={adminTextMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error !== undefined && error.length > 0 && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: adminTextMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    includeFontPadding: false,
  },
  inputRow: {
    backgroundColor: adminSurfaceHigh,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: adminTextPrimary,
    includeFontPadding: false,
    padding: 0,
  },
  inputWithIcon: {
    marginLeft: 10,
  },
  errorText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: adminDanger,
    marginTop: 4,
  },
});

export default memo(AdminInput);
