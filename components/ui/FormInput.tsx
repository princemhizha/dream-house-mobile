import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius } from '../../constants/spacing';

export interface FormInputProps extends React.ComponentProps<typeof TextInput> {
  /** Label displayed above the input */
  label?: string;
  /** Left icon (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Right icon — e.g. eye toggle */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  /** Inline prefix text (e.g. "+263" for phone fields) */
  prefix?: string;
  /** Inline error message displayed below */
  error?: string;
  /** Whether this field currently has keyboard focus */
  focused?: boolean;
}

// Web-only: suppress the browser's native focus outline so only our custom
// emerald border is visible (prevents the "double border" problem on web).
const webOutlineReset: object =
  Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as object) : {};

export function FormInput({
  label,
  icon,
  rightIcon,
  onRightPress,
  prefix,
  error,
  focused,
  multiline,
  style,
  ...textInputProps
}: FormInputProps) {
  const hasError = !!error && error.trim().length > 0;

  return (
    <View style={s.wrap}>
      {label ? <Text style={s.label}>{label}</Text> : null}

      <View
        style={[
          s.row,
          multiline && s.rowMultiline,
          focused && !hasError && s.rowFocused,
          hasError && s.rowError,
        ]}
      >
        {/* Prefix (e.g. country code) */}
        {prefix ? (
          <View style={s.prefixWrap}>
            <Text style={s.prefixText}>{prefix}</Text>
            <View style={s.prefixDivider} />
          </View>
        ) : null}

        {/* Left icon */}
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={
              hasError
                ? Colors.error
                : focused
                ? Colors.primaryColor
                : Colors.textMuted
            }
            style={[s.icon, multiline && s.iconTop]}
          />
        ) : null}

        {/* Text input */}
        <TextInput
          style={[s.input, multiline && s.inputMultiline, webOutlineReset, style]}
          placeholderTextColor={Colors.textDisabled}
          multiline={multiline}
          {...textInputProps}
        />

        {/* Right icon (e.g. eye toggle) */}
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            activeOpacity={0.7}
            style={s.rightBtn}
          >
            <Ionicons name={rightIcon} size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {hasError ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    gap: 6,
  },

  // --- Label ---
  label: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.1,
  },

  // --- Input row ---
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,       // 20 px
    // @ts-ignore — iOS 16+ continuous squircle curve
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    minHeight: 58,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  rowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 18,
    paddingBottom: 18,
    minHeight: 110,
  },

  // Focus: deep luxury green border + soft glow
  rowFocused: {
    borderColor: Colors.primaryColor,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },

  // Error: red tint
  rowError: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(220,38,38,0.03)',
  },

  // --- Prefix (e.g. "+263") ---
  prefixWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  prefixText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  prefixDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.borderDefault,
  },

  // --- Left icon ---
  icon: {
    marginRight: 10,
    flexShrink: 0,
  },
  iconTop: {
    marginTop: 2,
  },

  // --- Text input ---
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    minWidth: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    minHeight: 78,
    paddingTop: 0,
  },

  // --- Right icon button ---
  rightBtn: {
    padding: 4,
    marginLeft: 8,
    flexShrink: 0,
  },

  // --- Error text ---
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
  },
});
