import React, { memo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/src/components/bottomSheetBackdrop/types';
import {
  adminSurface,
  adminBorderDefault,
  adminTextPrimary,
  adminTextMuted,
  adminSuccess,
} from '@/constants/adminColors';
import AdminButton from './AdminButton';

interface ConfirmSheetProps {
  isOpen: boolean;
  landlordName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmSheet = ({ isOpen, landlordName, onConfirm, onCancel }: ConfirmSheetProps) => {
  const snapPoints = ['40%'];

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />
    ),
    [],
  );

  return (
    <BottomSheet
      index={isOpen ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(index) => { if (index === -1) onCancel(); }}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Approve {landlordName}?</Text>
        <Text style={styles.body}>
          This will mark them as verified and allow them to publish properties.
        </Text>

        <View style={styles.buttons}>
          <AdminButton
            label="Confirm Approval"
            onPress={onConfirm}
            variant="success"
            fullWidth
          />
          <View style={styles.spacer} />
          <AdminButton
            label="Cancel"
            onPress={onCancel}
            variant="ghost"
            fullWidth
          />
        </View>
      </BottomSheetView>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 20,
    color: adminTextPrimary,
    marginBottom: 10,
    includeFontPadding: false,
  },
  body: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 14,
    color: adminTextMuted,
    marginBottom: 24,
    lineHeight: 21,
    includeFontPadding: false,
  },
  buttons: {
    gap: 8,
  },
  spacer: {
    height: 4,
  },
});

export default memo(ConfirmSheet);
