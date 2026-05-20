import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { shadows } from '../../constants/shadows';

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  index:   { active: 'home',   inactive: 'home-outline' },
  search:  { active: 'search', inactive: 'search-outline' },
  saved:   { active: 'heart',  inactive: 'heart-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const TAB_LABELS: Record<string, string> = {
  index:   'Home',
  search:  'Search',
  saved:   'Saved',
  profile: 'Profile',
};

function TabItem({
  routeName,
  label,
  isFocused,
  onPress,
  onLongPress,
}: {
  routeName: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(1);
  const iconName = isFocused
    ? (TAB_ICONS[routeName]?.active ?? 'home')
    : (TAB_ICONS[routeName]?.inactive ?? 'home-outline');

  const handlePressIn = () => {
    scale.value = withSpring(1.15, { damping: 8, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.tabInner, animStyle]}>
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? Colors.primaryColor : Colors.textMuted}
        />
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
        {isFocused && <View style={styles.activeDot} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabRow = (
    <View style={styles.tabRow}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = TAB_LABELS[route.name] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            label={label}
            isFocused={isFocused}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
        )}
        {tabRow}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  pill: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 10,
  },
  androidBg: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
  },
  tabRow: {
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? Spacing.base : Spacing.sm,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    backgroundColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: 3,
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primaryColor,
  },
  tabLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize['2xs'],
    color: Colors.textMuted,
    letterSpacing: LetterSpacing.wide,
  },
  tabLabelActive: {
    color: Colors.primaryColor,
    fontFamily: FontFamily.bodyMedium,
  },
});
