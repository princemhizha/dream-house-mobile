import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';

export function VerificationBanner() {
  const router = useRouter();
  const status = useAuthStore((s) => s.verificationStatus);

  if (status === 'verified') return null;

  if (status === 'pending') {
    return (
      <View style={[styles.banner, styles.pendingBanner]}>
        <Ionicons name="time-outline" size={22} color={Colors.warning} style={styles.icon} />
        <Text style={styles.text} numberOfLines={2}>
          Your ID is under review. Listings will be available once approved.
        </Text>
      </View>
    );
  }

  const isRejected = status === 'rejected';

  return (
    <View style={[styles.banner, styles.errorBanner]}>
      <Ionicons name="warning-outline" size={22} color={Colors.error} style={styles.icon} />
      <Text style={styles.text} numberOfLines={2}>
        {isRejected
          ? 'Your verification was unsuccessful. Please resubmit.'
          : 'Verify your identity to start listing properties'}
      </Text>
      <TouchableOpacity
        style={styles.ctaBtn}
        onPress={() => router.push('/landlord/verification')}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaText}>{isRejected ? 'Resubmit ID' : 'Verify Now'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  errorBanner: {
    backgroundColor: 'rgba(220,38,38,0.08)',
    borderColor: 'rgba(220,38,38,0.25)',
  },
  pendingBanner: {
    backgroundColor: 'rgba(217,119,6,0.08)',
    borderColor: 'rgba(217,119,6,0.25)',
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    lineHeight: FontSize.sm * 1.5,
  },
  ctaBtn: {
    backgroundColor: Colors.navy700,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  ctaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
});
