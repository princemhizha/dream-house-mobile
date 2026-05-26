import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { FormInput } from '../../components/ui/FormInput';
import { DHLogo } from '../../components/ui/DHLogo';

interface FormData {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const router = useRouter();
  const { loginWithCredentials, setOnboardingComplete } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(-16);
  const sheetOpacity = useSharedValue(0);
  const sheetY = useSharedValue(40);

  React.useEffect(() => {
    heroOpacity.value = withTiming(1, { duration: 500 });
    heroY.value = withSpring(0, { damping: 20, stiffness: 120 });
    sheetOpacity.value = withDelay(160, withTiming(1, { duration: 480 }));
    sheetY.value = withDelay(160, withSpring(0, { damping: 22, stiffness: 110 }));
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: sheetOpacity.value,
    transform: [{ translateY: sheetY.value }],
  }));

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await loginWithCredentials(data.email, data.password);
      setOnboardingComplete();
      setSubmitting(false);
      router.replace('/(tabs)');
    } catch (err: any) {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.topSafe} />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Green hero ── */}
        <View style={styles.hero}>
          <View style={styles.dec1} />
          <View style={styles.dec2} />
          <View style={styles.dec3} />

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>

          <Animated.View style={[styles.heroContent, heroStyle]}>
            <DHLogo variant="badge" theme="white" style={styles.logo} />
            <Text style={styles.heroTitle}>Dream House</Text>
            <Text style={styles.heroSub}>Find your perfect home</Text>
          </Animated.View>
        </View>

        {/* ── White form sheet ── */}
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.pill} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your Dream House account.</Text>
            </View>

            <View style={styles.formWrap}>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email',
                  },
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
                name="password"
                rules={{ required: 'Password is required' }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Password"
                    icon="lock-closed-outline"
                    rightIcon={showPw ? 'eye-off-outline' : 'eye-outline'}
                    onRightPress={() => setShowPw((v) => !v)}
                    placeholder="Your password"
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

              <TouchableOpacity
                style={styles.forgotBtn}
                activeOpacity={0.7}
                onPress={() => router.push('/help')}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.88}
              style={[styles.submitBtn, (!isValid || submitting) && styles.submitBtnDim]}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(onboarding)/sign-up')}
                activeOpacity={0.7}
              >
                <Text style={styles.signUpHighlight}>Sign Up Free</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/admin/sign-in' as any)}
              activeOpacity={0.5}
              style={styles.adminLink}
            >
              <Text style={styles.adminLinkText}>Admin</Text>
            </TouchableOpacity>

            <View style={{ height: 36 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      <SafeAreaView edges={['bottom']} style={styles.bottomSafe} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topSafe: { backgroundColor: Colors.primaryColor },
  bottomSafe: { backgroundColor: Colors.background },
  kav: { flex: 1, backgroundColor: Colors.background },

  // ── Hero ──────────────────────────────────────────────────────────────────
  hero: {
    backgroundColor: Colors.primaryColor,
    paddingTop: 12,
    paddingBottom: 54,
    paddingHorizontal: Spacing.base,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    paddingTop: 14,
  },
  logo: { marginBottom: 16 },
  heroTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  heroSub: {
    fontFamily: FontFamily.bodyLight,
    fontSize: 14,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 6,
    includeFontPadding: false,
  },
  dec1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -55,
    right: -50,
  },
  dec2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -30,
  },
  dec3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: 30,
    left: '50%',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Form sheet ─────────────────────────────────────────────────────────────
  sheet: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -26,
    overflow: 'hidden',
  },
  pill: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderDefault,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: 22,
    gap: 18,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 26,
    color: Colors.textPrimary,
    includeFontPadding: false,
  },
  subtitle: {
    fontFamily: FontFamily.bodyLight,
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
    includeFontPadding: false,
  },
  formWrap: { gap: Spacing.base },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.navy500,
  },
  submitBtn: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Radius.lg,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  submitBtnDim: { opacity: 0.52 },
  submitBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 16,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  signUpHighlight: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.navy500,
  },
  adminLink: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  adminLinkText: {
    fontFamily: FontFamily.body,
    fontSize: 11,
    color: Colors.textDisabled,
    letterSpacing: 0.5,
  },
});
