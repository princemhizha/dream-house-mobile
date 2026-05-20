import React, { memo, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Property } from '../../types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, LetterSpacing } from '../../constants/typography';
import { Radius, Shadow, Spacing } from '../../constants/spacing';
import { AvailabilityBadge } from '../ui/AvailabilityBadge';
import { GoldBadge } from '../ui/GoldBadge';
import { useSavedStore } from '../../store/useSavedStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;

interface FeaturedCardProps {
  property: Property;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const FeaturedCard = memo(function FeaturedCard({ property }: FeaturedCardProps) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedStore();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = useCallback(() => {
    router.push(`/property/${property.id}`);
  }, [property.id, router]);

  const saved = isSaved(property.id);

  return (
    <AnimatedTouchable
      style={[styles.card, animStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Full-bleed image */}
      <Image
        source={{ uri: property.images[0] }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={400}
      />

      {/* Dramatic hero gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.50)', 'rgba(0,0,0,0.92)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Top row */}
      <View style={styles.topRow}>
        <GoldBadge variant="featured" />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => toggleSave(property.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? Colors.error : Colors.white}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom content */}
      <View style={styles.bottomContent}>
        <AvailabilityBadge status={property.availability} />
        <Text style={styles.title} numberOfLines={2}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.location}>{property.suburb}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>${property.price.toLocaleString()}</Text>
            {property.listingType !== 'buy' && <Text style={styles.priceSuffix}>/mo</Text>}
          </View>
          <View style={styles.stats}>
            <Ionicons name="bed-outline" size={12} color={Colors.gold200} />
            <Text style={styles.stat}>{property.bedrooms}</Text>
            <View style={styles.statDivider} />
            <MaterialCommunityIcons name="shower" size={12} color={Colors.gold200} />
            <Text style={styles.stat}>{property.bathrooms}</Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 290,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginRight: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  topRow: {
    position: 'absolute',
    top: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    gap: 6,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    color: '#FFFFFF',
    lineHeight: FontSize.xl * 1.2,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: LetterSpacing.wide,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  price: {
    fontFamily: FontFamily.monoBold,
    fontSize: FontSize['3xl'],
    color: Colors.gold400,
    letterSpacing: LetterSpacing.tight,
  },
  priceSuffix: {
    fontFamily: FontFamily.body,
    fontSize: FontSize['2xs'],
    color: Colors.gold500,
    letterSpacing: LetterSpacing.wide,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stat: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.gold200,
  },
  statDivider: {
    width: 1,
    height: 9,
    backgroundColor: Colors.borderGold,
  },
});
