import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminTextPrimary, adminTextMuted } from '@/constants/adminColors';

interface AdminEmptyStateProps {
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle: string;
}

const AdminEmptyState = ({
  icon = 'folder-open-outline',
  iconColor = adminTextMuted,
  title,
  subtitle,
}: AdminEmptyStateProps) => (
  <View style={styles.container}>
    <Ionicons name={icon as any} size={48} color={iconColor} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
    color: adminTextPrimary,
    marginTop: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 13,
    color: adminTextMuted,
    marginTop: 6,
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default memo(AdminEmptyState);
