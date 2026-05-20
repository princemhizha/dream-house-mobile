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
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../../constants/colors';
import { FontFamily, FontSize, LetterSpacing, LineHeight } from '../../../constants/typography';
import { Radius, Shadow, Spacing } from '../../../constants/spacing';
import { useAuthStore } from '../../../store/useAuthStore';
import { IDCaptureCard } from '../../../components/verification/IDCaptureCard';

export default function VerificationIndexScreen() {
  const router = useRouter();
  const verificationStatus = useAuthStore((s) => s.verificationStatus);
  const checkVerificationStatus = useAuthStore((s) => s.checkVerificationStatus);

  React.useEffect(() => {
    checkVerificationStatus().catch(() => null);
  }, [checkVerificationStatus]);

  React.useEffect(() => {
    if (verificationStatus === 'pending') {
      router.replace('/landlord/verification/pending');
    } else if (verificationStatus === 'rejected') {
      router.replace('/landlord/verification/rejected');
    }
  }, [verificationStatus, router]);

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      router.push({
        pathname: '/landlord/verification/confirm-id',
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  if (verificationStatus === 'verified') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.verifiedContainer}>
          <View style={styles.verifiedIconWrap}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          <Text style={styles.verifiedTitle}>Identity Verified</Text>
          <Text style={styles.verifiedSubtitle}>
            Your identity has been confirmed. You can now publish property listings.
          </Text>
          <TouchableOpacity
            style={styles.dashBtn}
            onPress={() => router.replace('/landlord/dashboard')}
            activeOpacity={0.85}
          >
            <Text style={styles.dashBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          To protect tenants and maintain platform trust, all landlords must verify their identity
          before listing properties.
        </Text>

        <IDCaptureCard />

        <View style={styles.privacyCard}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.navy500} />
          <Text style={styles.privacyText}>
            Your ID is encrypted, stored securely, and only seen by our verification team. It is
            never shared with tenants.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/landlord/verification/scan-id')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Gradients.navyLight}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="camera-outline" size={20} color={Colors.white} />
            <Text style={styles.primaryBtnText}>Scan My ID Now</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleGallery}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={18} color={Colors.navy700} />
          <Text style={styles.secondaryBtnText}>Upload from Gallery</Text>
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
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 28 * LineHeight.tight,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.navy50,
    borderWidth: 1,
    borderColor: Colors.borderNavy,
    borderRadius: Radius.md,
    padding: Spacing.base,
  },
  privacyText: {
    flex: 1,
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  primaryBtn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  primaryBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.navy700,
    borderRadius: Radius.lg,
  },
  secondaryBtnText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.navy700,
  },
  verifiedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.base,
  },
  verifiedIconWrap: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(15,158,82,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  verifiedSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  dashBtn: {
    marginTop: Spacing.base,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.navy700,
    borderRadius: Radius.lg,
  },
  dashBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});
