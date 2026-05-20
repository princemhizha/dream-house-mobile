import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../../constants/colors';
import { FontFamily, FontSize, LineHeight } from '../../../constants/typography';
import { Radius, Spacing } from '../../../constants/spacing';
import { GlassCard } from '../../../components/ui/GlassCard';

const STEPS = [
  { label: 'ID Submitted', done: true },
  { label: 'Under Review', current: true },
  { label: 'Decision Made', pending: true },
];

export default function PendingScreen() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, pulseStyle]}>
          <Ionicons name="time-outline" size={48} color={Colors.navy500} />
        </Animated.View>

        <Text style={styles.title}>Verification In Progress</Text>
        <Text style={styles.body}>
          Our team is reviewing your ID. This usually takes 1 to 24 hours. You will be notified
          once approved.
        </Text>

        <GlassCard style={styles.timelineCard}>
          {STEPS.map((step, i) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.dot,
                    step.done && styles.dotDone,
                    step.current && styles.dotCurrent,
                    step.pending && styles.dotPending,
                  ]}
                />
                {i < STEPS.length - 1 && (
                  <View style={[styles.connector, step.done && styles.connectorDone]} />
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step.done && styles.stepLabelDone,
                  step.current && styles.stepLabelCurrent,
                ]}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </GlassCard>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.navy500} />
          <Text style={styles.infoText}>
            While you wait, you can complete your landlord profile and prepare your first property
            listing. It will be saved as a draft.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push('/landlord/dashboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.outlineBtnText}>Complete My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/landlord/dashboard')}
          activeOpacity={0.7}
          style={styles.ghostBtn}
        >
          <Text style={styles.ghostBtnText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    gap: Spacing.base,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    backgroundColor: Colors.navy50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  timelineCard: {
    width: '100%',
    padding: Spacing.base,
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.base,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    backgroundColor: Colors.ash,
  },
  dotDone: {
    backgroundColor: Colors.navy700,
  },
  dotCurrent: {
    backgroundColor: Colors.navy500,
  },
  dotPending: {
    backgroundColor: Colors.ash,
  },
  connector: {
    width: 2,
    height: 28,
    backgroundColor: Colors.ash,
    marginVertical: 2,
  },
  connectorDone: {
    backgroundColor: Colors.navy700,
  },
  stepLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    paddingTop: 1,
    marginBottom: 28,
  },
  stepLabelDone: {
    color: Colors.navy700,
    fontFamily: FontFamily.bodyMedium,
  },
  stepLabelCurrent: {
    color: Colors.navy500,
    fontFamily: FontFamily.bodySemiBold,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.navy50,
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderNavy,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },
  outlineBtn: {
    width: '100%',
    paddingVertical: Spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.navy700,
    borderRadius: Radius.lg,
    marginTop: Spacing.xs,
  },
  outlineBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.navy700,
  },
  ghostBtn: {
    paddingVertical: Spacing.xs,
  },
  ghostBtnText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
});
