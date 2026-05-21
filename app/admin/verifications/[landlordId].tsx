import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize, LetterSpacing, LineHeight } from '../../../constants/typography';
import { Radius, Shadow, Spacing } from '../../../constants/spacing';
import { approveVerification, getVerificationRecord, rejectVerification } from '../../../services/adminService';
import { VerificationRecord } from '../../../types';
import { useAuthStore } from '../../../store/useAuthStore';
import { FormInput } from '../../../components/ui/FormInput';

const CHECKLIST_ITEMS = [
  'ID photo is clear and readable',
  'Name on ID matches registration name',
  'ID is not expired',
  'ID appears genuine, not altered',
  'Face photo is visible on ID',
];

const QUICK_REASONS = [
  'Photo too blurry',
  'ID partially cut off',
  'Glare on ID',
  'ID appears expired',
  'Name mismatch',
];

export default function AdminReviewScreen() {
  const router = useRouter();
  const { landlordId } = useLocalSearchParams<{ landlordId: string }>();
  const adminId = useAuthStore((s) => s.userId) ?? 'admin';

  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [showApproveSheet, setShowApproveSheet] = useState(false);
  const [showRejectSheet, setShowRejectSheet] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(false);

  // Pinch-to-zoom
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(5, Math.max(1, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      }
    });
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else {
        scale.value = withSpring(2.5);
        savedScale.value = 2.5;
      }
    });
  const composed = Gesture.Simultaneous(pinch, doubleTap);
  const imageStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    if (!landlordId) return;
    getVerificationRecord(landlordId)
      .then(setRecord)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [landlordId]);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await approveVerification(landlordId!);
      setShowApproveSheet(false);
      router.back();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    try {
      await rejectVerification(landlordId!, rejectReason.trim());
      setShowRejectSheet(false);
      router.back();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator color={Colors.navy500} size="large" />
      </View>
    );
  }

  if (!record) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.centerLoading}>
          <Text style={styles.notFoundText}>Verification record not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go Back</Text>
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
        <Text style={styles.headerTitle}>Review Submission</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Landlord info card */}
        <View style={styles.infoCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{record.landlordId.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.landlordName}>{record.landlordId}</Text>
            <Text style={styles.infoDetail}>Submitted: {new Date(record.submittedAt).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* ID Image */}
        <View style={styles.imageSection}>
          <GestureDetector gesture={composed}>
            <Animated.View style={[styles.imageWrap, imageStyle]}>
              <Image
                source={{ uri: record.idImageUrl }}
                style={styles.idImage}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
          <Text style={styles.zoomHint}>Pinch to zoom</Text>
          <TouchableOpacity
            style={styles.fullscreenBtn}
            onPress={() => setFullscreenImage(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="expand-outline" size={16} color={Colors.navy700} />
            <Text style={styles.fullscreenBtnText}>View Full Screen</Text>
          </TouchableOpacity>
        </View>

        {/* Admin checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistLabel}>VERIFICATION CHECKLIST</Text>
          {CHECKLIST_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item}
              style={styles.checkRow}
              onPress={() => {
                const next = [...checklist];
                next[i] = !next[i];
                setChecklist(next);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, checklist[i] && styles.checkboxChecked]}>
                {checklist[i] && <Ionicons name="checkmark" size={14} color={Colors.white} />}
              </View>
              <Text style={styles.checkItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Decision buttons */}
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => setShowApproveSheet(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color={Colors.white} />
          <Text style={styles.approveBtnText}>APPROVE LANDLORD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => setShowRejectSheet(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="close-circle" size={22} color={Colors.error} />
          <Text style={styles.rejectBtnText}>REJECT SUBMISSION</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      {/* Fullscreen image modal */}
      <Modal visible={fullscreenImage} transparent animationType="fade" onRequestClose={() => setFullscreenImage(false)}>
        <View style={styles.fsOverlay}>
          <TouchableOpacity style={styles.fsClose} onPress={() => setFullscreenImage(false)}>
            <Ionicons name="close" size={26} color={Colors.white} />
          </TouchableOpacity>
          <Image source={{ uri: record.idImageUrl }} style={styles.fsImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* Approve confirmation sheet */}
      <Modal visible={showApproveSheet} transparent animationType="slide" onRequestClose={() => setShowApproveSheet(false)}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Approve this landlord?</Text>
            <Text style={styles.sheetBody}>
              They will be notified and can immediately start listing properties.
            </Text>
            <TouchableOpacity
              style={styles.confirmApproveBtn}
              onPress={handleApprove}
              disabled={processing}
              activeOpacity={0.85}
            >
              {processing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.confirmApproveBtnText}>Confirm Approval</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowApproveSheet(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reject sheet */}
      <Modal visible={showRejectSheet} transparent animationType="slide" onRequestClose={() => setShowRejectSheet(false)}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Reason for Rejection</Text>
            <View style={styles.quickChips}>
              {QUICK_REASONS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, rejectReason === r && styles.chipActive]}
                  onPress={() => setRejectReason(r)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, rejectReason === r && styles.chipTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <FormInput
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Explain why the ID was rejected so the landlord can correct it..."
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[styles.confirmRejectBtn, !rejectReason.trim() && { opacity: 0.4 }]}
              onPress={handleReject}
              disabled={processing || !rejectReason.trim()}
              activeOpacity={0.85}
            >
              {processing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.confirmRejectBtnText}>Submit Rejection</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowRejectSheet(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  notFoundText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  backLink: {
    paddingVertical: Spacing.xs,
  },
  backLinkText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.navy500,
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
    ...Shadow.xs,
  },
  headerTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  content: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.navy700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  infoRight: {
    flex: 1,
    gap: 2,
  },
  landlordName: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  infoDetail: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  imageSection: {
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  imageWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.md,
  },
  idImage: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: Radius.lg,
    backgroundColor: Colors.mist,
  },
  zoomHint: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  fullscreenBtnText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.navy700,
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
  checkItemText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textBody,
    lineHeight: FontSize.base * LineHeight.snug,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
  },
  approveBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
    letterSpacing: LetterSpacing.wider,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  rejectBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.error,
    letterSpacing: LetterSpacing.wider,
  },
  // Modals
  sheetOverlay: {
    flex: 1,
    backgroundColor: Colors.scrimMedium,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.base,
  },
  sheetTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  sheetBody: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.mist,
  },
  chipActive: {
    backgroundColor: Colors.navy700,
  },
  chipText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  chipTextActive: {
    color: Colors.white,
  },
  reasonInput: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.base,
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    minHeight: 100,
    borderCurve: 'continuous',
  },
  confirmApproveBtn: {
    backgroundColor: Colors.success,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  confirmApproveBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  confirmRejectBtn: {
    backgroundColor: Colors.error,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  confirmRejectBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  cancelBtn: {
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  // Fullscreen
  fsOverlay: {
    flex: 1,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fsClose: {
    position: 'absolute',
    top: 56,
    right: Spacing.base,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(7,20,40,0.70)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fsImage: {
    width: '100%',
    height: '70%',
  },
});
