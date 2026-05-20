import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { GuestPromptType } from '../../hooks/useGuestGuard';

interface Props {
  visible: boolean;
  type: GuestPromptType;
  onClose: () => void;
}

const CONTENT: Record<GuestPromptType, { icon: keyof typeof Ionicons.glyphMap; iconColor: string; title: string; subtitle: string }> = {
  save: {
    icon: 'heart',
    iconColor: Colors.navy500,
    title: 'Create a free account to save properties',
    subtitle: 'Sign up in under 60 seconds.',
  },
  contact: {
    icon: 'lock-closed',
    iconColor: Colors.gold400,
    title: 'Sign up to unlock contact details',
    subtitle: 'Join Dream House to contact landlords directly.',
  },
  premium: {
    icon: 'star',
    iconColor: Colors.gold400,
    title: 'Create an account to access premium listings',
    subtitle: 'Sign up for free and explore all listings.',
  },
};

export function GuestSignUpModal({ visible, type, onClose }: Props) {
  const router = useRouter();
  const content = CONTENT[type];

  const handleSignUp = () => {
    onClose();
    router.push('/(onboarding)/sign-up');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <View style={styles.iconWrap}>
                <Ionicons name={content.icon} size={32} color={content.iconColor} />
              </View>
              <Text style={styles.title}>{content.title}</Text>
              <Text style={styles.subtitle}>{content.subtitle}</Text>
              <TouchableOpacity onPress={handleSignUp} activeOpacity={0.85} style={styles.signUpBtn}>
                <LinearGradient colors={Gradients.navyLight} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Text style={styles.signUpBtnText}>Sign Up Free</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.laterBtn}>
                <Text style={styles.laterText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
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
    alignItems: 'center',
    gap: Spacing.base,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.borderDefault,
    marginBottom: Spacing.xs,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.navy50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: FontSize.xl * 1.3,
  },
  subtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  signUpBtn: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  gradient: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  signUpBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  laterBtn: {
    paddingVertical: Spacing.xs,
  },
  laterText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
});
