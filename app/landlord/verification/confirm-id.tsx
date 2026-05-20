import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../../constants/colors';
import { FontFamily, FontSize, LetterSpacing, LineHeight } from '../../../constants/typography';
import { Radius, Spacing } from '../../../constants/spacing';
import { useAuthStore } from '../../../store/useAuthStore';
import { IDPreviewCard } from '../../../components/verification/IDPreviewCard';

const CHECKLIST_ITEMS = [
  'All text on the ID is clearly readable',
  'The photo is not blurry or dark',
  'The full ID card is visible in the frame',
  'There is no glare covering text',
];

function ChecklistItem({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <TouchableOpacity
      onPress={() => {
        scale.value = withSpring(0.9, { damping: 12, stiffness: 400 }, () => {
          scale.value = withSpring(1, { damping: 12, stiffness: 400 });
        });
        onToggle();
      }}
      activeOpacity={1}
      style={styles.checkRow}
    >
      <Animated.View
        style={[
          styles.checkbox,
          checked && styles.checkboxChecked,
          animStyle,
        ]}
      >
        {checked && <Ionicons name="checkmark" size={14} color={Colors.white} />}
      </Animated.View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ConfirmIdScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const submitIDVerification = useAuthStore((s) => s.submitIDVerification);

  const [checked, setChecked] = useState([false, false, false, false]);
  const [submitting, setSubmitting] = useState(false);

  const allChecked = checked.every(Boolean);

  const toggleItem = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!imageUri) return;
    setSubmitting(true);
    try {
      await submitIDVerification(imageUri);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/landlord/verification/pending');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Your ID Photo</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {imageUri ? (
          <IDPreviewCard imageUri={imageUri} />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Ionicons name="image-outline" size={40} color={Colors.textDisabled} />
            <Text style={styles.noImageText}>No image captured</Text>
          </View>
        )}

        <View style={styles.checklistCard}>
          <Text style={styles.checklistLabel}>BEFORE YOU SUBMIT — CHECK:</Text>
          {CHECKLIST_ITEMS.map((item, i) => (
            <ChecklistItem
              key={item}
              label={item}
              checked={checked[i]}
              onToggle={() => toggleItem(i)}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.85}
          style={[styles.submitBtn, !allChecked && styles.submitBtnDim]}
          disabled={!allChecked || submitting}
        >
          <LinearGradient
            colors={Gradients.navyLight}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>Submit for Verification</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => router.replace('/landlord/verification/scan-id')}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={18} color={Colors.navy700} />
          <Text style={styles.retakeBtnText}>Retake Photo</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.base,
  },
  noImagePlaceholder: {
    height: 180,
    borderRadius: Radius.lg,
    backgroundColor: Colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  noImageText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textDisabled,
  },
  checklistCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  checklistLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize['2xs'],
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.label,
    marginBottom: Spacing.xs,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing['2xs'],
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.navy500,
    borderColor: Colors.navy500,
  },
  checkLabel: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textBody,
    lineHeight: FontSize.base * LineHeight.snug,
  },
  submitBtn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  submitBtnDim: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  submitBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.navy700,
    borderRadius: Radius.lg,
  },
  retakeBtnText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.navy700,
  },
});
