import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function OnboardingLayout() {
  const hasCompletedOnboarding = useAuthStore((s: { hasCompletedOnboarding: boolean }) => s.hasCompletedOnboarding);

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)" />;
}
