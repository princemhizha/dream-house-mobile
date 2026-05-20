import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PropertyCarouselProps {
  images: string[];
  height?: number;
  showFullScreenHint?: boolean;
  onExpand?: () => void;
}

export function PropertyCarousel({
  images,
  height = 320,
  showFullScreenHint = true,
  onExpand,
}: PropertyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        containerHeight: {
          height,
        },
        slide: {
          width: SCREEN_WIDTH,
          height,
        },
      }),
    [height]
  );
  const handleExpand = onExpand ?? (() => null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={[styles.container, dynamicStyles.containerHeight]}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={dynamicStyles.slide}>
            <Image
              source={{ uri: item }}
              style={styles.image}
              contentFit="cover"
              placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
              transition={200}
            />
          </View>
        )}
      />

      {showFullScreenHint && (
        <TouchableOpacity style={styles.expandBtn} onPress={handleExpand} activeOpacity={0.8}>
          <Ionicons name="expand-outline" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}

      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.counterBadge}>
        <Ionicons name="images-outline" size={12} color={Colors.white} />
        <View style={styles.counterSpacer} />
        <View style={styles.counterText}>
          {/* counter text rendered as dots for minimal UI */}
        </View>
        <View style={styles.counterDivider} />
        <View style={styles.counterNumbers}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.counterDot, i === activeIndex && styles.counterDotActive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  expandBtn: {
    position: 'absolute',
    top: Spacing.base,
    right: Spacing.base,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Spacing.base,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 18,
  },
  counterBadge: {
    position: 'absolute',
    bottom: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  counterSpacer: {
    width: 4,
  },
  counterText: {},
  counterDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  counterNumbers: {
    flexDirection: 'row',
    gap: 4,
  },
  counterDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  counterDotActive: {
    backgroundColor: Colors.white,
  },
});
