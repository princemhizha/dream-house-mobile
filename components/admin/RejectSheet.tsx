import React, { memo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types';
import {
  adminSurface,
  adminBorderDefault,
  adminBorderSubtle,
  adminTextPrimary,
  adminTextMuted,
  adminDanger,
  adminSurfaceHigh,
  adminBorderStrong,
} from '@/constants/adminColors';
import AdminButton from './AdminButton';
import AdminInput from './AdminInput';

const QUICK_REASONS = [
  'Photo too blurry',
  'ID partially cut off',
  'Glare on ID',
  'ID appears expired',
  'Name mismatch',
  'ID appears altered',
];

const MAX_CHARS = 300;

interface RejectSheetProps {
  isOpen: boolean;
  onReject: (reason: string) => void;
  onCancel: () => void;
}

const RejectSheet = ({ isOpen, onReject, onCancel }: RejectSheetProps) => {
  const [reason, setReason] = useState('');
  const snapPoints = ['72%'];

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />
    ),
    [],
  );

  const handleReject = () => {
    if (reason.trim().length > 0) {
      onReject(reason.trim());
      setReason('');
    }
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  return (
    <BottomSheet
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(index) => { if (index === -1) handleCancel(); }}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      keyboardBehavior="extend"
    >
      <BottomSheetScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Submit Rejection</Text>
        <Text style={styles.subtitle}>
          Select a reason or write a custom note below.
        </Text>

        {/* Quick reason chips */}
        <View style={styles.chipsWrap}>
          {QUICK_REASONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.chip,
                reason === r && styles.chipActive,
              ]}
              onPress={() => setReason(r)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.chipText, reason === r && styles.chipTextActive]}
              >
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom reason input */}
        <View style={styles.inputWrap}>
          <AdminInput
            label="Rejection Reason"
            placeholder="Describe why this submission is being rejected..."
            value={reason}
            onChangeText={(t) => setReason(t.substring(0, MAX_CHARS))}
            multiline
            numberOfLines={4}
            maxLength={MAX_CHARS}
          />
          <Text style={styles.charCount}>
            {reason.length} / {MAX_CHARS}
          </Text>
        </View>

        <View style={styles.buttons}>
          <AdminButton
            label="Submit Rejection"
            onPress={handleReject}
            variant="danger"
            disabled={reason.trim().length === 0}
            fullWidth
          />
          <View style={styles.spacer} />
          <AdminButton
            label="Cancel"
            onPress={handleCancel}
            variant="ghost"
            fullWidth
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: adminSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: adminBorderDefault,
  },
  handle: {
    backgroundColor: adminBorderDefault,
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 20,
    color: adminTextPrimary,
    marginBottom: 6,
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 13,
    color: adminTextMuted,
    marginBottom: 20,
    includeFontPadding: false,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: adminBorderSubtle,
    backgroundColor: adminSurfaceHigh,
  },
  chipActive: {
    borderColor: adminDanger,
    backgroundColor: 'rgba(255,68,68,0.10)',
  },
  chipText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: adminTextMuted,
    includeFontPadding: false,
  },
  chipTextActive: {
    color: adminDanger,
  },
  inputWrap: {
    marginBottom: 20,
  },
  charCount: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    textAlign: 'right',
    marginTop: 4,
    includeFontPadding: false,
  },
  buttons: {
    gap: 8,
  },
  spacer: {
    height: 4,
  },
});

export default memo(RejectSheet);
