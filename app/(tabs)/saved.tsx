import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
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
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { mockProperties } from '../../data/mockProperties';
import { EmptyState } from '../../components/ui/EmptyState';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { useSavedStore } from '../../store/useSavedStore';
import { usePropertyStore } from '../../store/usePropertyStore';

type TabKey = 'saved' | 'comparison';

export default function SavedScreen() {
  const router = useRouter();
  const { savedIds, toggleSave } = useSavedStore();
  const allProperties = usePropertyStore((s) => s.allProperties);
  const [activeTab, setActiveTab] = useState<TabKey>('saved');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const savedProperties = allProperties.filter((p) => savedIds.includes(p.id));
  const comparedProperties = savedProperties.filter((property) => compareIds.includes(property.id));

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    },
    []
  );

  if (savedProperties.length === 0 && activeTab === 'saved') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>{Strings.saved.title}</Text>
        </View>
        <EmptyState
          icon="heart-outline"
          title={Strings.saved.empty}
          subtitle={Strings.saved.emptySubtitle}
          ctaLabel={Strings.saved.browseCta}
          onCta={() => router.push('/(tabs)/search')}
          style={styles.emptyState}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{Strings.saved.title}</Text>
        <Text style={styles.count}>{savedIds.length} saved</Text>
      </View>

      <View style={styles.tabs}>
        {(['saved', 'comparison'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'saved' ? Strings.saved.savedHomes : Strings.saved.comparison}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={savedProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeablePropertyCard
            property={item}
            onRemove={() => toggleSave(item.id)}
            showCompare={activeTab === 'comparison'}
            isCompared={compareIds.includes(item.id)}
            onToggleCompare={() => toggleCompare(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        initialNumToRender={6}
        windowSize={10}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />

      {activeTab === 'comparison' && compareIds.length >= 2 && (
        <View style={styles.compareBar}>
          <Text style={styles.compareBarText}>
            {compareIds.length} selected
          </Text>
          <TouchableOpacity style={styles.compareBtn} activeOpacity={0.8} onPress={() => setShowCompareModal(true)}>
            <Text style={styles.compareBtnText}>{Strings.saved.compareSelected}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showCompareModal} transparent animationType="slide" onRequestClose={() => setShowCompareModal(false)}>
        <View style={styles.compareModalOverlay}>
          <View style={styles.compareModalCard}>
            <View style={styles.compareModalHeader}>
              <Text style={styles.compareModalTitle}>Compare Properties</Text>
              <TouchableOpacity onPress={() => setShowCompareModal(false)} activeOpacity={0.8}>
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {comparedProperties.map((property) => (
                <View key={property.id} style={styles.compareRow}>
                  <Text style={styles.comparePropertyTitle}>{property.title}</Text>
                  <Text style={styles.comparePropertyMeta}>{property.suburb}, {property.city}</Text>
                  <Text style={styles.comparePropertyMeta}>${property.price.toLocaleString()} • {property.bedrooms} bed • {property.bathrooms} bath</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SwipeablePropertyCard({
  property,
  onRemove,
  showCompare,
  isCompared,
  onToggleCompare,
}: {
  property: (typeof mockProperties)[0];
  onRemove: () => void;
  showCompare: boolean;
  isCompared: boolean;
  onToggleCompare: () => void;
}) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = e.translationX;
      }
    })
    .onEnd((e) => {
      if (e.translationX < -100) {
        translateX.value = withTiming(-400, { duration: 250 }, () => {
          runOnJS(onRemove)();
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={swipeStyles.wrapper}>
      <View style={swipeStyles.removeHint}>
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
        <Text style={swipeStyles.removeHintText}>Remove</Text>
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={cardStyle}>
          {showCompare && (
            <TouchableOpacity
              style={[
                swipeStyles.compareCheck,
                isCompared && swipeStyles.compareCheckActive,
              ]}
              onPress={onToggleCompare}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isCompared ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={isCompared ? Colors.emerald : Colors.textMuted}
              />
            </TouchableOpacity>
          )}
          <PropertyCard property={property} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const swipeStyles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  removeHint: {
    position: 'absolute',
    right: Spacing.base,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  removeHintText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.error,
  },
  compareCheck: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 10,
  },
  compareCheckActive: {},
});

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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  count: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  tabActive: {
    borderBottomColor: Colors.emerald,
  },
  tabLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.emerald,
  },
  list: {
    paddingHorizontal: Spacing.base,
  },
  emptyState: {
    flex: 1,
  },
  compareBar: {
    position: 'absolute',
    bottom: 90,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.emerald,
  },
  compareBarText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  compareBtn: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: 10,
  },
  compareBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.background,
  },
  compareModalOverlay: {
    flex: 1,
    backgroundColor: Colors.scrimMedium,
    justifyContent: 'flex-end',
  },
  compareModalCard: {
    maxHeight: '70%',
    backgroundColor: Colors.surfaceRaised,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  compareModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compareModalTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  compareRow: {
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    gap: 4,
  },
  comparePropertyTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  comparePropertyMeta: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
