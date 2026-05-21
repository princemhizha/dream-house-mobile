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
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LineHeight } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { FormInput } from '../../components/ui/FormInput';

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
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setAuthError(null);
    try {
      await loginWithCredentials(data.email, data.password);
      setSubmitting(false);
      router.replace('/(tabs)');
    } catch (err: any) {
      setAuthError(err?.data?.detail || err?.message || 'Invalid email or password');
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your Dream House account.</Text>

          {authError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          <View style={styles.formWrap}>
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

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7} onPress={() => router.push('/help')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
            style={[styles.submitBtn, (!isValid || submitting) && styles.submitBtnDim]}
            disabled={submitting}
          >
            <View style={styles.submitBtnInner}>
              {submitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.submitBtnText}>Sign In</Text>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.signUpLink}>
            <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(onboarding)/sign-up')} activeOpacity={0.7}>
              <Text style={styles.signUpHighlight}>Sign Up Free</Text>
            </TouchableOpacity>
          </View>

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
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
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
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(220,38,38,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.20)',
    borderRadius: Radius.md,
    padding: Spacing.base,
  },
  errorBannerText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.error,
  },
  formWrap: {
    gap: Spacing.base,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.navy500,
  },
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
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
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
});
