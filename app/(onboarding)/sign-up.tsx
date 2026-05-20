import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LineHeight } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { FormInput } from '../../components/ui/FormInput';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

// ─── Animated checkbox component ─────────────────────────────────────────────
function AnimatedCheckbox({
  checked,
  onToggle,
  error,
}: {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}) {
  const checkScale   = useSharedValue(checked ? 1 : 0);
  const boxScale     = useSharedValue(1);

  useEffect(() => {
    checkScale.value = checked
      ? withSpring(1, { damping: 10, stiffness: 320 })
      : withTiming(0, { duration: 130 });
    if (checked) {
      boxScale.value = withSpring(0.88, { damping: 8, stiffness: 400 });
      setTimeout(() => { boxScale.value = withSpring(1, { damping: 10, stiffness: 300 }); }, 120);
    }
  }, [checked]);

  const checkIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity:    checkScale.value,
  }));
  const boxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boxScale.value }],
  }));

  return (
    <>
      <Pressable
        style={styles.termsRow}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <Animated.View style={[styles.checkbox, checked && styles.checkboxActive, boxStyle]}>
          <Animated.View style={checkIconStyle}>
            <Ionicons name="checkmark" size={13} color={Colors.white} />
          </Animated.View>
        </Animated.View>
        <Text style={styles.termsText}>
          I agree to the{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Pressable>
      {error ? <Text style={styles.termsError}>{error}</Text> : null}
    </>
  );
}


export default function SignUpScreen() {
  const router = useRouter();
  const { login, setOnboardingComplete } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Entrance animations
  const headerOpacity = useSharedValue(0);
  const headerY       = useSharedValue(20);
  const formOpacity   = useSharedValue(0);
  const formY         = useSharedValue(24);

  useEffect(() => {
    const ease = Easing.out(Easing.cubic);
    headerOpacity.value = withTiming(1, { duration: 460, easing: ease });
    headerY.value       = withTiming(0, { duration: 460, easing: ease });
    formOpacity.value   = withDelay(160, withTiming(1, { duration: 500, easing: ease }));
    formY.value         = withDelay(160, withTiming(0, { duration: 500, easing: ease }));
  }, []);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity:   headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));
  const formAnimStyle = useAnimatedStyle(() => ({
    opacity:   formOpacity.value,
    transform: [{ translateY: formY.value }],
  }));

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    login(data.fullName, data.email);
    setOnboardingComplete();
    setSubmitting(false);
    router.replace('/(onboarding)/plans');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Subtle top bloom */}
      <LinearGradient
        colors={['rgba(15,106,61,0.05)', 'transparent']}
        style={styles.bgBloom}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.stepDot, i === 1 && styles.stepDotActive]}
              />
            ))}
            <Text style={styles.stepLabel}>Step 2 of 3</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <Animated.View style={[styles.titleBlock, headerAnimStyle]}>
            <Text style={styles.title}>Create Your Account</Text>
            <LinearGradient
              colors={Gradients.emerald}
              style={styles.titleUnderline}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <Text style={styles.subtitle}>Get started in under 60 seconds.</Text>
          </Animated.View>

          {/* ── Form fields ── */}
          <Animated.View style={[styles.fieldGroup, formAnimStyle]}>

            {/* Personal info section label */}
            <View style={styles.sectionLabel}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionText}>Personal Information</Text>
            </View>

            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Full Name"
                  icon="person-outline"
                  placeholder="Your full name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  onFocus={() => setFocusedField('fullName')}
                  focused={focusedField === 'fullName'}
                  error={errors.fullName?.message}
                  autoCapitalize="words"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Email Address"
                  icon="mail-outline"
                  placeholder="you@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  onFocus={() => setFocusedField('email')}
                  focused={focusedField === 'email'}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              rules={{ required: 'Phone is required', minLength: { value: 9, message: 'Enter a valid number' } }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Phone Number"
                  prefix="+263"
                  icon="call-outline"
                  placeholder="77 XXX XXXX"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  onFocus={() => setFocusedField('phone')}
                  focused={focusedField === 'phone'}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                />
              )}
            />

            {/* Security section label */}
            <View style={[styles.sectionLabel, { marginTop: Spacing.xs }]}>
              <View style={[styles.sectionDot, { backgroundColor: Colors.gold400 }]} />
              <Text style={styles.sectionText}>Security</Text>
            </View>

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                pattern: { value: /\d/, message: 'Must contain at least 1 number' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Password"
                  icon="lock-closed-outline"
                  rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
                  onRightPress={() => setShowPw((v) => !v)}
                  placeholder="Minimum 8 characters"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  onFocus={() => setFocusedField('password')}
                  focused={focusedField === 'password'}
                  error={errors.password?.message}
                  secureTextEntry={!showPw}
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Confirm Password"
                  icon="lock-closed-outline"
                  rightIcon={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  onRightPress={() => setShowConfirm((v) => !v)}
                  placeholder="Repeat your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => { onBlur(); setFocusedField(null); }}
                  onFocus={() => setFocusedField('confirm')}
                  focused={focusedField === 'confirm'}
                  error={errors.confirmPassword?.message}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
              )}
            />

            {/* ── Animated checkbox ── */}
            <Controller
              control={control}
              name="agreedToTerms"
              rules={{ validate: (v) => v === true || 'You must agree to the terms' }}
              render={({ field: { onChange, value } }) => (
                <AnimatedCheckbox
                  checked={!!value}
                  onToggle={() => onChange(!value)}
                  error={errors.agreedToTerms?.message}
                />
              )}
            />

            {/* ── Submit button ── */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.85}
              style={[styles.submitBtn, (!isValid || submitting) && styles.submitBtnDim]}
              disabled={submitting}
            >
              <View style={styles.submitBtnInner}>
                {submitting ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>Create My Account</Text>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={18}
                      color={Colors.white}
                      style={{ marginLeft: Spacing.xs }}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* ── Sign-in link ── */}
            <TouchableOpacity
              style={styles.signInLink}
              onPress={() => router.push('/(onboarding)/sign-in')}
              activeOpacity={0.7}
            >
              <Text style={styles.signInText}>Already have an account?{'  '}</Text>
              <Text style={styles.signInHighlight}>Sign In</Text>
            </TouchableOpacity>

          </Animated.View>

          <View style={{ height: Spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgBloom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },

  // Top bar
  topBar: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stepDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.borderDefault,
  },
  stepDotActive: {
    backgroundColor: Colors.primaryColor,
    width: 20,
  },
  stepLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.primaryColor,
    letterSpacing: 0.5,
    marginLeft: 4,
    textTransform: 'uppercase',
  },

  // Title
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.lg,
  },
  titleBlock: {
    gap: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 28,
    color: Colors.textPrimary,
    lineHeight: 28 * LineHeight.tight,
  },
  titleUnderline: {
    width: 52,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
  },
  subtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  // Fields
  fieldGroup: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingTop: Spacing.xs,
  },
  sectionDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primaryColor,
  },
  sectionText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Checkbox
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    cursor: 'pointer' as any,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
    backgroundColor: Colors.white,
  },
  checkboxActive: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  termsText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  termsLink: {
    color: Colors.primaryColor,
    fontFamily: FontFamily.bodyMedium,
  },
  termsError: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: -Spacing.xs,
  },

  // Submit
  submitBtn: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  submitBtnDim: {
    opacity: 0.50,
  },
  submitBtnInner: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },

  // Sign-in link
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  signInText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  signInHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primaryColor,
  },
});
