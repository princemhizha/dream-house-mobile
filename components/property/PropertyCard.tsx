import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { Radius, Spacing } from '../../constants/spacing';
import { AvailabilityBadge } from '../ui/AvailabilityBadge';
import { GoldBadge } from '../ui/GoldBadge';
import { useSavedStore } from '../../store/useSavedStore';
import { useAuthStore } from '../../store/useAuthStore';

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const PropertyCard = memo(function PropertyCard({ property, onPress }: PropertyCardProps) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedStore();
  const { isSubscribed } = useAuthStore();
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/property/${property.id}`);
    }
  }, [onPress, property.id, router]);

  const handleSave = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      heartScale.value = withSpring(1.4, { damping: 6, stiffness: 400 }, () => {
        heartScale.value = withSpring(1, { damping: 10 });
      });
      toggleSave(property.id);
    },
    [heartScale, property.id, toggleSave]
  );

  const saved = isSaved(property.id);
  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[styles.card, animStyle]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Image section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0] }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={400}
        />

        {/* Subtle top gradient for legibility */}
        <LinearGradient
          colors={['rgba(0,0,0,0.18)', 'transparent']}
          style={styles.imageTopGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Top row: featured badge + heart */}
        <View style={styles.imageTop}>
          <View>{property.featured && <GoldBadge variant="featured" />}</View>
          <Animated.View style={heartAnimStyle}>
            <TouchableOpacity style={styles.heartBtn} onPress={handleSave} activeOpacity={0.8}>
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={18}
                color={saved ? Colors.error : Colors.white}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Listing type badge at bottom-left of image */}
        <View style={styles.imageBadgeRow}>
          <View style={styles.listingBadge}>
            <Text style={styles.listingBadgeText}>
              {property.listingType === 'buy' ? 'FOR SALE' : property.listingType === 'shortStay' ? 'SHORT STAY' : 'FOR RENT'}
            </Text>
          </View>
          <AvailabilityBadge status={property.availability} />
        </View>
      </View>

      {/* Info section — white area below image */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>{property.suburb}, {property.city}</Text>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.price}>${property.price.toLocaleString()}</Text>
            {property.listingType !== 'buy' && <Text style={styles.priceSuffix}>/mo</Text>}
          </View>
          {!isSubscribed && (
            <View style={styles.lockedBadge}>
              <Ionicons name="lock-closed" size={9} color={Colors.gold400} />
              <Text style={styles.lockedText}>UNLOCK</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="bed-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.statText}>{property.bedrooms} bed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="water-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.statText}>{property.bathrooms} bath</Text>
          </View>
          {property.parkingSpaces > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <MaterialCommunityIcons name="car-back" size={13} color={Colors.textMuted} />
                <Text style={styles.statText}>{property.parkingSpaces}</Text>
              </View>
            </>
          )}
          {property.sizeSqm > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <MaterialCommunityIcons name="ruler-square" size={11} color={Colors.textMuted} />
                <Text style={styles.statText}>{property.sizeSqm}m²</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 195,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  imageTop: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heartBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBadgeRow: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  listingBadge: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  listingBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  price: {
    fontFamily: FontFamily.monoBold,
    fontSize: FontSize.xl,
    color: Colors.primaryColor,
    letterSpacing: LetterSpacing.tight,
  },
  priceSuffix: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldMuted,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 3,
  },
  lockedText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 8,
    color: Colors.gold400,
    letterSpacing: LetterSpacing.widest,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    marginTop: 2,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.borderDefault,
  },
});
