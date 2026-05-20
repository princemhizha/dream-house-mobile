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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LineHeight } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/spacing';
import { useAuthStore } from '../../store/useAuthStore';
import { FormInput } from '../../components/ui/FormInput';

type AccountType = 'individual' | 'agency';

interface Step1Data {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface Step2Data {
  accountType: AccountType;
  nationalId: string;
  physicalAddress: string;
  agencyName: string;
  regNumber: string;
  officeAddress: string;
  propertiesManaged: string;
}

interface Step3Data {
  package: 'basic' | 'professional';
  agreedToTerms: boolean;
}

const STEP_LABELS = ['Personal Info', 'Business Info', 'Listing Package'];

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={si.row}>
      {STEP_LABELS.map((label, i) => (
        <View key={label} style={si.step}>
          <View style={[si.dot, i < current && si.dotDone, i === current && si.dotCurrent]}>
            {i < current ? (
              <Ionicons name="checkmark" size={12} color={Colors.white} />
            ) : (
              <Text style={[si.dotText, i === current && si.dotTextActive]}>{i + 1}</Text>
            )}
          </View>
          <Text style={[si.label, i === current && si.labelActive]}>{label}</Text>
          {i < STEP_LABELS.length - 1 && <View style={[si.connector, i < current && si.connectorDone]} />}
        </View>
      ))}
    </View>
  );
}

const si = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
    gap: 0,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: Colors.navy700,
    borderColor: Colors.navy700,
  },
  dotCurrent: {
    backgroundColor: Colors.navy500,
    borderColor: Colors.navy500,
  },
  dotText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  dotTextActive: { color: Colors.white },
  label: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  labelActive: {
    color: Colors.navy500,
    fontFamily: FontFamily.bodyMedium,
  },
  connector: {
    position: 'absolute',
    top: 13,
    left: '75%',
    right: '-25%',
    height: 2,
    backgroundColor: Colors.borderDefault,
  },
  connectorDone: {
    backgroundColor: Colors.navy700,
  },
});



export default function LandlordSignupScreen() {
  const router = useRouter();
  const { login, setRole, setOnboardingComplete } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'professional'>('basic');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const contentOpacity = useSharedValue(1);
  const contentAnim = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  const step1 = useForm<Step1Data>({
    mode: 'onChange',
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });
  const step2 = useForm<Step2Data>({
    mode: 'onChange',
    defaultValues: {
      accountType: 'individual',
      nationalId: '',
      physicalAddress: '',
      agencyName: '',
      regNumber: '',
      officeAddress: '',
      propertiesManaged: '',
    },
  });

  const transitionStep = (next: number) => {
    contentOpacity.value = withTiming(0, { duration: 150 }, () => {
      contentOpacity.value = withTiming(1, { duration: 200 });
    });
    setTimeout(() => setCurrentStep(next), 150);
  };

  const goNext = async () => {
    if (currentStep === 0) {
      const valid = await step1.trigger();
      if (!valid) return;
      transitionStep(1);
    } else if (currentStep === 1) {
      transitionStep(2);
    } else {
      if (!agreedToTerms) return;
      setSubmitting(true);
      const data = step1.getValues();
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      login(data.fullName, data.email);
      setRole('landlord');
      setOnboardingComplete();
      setSubmitting(false);
      router.replace('/landlord/verification');
    }
  };

  const password = step1.watch('password');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => currentStep > 0 ? transitionStep(currentStep - 1) : router.back()}
            style={styles.backBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Landlord Account</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.stepIndicatorWrap}>
          <StepIndicator current={currentStep} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[{ gap: Spacing.base }, contentAnim]}>
            {currentStep === 0 && (
              <>
                <Text style={styles.stepTitle}>Personal Information</Text>

                <Controller
                  control={step1.control}
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
                      error={step1.formState.errors.fullName?.message}
                      autoCapitalize="words"
                    />
                  )}
                />
                <Controller
                  control={step1.control}
                  name="email"
                  rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Valid email required' } }}
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
                      error={step1.formState.errors.email?.message}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                <Controller
                  control={step1.control}
                  name="phone"
                  rules={{ required: 'Phone is required', minLength: { value: 9, message: 'Enter a valid number' } }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      label="Phone Number (+263)"
                      icon="call-outline"
                      placeholder="77 XXX XXXX"
                      value={value}
                      onChangeText={onChange}
                      onBlur={() => { onBlur(); setFocusedField(null); }}
                      onFocus={() => setFocusedField('phone')}
                      focused={focusedField === 'phone'}
                      error={step1.formState.errors.phone?.message}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <Controller
                  control={step1.control}
                  name="password"
                  rules={{ required: 'Password required', minLength: { value: 8, message: 'At least 8 characters' }, pattern: { value: /\d/, message: 'Must contain 1 number' } }}
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
                      error={step1.formState.errors.password?.message}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                    />
                  )}
                />
                <Controller
                  control={step1.control}
                  name="confirmPassword"
                  rules={{ required: 'Confirm your password', validate: (v) => v === password || 'Passwords do not match' }}
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
                      error={step1.formState.errors.confirmPassword?.message}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                    />
                  )}
                />
              </>
            )}

            {currentStep === 1 && (
              <>
                <Text style={styles.stepTitle}>Business Information</Text>

                <View style={styles.toggleWrap}>
                  {(['individual', 'agency'] as AccountType[]).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.togglePill, accountType === type && styles.togglePillActive]}
                      onPress={() => setAccountType(type)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.toggleText, accountType === type && styles.toggleTextActive]}>
                        {type === 'individual' ? 'Individual Landlord' : 'Property Agency'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {accountType === 'individual' ? (
                  <>
                    <Controller
                      control={step2.control}
                      name="nationalId"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="National ID Number"
                          icon="card-outline"
                          placeholder="e.g. 63-123456A78"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('nationalId')}
                          focused={focusedField === 'nationalId'}
                          autoCapitalize="characters"
                        />
                      )}
                    />
                    <Controller
                      control={step2.control}
                      name="physicalAddress"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="Physical Address"
                          icon="location-outline"
                          placeholder="Your home address"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('address')}
                          focused={focusedField === 'address'}
                        />
                      )}
                    />
                  </>
                ) : (
                  <>
                    <Controller
                      control={step2.control}
                      name="agencyName"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="Agency / Company Name"
                          icon="business-outline"
                          placeholder="e.g. Prime Realty Ltd"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('agencyName')}
                          focused={focusedField === 'agencyName'}
                        />
                      )}
                    />
                    <Controller
                      control={step2.control}
                      name="regNumber"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="Company Registration Number"
                          icon="document-text-outline"
                          placeholder="e.g. 123/2020"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('regNumber')}
                          focused={focusedField === 'regNumber'}
                        />
                      )}
                    />
                    <Controller
                      control={step2.control}
                      name="officeAddress"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="Physical Office Address"
                          icon="location-outline"
                          placeholder="Office street address"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('officeAddress')}
                          focused={focusedField === 'officeAddress'}
                        />
                      )}
                    />
                    <Controller
                      control={step2.control}
                      name="propertiesManaged"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormInput
                          label="Number of Properties Managed"
                          icon="home-outline"
                          placeholder="e.g. 20"
                          value={value}
                          onChangeText={onChange}
                          onBlur={() => { onBlur(); setFocusedField(null); }}
                          onFocus={() => setFocusedField('props')}
                          focused={focusedField === 'props'}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <Text style={styles.stepTitle}>Choose a Listing Package</Text>

                {(['basic', 'professional'] as const).map((pkg) => (
                  <TouchableOpacity
                    key={pkg}
                    style={[styles.packageCard, selectedPackage === pkg && styles.packageCardSelected]}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.packageHeader}>
                      <Text style={styles.packageName}>
                        {pkg === 'basic' ? 'Basic' : 'Professional'}
                      </Text>
                      <Text style={styles.packagePrice}>
                        {pkg === 'basic' ? '$5 / listing / month' : '$10 / listing / month'}
                      </Text>
                    </View>
                    <View style={styles.packageFeatures}>
                      {(pkg === 'basic'
                        ? ['Up to 5 active listings', 'Standard search placement', 'Analytics dashboard']
                        : ['Unlimited listings', 'Featured placement rotation', 'Priority support', 'Boosting credits included']
                      ).map((f) => (
                        <View key={f} style={styles.packageFeatureRow}>
                          <Ionicons name="checkmark" size={13} color={selectedPackage === pkg ? Colors.navy500 : Colors.ash} />
                          <Text style={[styles.packageFeatureText, selectedPackage === pkg && styles.packageFeatureTextActive]}>{f}</Text>
                        </View>
                      ))}
                    </View>
                    {selectedPackage === pkg && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.navy500} />
                        <Text style={styles.selectedBadgeText}>Selected</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setAgreedToTerms((v) => !v)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                    {agreedToTerms && <Ionicons name="checkmark" size={13} color={Colors.white} />}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={goNext}
            activeOpacity={0.85}
            disabled={submitting}
            style={[
              styles.nextBtnWrap,
              currentStep === 2 && !agreedToTerms && styles.nextBtnDim,
            ]}
          >
            <LinearGradient
              colors={Gradients.navyLight}
              style={styles.nextGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.nextBtnText}>
                  {currentStep < 2 ? 'Continue' : 'Create Landlord Account'}
                </Text>
              )}
              {currentStep < 2 && !submitting && (
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  stepIndicatorWrap: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.sm,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  stepTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    marginBottom: Spacing.xs,
  },
  toggleWrap: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    backgroundColor: Colors.mist,
    padding: 3,
    gap: 3,
  },
  togglePill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  togglePillActive: {
    backgroundColor: Colors.navy700,
  },
  toggleText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  packageCard: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  packageCardSelected: {
    borderColor: Colors.navy500,
    backgroundColor: Colors.navy50,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageName: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
  },
  packagePrice: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.navy700,
  },
  packageFeatures: {
    gap: Spacing.xs,
  },
  packageFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  packageFeatureText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  packageFeatureTextActive: {
    color: Colors.textBody,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['2xs'],
    alignSelf: 'flex-end',
  },
  selectedBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.xs,
    color: Colors.navy500,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
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
  },
  checkboxActive: {
    backgroundColor: Colors.navy500,
    borderColor: Colors.navy500,
  },
  termsText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  termsLink: {
    color: Colors.navy500,
    fontFamily: FontFamily.bodyMedium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  nextBtnWrap: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  nextBtnDim: {
    opacity: 0.55,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  nextBtnText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});
