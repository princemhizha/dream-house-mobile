import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../../constants/colors';
import { FontFamily, FontSize, LetterSpacing, LineHeight } from '../../../constants/typography';
import { Radius, Spacing } from '../../../constants/spacing';
import { useAuthStore } from '../../../store/useAuthStore';

const COMMON_REASONS = [
  'Photo was too blurry to read',
  'ID was partially cut off in frame',
  'Glare obscured important details',
  'Expired ID document submitted',
];

export default function RejectedScreen() {
  const router = useRouter();
  const rejectionReason = useAuthStore((s) => s.rejectionReason);
  const setVerificationStatus = useAuthStore((s) => s.setVerificationStatus);

  const handleResubmit = () => {
    setVerificationStatus('unverified', null);
    router.replace('/landlord/verification/scan-id');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="close-circle" size={56} color={Colors.error} />
        </View>

        <Text style={styles.title}>Verification Unsuccessful</Text>

        {rejectionReason ? (
          <View style={styles.reasonCard}>
            <Text style={styles.reasonLabel}>REASON:</Text>
            <Text style={styles.reasonText}>{rejectionReason}</Text>
          </View>
        ) : null}

        <View style={styles.commonCard}>
          <Text style={styles.commonTitle}>Common reasons for rejection:</Text>
          {COMMON_REASONS.map((reason) => (
            <View key={reason} style={styles.commonRow}>
              <Ionicons name="remove-circle-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.commonText}>{reason}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleResubmit}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Gradients.navyLight}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.primaryBtnText}>Resubmit My ID</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} activeOpacity={0.7} onPress={() => router.push('/help')}>
          <Text style={styles.ghostBtnText}>Contact Support</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    gap: Spacing.base,
  },
  iconWrap: {
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26 * LineHeight.tight,
  },
  reasonCard: {
    width: '100%',
    backgroundColor: 'rgba(220,38,38,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.20)',
    borderRadius: Radius.md,
    padding: Spacing.base,
    gap: Spacing.xs,
  },
  reasonLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.error,
    letterSpacing: LetterSpacing.label,
  },
  reasonText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textBody,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  commonCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  commonTitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  commonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  commonText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  primaryBtn: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  gradient: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  ghostBtn: {
    paddingVertical: Spacing.xs,
  },
  ghostBtnText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
});
