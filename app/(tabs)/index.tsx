import React, { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getFeaturedProperties,
  getNewlyAdded,
  getTrending,
  getStudentProperties,
} from '../../data/mockProperties';
import { PropertyCard } from '../../components/property/PropertyCard';
import { FeaturedCard } from '../../components/property/FeaturedCard';
import { FilterChip } from '../../components/search/FilterChip';
import { Colors, Gradients } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { usePropertyStore } from '../../store/usePropertyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Property } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTER_TABS = [
  { key: 'all', label: Strings.filters.all },
  { key: 'rent', label: Strings.filters.rent },
  { key: 'buy', label: Strings.filters.buy },
  { key: 'student', label: Strings.filters.student },
  { key: 'shortStay', label: Strings.filters.shortStay },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { userName } = useAuthStore();
  const setListingType = usePropertyStore((s) => s.setListingType);
  const filters = usePropertyStore((s) => s.filters);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Staggered mount animations
  const headerOpacity = useSharedValue(0);
  const headerY = useSharedValue(-12);
  const heroOpacity = useSharedValue(0);
  const heroY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.ease);
    headerOpacity.value = withTiming(1, { duration: 400, easing });
    headerY.value = withTiming(0, { duration: 400, easing });
    heroOpacity.value = withDelay(100, withTiming(1, { duration: 500, easing }));
    heroY.value = withDelay(100, withTiming(0, { duration: 500, easing }));
    contentOpacity.value = withDelay(220, withTiming(1, { duration: 500, easing }));
  }, [headerOpacity, headerY, heroOpacity, heroY, contentOpacity]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));
  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroOpacity.value,
    transform: [{ translateY: heroY.value }],
  }));
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const featured = getFeaturedProperties();
  const newlyAdded = getNewlyAdded();
  const trending = getTrending();
  const studentProps = getStudentProperties();

  const renderFeaturedItem = useCallback<ListRenderItem<Property>>(
    ({ item }) => <FeaturedCard property={item} />,
    []
  );

  const renderTrendingItem = useCallback<ListRenderItem<Property>>(
    ({ item }) => (
      <View style={[styles.trendingCard, { width: SCREEN_WIDTH * 0.55 }]}>
        <PropertyCard property={item} />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Property) => item.id, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — greeting + actions */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerGreeting}>{greeting},</Text>
            <Text style={styles.headerName}>{userName ?? 'Guest'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.8}
            >
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={18} color={Colors.primaryColor} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero headline */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <Text style={styles.heroLine1}>Acquire Your</Text>
          <View>
            <Text style={styles.heroLine2}>Ultimate Living Space!</Text>
            <View style={styles.heroAccentLine} />
          </View>
          <Text style={styles.heroSub}>Curated luxury listings across Zimbabwe</Text>

          <TouchableOpacity
            style={styles.locationPill}
            onPress={() => router.push('/(tabs)/search')}
            activeOpacity={0.85}
          >
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>{Strings.app.city}</Text>
            <Ionicons name="chevron-forward" size={12} color={Colors.primaryColor} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={contentStyle}>
          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillRow}
            style={styles.pillScroll}
          >
            {FILTER_TABS.map((tab) => (
              <FilterChip
                key={tab.key}
                label={tab.label}
                selected={
                  tab.key === 'all'
                    ? filters.listingType === 'all'
                    : filters.listingType === tab.key
                }
                onPress={() =>
                  setListingType(
                    tab.key === 'student'
                      ? 'rent'
                      : tab.key === 'shortStay'
                        ? 'shortStay'
                        : (tab.key as 'all' | 'rent' | 'buy')
                  )
                }
              />
            ))}
          </ScrollView>

          {/* Featured Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{Strings.home.sections.featured.toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/search')} activeOpacity={0.8}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderFeaturedItem}
              contentContainerStyle={styles.horizontalList}
              initialNumToRender={3}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          </View>

          {/* Newly Added Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{Strings.home.sections.newlyAdded.toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/search')} activeOpacity={0.8}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {newlyAdded.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </View>

          {/* Student Housing Banner */}
          {studentProps.length > 0 && (
            <TouchableOpacity
              style={styles.bannerWrapper}
              onPress={() => router.push('/(tabs)/search')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={Gradients.greenTint}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
              >
                <View style={styles.bannerContent}>
                  <View style={styles.bannerIconWrap}>
                    <Ionicons name="school-outline" size={26} color={Colors.primaryColor} />
                  </View>
                  <View style={styles.bannerText}>
                    <Text style={styles.bannerTitle}>{Strings.home.studentBanner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{Strings.home.studentBanner.subtitle}</Text>
                  </View>
                </View>
                <View style={styles.bannerCta}>
                  <Text style={styles.bannerCtaText}>{Strings.home.studentBanner.cta}</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.primaryColor} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Trending Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{Strings.home.sections.trending.toUpperCase()}</Text>
              </View>
            </View>
            <FlatList
              data={trending}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              renderItem={renderTrendingItem}
              contentContainerStyle={styles.horizontalList}
              initialNumToRender={3}
              maxToRenderPerBatch={4}
              windowSize={5}
            />
          </View>
        </Animated.View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const screenPad = 20;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: screenPad,
    paddingTop: Spacing.base,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  headerName: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    marginTop: 1,
    textTransform: 'capitalize',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  avatarInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- Hero ---
  hero: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  heroLine1: {
    fontFamily: FontFamily.displayLight,
    fontSize: 30,
    color: Colors.textMuted,
    lineHeight: 30 * 1.1,
  },
  heroLine2: {
    fontFamily: FontFamily.displayBold,
    fontSize: 34,
    color: Colors.textPrimary,
    lineHeight: 34 * 1.05,
  },
  heroAccentLine: {
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.gold400,
    marginTop: 5,
  },
  heroSub: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
    maxWidth: SCREEN_WIDTH * 0.75,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.borderEmerald,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryColor,
  },
  locationText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primaryColor,
  },
  // --- Filter row ---
  pillScroll: {
    marginBottom: Spacing.xl,
  },
  pillRow: {
    paddingRight: screenPad,
    gap: Spacing.xs,
  },
  // --- Sections ---
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: Colors.primaryColor,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  seeAll: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.primaryColor,
  },
  horizontalList: {
    paddingRight: screenPad,
  },
  // --- Student banner ---
  bannerWrapper: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.borderEmerald,
  },
  banner: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  bannerIconWrap: {
    width: 50,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(15,106,61,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    flex: 1,
    gap: 3,
  },
  bannerTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.lg,
    color: Colors.primaryDark,
  },
  bannerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.primaryColor,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingTop: 4,
  },
  bannerCtaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.primaryColor,
    textTransform: 'uppercase',
    letterSpacing: LetterSpacing.wide,
  },
  trendingCard: {
    marginRight: Spacing.sm,
  },
  bottomPad: {
    height: 110,
  },
});
