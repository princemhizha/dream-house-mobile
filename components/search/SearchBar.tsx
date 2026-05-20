import React, { useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
  style?: ViewStyle;
  editable?: boolean;
  showFilterButton?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  onFocus,
  onFilterPress,
  placeholder = 'Search suburb, city, or type...',
  style,
  editable = true,
  showFilterButton = true,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);
  const handleFilterPress = onFilterPress ?? (() => null);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrap}>
        <Ionicons name="search-outline" size={17} color={Colors.primaryColor} style={styles.icon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          editable={editable}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {showFilterButton && (
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPress} activeOpacity={0.8}>
          <Ionicons name="options-outline" size={20} color={Colors.primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 2,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.transparent,
    borderWidth: 0,
    paddingVertical: 0,
    minWidth: 0,
    height: '100%',
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
