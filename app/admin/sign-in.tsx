import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import {
  adminBase,
  adminSurface,
  adminBorderDefault,
  adminBorderStrong,
  adminBorderGlow,
  adminBlue300,
  adminBlue400,
  adminTextPrimary,
  adminTextMuted,
  adminDanger,
  adminGlowBlue,
  adminGlowCyan,
} from '@/constants/adminColors';
import { adminShadows } from '@/constants/adminShadows';
import { adminSprings } from '@/constants/adminAnimations';
import { useAdminStore } from '@/store/useAdminStore';
import AdminButton from '@/components/admin/AdminButton';
import AdminInput from '@/components/admin/AdminInput';
import DotGridBackground from '@/components/admin/DotGridBackground';

const { width: SCREEN_W } = Dimensions.get('window');

const BRACKET = 16;
const BTHICK  = 1.5;
const BCOL    = adminBorderGlow;

export default function AdminSignInScreen() {
  const router      = useRouter();
  const insets      = useSafeAreaInsets();
  const adminLogin  = useAdminStore((s) => s.adminLogin);
  const isAdminLoggedIn = useAdminStore((s) => s.isAdminLoggedIn);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  // ── Shared values ──────────────────────────────────────────────────────────
  const contentOpacity  = useSharedValue(0);
  const contentY        = useSharedValue(28);
  const shakeX          = useSharedValue(0);
  const errorOpacity    = useSharedValue(0);
  const ringScale       = useSharedValue(1);
  const ringOpacity     = useSharedValue(0.4);
  const orbOpacity      = useSharedValue(0.3);

  useEffect(() => {
    if (isAdminLoggedIn) router.replace('/admin' as any);
  }, [isAdminLoggedIn]);

  useEffect(() => {
    // Entrance
    contentOpacity.value = withDelay(180, withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }));
    contentY.value       = withDelay(180, withSpring(0, adminSprings.smooth));

    // Pulsing glow ring
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1, false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.75, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2,  { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ), -1, false,
    );

    // Background orbs breathe slowly
    orbOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
      ), -1, false,
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity:   contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const errorStyle = useAnimatedStyle(() => ({
    opacity:   errorOpacity.value,
    transform: [{ translateY: interpolate(errorOpacity.value, [0, 1], [-6, 0]) }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity:   ringOpacity.value,
  }));

  const orbStyle = useAnimatedStyle(() => ({ opacity: orbOpacity.value }));

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(12,  { duration: 55 }),
      withTiming(-12, { duration: 55 }),
      withTiming(7,   { duration: 55 }),
      withTiming(-7,  { duration: 55 }),
      withTiming(0,   { duration: 55 }),
    );
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setIsLoading(true);
    setShowError(false);
    errorOpacity.value = 0;

    const success = await adminLogin(email.trim(), password);
    if (success) {
      router.replace('/admin' as any);
    } else {
      setShowError(true);
      errorOpacity.value = withTiming(1, { duration: 250 });
      shake();
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <DotGridBackground />

      {/* Ambient orbs */}
      <Animated.View style={[styles.orbTR, orbStyle]} />
      <Animated.View style={[styles.orbBL, orbStyle]} />
      <View style={styles.orbCenter} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: Math.max(insets.top + 28, 48), paddingBottom: insets.bottom + 36 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.inner, contentStyle]}>

            {/* ── Brand ── */}
            <View style={styles.brandWrap}>
              <Animated.View style={[styles.glowRing, ringStyle]} />
              <View style={styles.shieldBox}>
                <Ionicons name="shield-checkmark-outline" size={34} color={adminBlue300} />
              </View>
            </View>

            <Text style={styles.appName}>Dream House</Text>
            <Text style={styles.sysLabel}>SYSTEM ADMINISTRATION</Text>

            {/* Separator */}
            <View style={styles.sep}>
              <View style={styles.sepLine} />
              <View style={styles.sepDot} />
              <View style={styles.sepLine} />
            </View>

            {/* ── Card ── */}
            <Animated.View style={[styles.card, shakeStyle]}>
              {/* Corner brackets */}
              <View style={[styles.bk, styles.bkTL]} />
              <View style={[styles.bk, styles.bkTR]} />
              <View style={[styles.bk, styles.bkBL]} />
              <View style={[styles.bk, styles.bkBR]} />

              <Text style={styles.cardLabel}>ADMINISTRATOR ACCESS</Text>

              <AdminInput
                label="Email Address"
                placeholder="admin@dreamhouse.co.zw"
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.gap} />

              <AdminInput
                label="Password"
                placeholder="Enter password"
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {showError && (
                <Animated.View style={[styles.errorCard, errorStyle]}>
                  <Ionicons name="alert-circle" size={15} color={adminDanger} />
                  <Text style={styles.errorText}>Invalid credentials — access denied.</Text>
                </Animated.View>
              )}

              <View style={styles.btnWrap}>
                <AdminButton
                  label="Sign In to Admin Panel"
                  icon="arrow-forward"
                  iconSide="right"
                  onPress={handleLogin}
                  variant="primary"
                  isLoading={isLoading}
                  fullWidth
                />
              </View>
            </Animated.View>

            {/* Hint */}
            <View style={styles.hint}>
              <Ionicons name="lock-closed-outline" size={11} color={adminTextMuted} />
              <Text style={styles.hintText}>  Restricted area — authorized personnel only</Text>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: adminBase },
  kav:       { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },

  // ── Ambient orbs ────────────────────────────────────────────────────────────
  orbTR: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: adminGlowBlue,
    top: -90,
    right: -90,
  },
  orbBL: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: adminGlowCyan,
    bottom: -70,
    left: -70,
  },
  orbCenter: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(45,99,212,0.06)',
    top: '35%',
    alignSelf: 'center',
  },

  // ── Brand ───────────────────────────────────────────────────────────────────
  brandWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: adminBlue400,
    backgroundColor: 'rgba(45,99,212,0.08)',
  },
  shieldBox: {
    width: 74,
    height: 74,
    backgroundColor: adminSurface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: adminBorderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    ...(adminShadows.cardGlow as object),
  },
  appName: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 32,
    color: adminTextPrimary,
    marginTop: 20,
    letterSpacing: -0.6,
    textAlign: 'center',
    includeFontPadding: false,
  },
  sysLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: adminTextMuted,
    textTransform: 'uppercase',
    letterSpacing: 4.5,
    marginTop: 6,
    textAlign: 'center',
    includeFontPadding: false,
  },

  // ── Separator ───────────────────────────────────────────────────────────────
  sep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 26,
    width: '55%',
  },
  sepLine: {
    flex: 1,
    height: 1,
    backgroundColor: adminBorderDefault,
  },
  sepDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: adminBlue400,
  },

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: adminSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: adminBorderDefault,
    padding: 26,
    alignSelf: 'stretch',
    position: 'relative',
    ...(adminShadows.deepCard as object),
  },
  cardLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: adminBlue300,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 22,
    includeFontPadding: false,
  },
  gap:    { height: 14 },
  btnWrap: { marginTop: 24 },

  // ── Corner brackets ─────────────────────────────────────────────────────────
  bk: { position: 'absolute', width: BRACKET, height: BRACKET },
  bkTL: {
    top: 4, left: 4,
    borderTopWidth: BTHICK, borderLeftWidth: BTHICK,
    borderTopLeftRadius: 6, borderColor: BCOL,
  },
  bkTR: {
    top: 4, right: 4,
    borderTopWidth: BTHICK, borderRightWidth: BTHICK,
    borderTopRightRadius: 6, borderColor: BCOL,
  },
  bkBL: {
    bottom: 4, left: 4,
    borderBottomWidth: BTHICK, borderLeftWidth: BTHICK,
    borderBottomLeftRadius: 6, borderColor: BCOL,
  },
  bkBR: {
    bottom: 4, right: 4,
    borderBottomWidth: BTHICK, borderRightWidth: BTHICK,
    borderBottomRightRadius: 6, borderColor: BCOL,
  },

  // ── Error ───────────────────────────────────────────────────────────────────
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.22)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  errorText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: adminDanger,
    includeFontPadding: false,
  },

  // ── Hint ────────────────────────────────────────────────────────────────────
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    opacity: 0.65,
  },
  hintText: {
    fontFamily: 'PlusJakartaSans_300Light',
    fontSize: 11,
    color: adminTextMuted,
    includeFontPadding: false,
  },
});
