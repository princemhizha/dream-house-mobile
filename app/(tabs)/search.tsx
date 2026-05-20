import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { PropertyCard } from '../../components/property/PropertyCard';
import { PropertyCardSwipe } from '../../components/property/PropertyCardSwipe';
import { SearchBar } from '../../components/search/SearchBar';
import { FilterChip } from '../../components/search/FilterChip';
import { FilterBottomSheet } from '../../components/search/FilterBottomSheet';
import { EmptyState } from '../../components/ui/EmptyState';
import { PropertyCardSkeleton } from '../../components/ui/SkeletonLoader';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { usePropertyStore } from '../../store/usePropertyStore';
import { FilterState, Property } from '../../types';

const QUICK_FILTERS = [
  { key: 'all', label: Strings.filters.all },
  { key: 'rent', label: Strings.filters.rent },
  { key: 'buy', label: Strings.filters.buy },
  { key: 'student', label: Strings.filters.student },
] as const;

export default function SearchScreen() {
  const sheetRef = useRef<BottomSheet | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');
  const [swipeIndex, setSwipeIndex] = useState(0);

  const {
    filteredProperties,
    filters,
    pendingFilters,
    setQuery,
    setListingType,
    setPendingFilters,
    applyPendingFilters,
    resetFilters,
    isLoading,
  } = usePropertyStore();

  const renderPropertyItem = useCallback<ListRenderItem<Property>>(
    ({ item }) => <PropertyCard property={item} />,
    []
  );

  const keyExtractor = useCallback((item: Property) => item.id, []);

  const openFilters = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const handleApply = useCallback(() => {
    applyPendingFilters();
    sheetRef.current?.close();
  }, [applyPendingFilters]);

  const handleReset = useCallback(() => {
    resetFilters();
    sheetRef.current?.close();
  }, [resetFilters]);

  const renderSwipeView = () => {
    if (swipeIndex >= filteredProperties.length) {
      return (
        <EmptyState
          icon="refresh-outline"
          title="No more properties"
          subtitle="You've seen all matching properties"
          ctaLabel="Reset"
          onCta={() => setSwipeIndex(0)}
          style={styles.empty}
        />
      );
    }
    return (
      <View style={styles.swipeContainer}>
        {filteredProperties
          .slice(swipeIndex, swipeIndex + 3)
          .reverse()
          .map((property, idx, arr) => (
            <PropertyCardSwipe
              key={property.id}
              property={property}
              isTop={idx === arr.length - 1}
              onSwipeLeft={() => setSwipeIndex((i) => i + 1)}
              onSwipeRight={() => setSwipeIndex((i) => i + 1)}
            />
          ))}
        <View style={styles.swipeActions}>
          <TouchableOpacity
            style={[styles.swipeActionBtn, styles.skipBtn]}
            onPress={() => setSwipeIndex((i) => i + 1)}
          >
            <Ionicons name="close" size={28} color={Colors.error} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.swipeActionBtn, styles.likeBtn]}
            onPress={() => setSwipeIndex((i) => i + 1)}
          >
            <Ionicons name="heart" size={28} color={Colors.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <SearchBar
          value={filters.query}
          onChangeText={setQuery}
          onFilterPress={openFilters}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.filterRow}>
        {QUICK_FILTERS.map((f) => (
          <FilterChip
            key={f.key}
            label={f.label}
            selected={
              f.key === 'all' ? filters.listingType === 'all' : filters.listingType === f.key
            }
            onPress={() =>
              setListingType(f.key === 'student' ? 'rent' : (f.key as FilterState['listingType']))
            }
          />
        ))}
        <TouchableOpacity style={styles.viewToggle} onPress={() => setViewMode(v => v === 'list' ? 'swipe' : 'list')} activeOpacity={0.8}>
          <Ionicons
            name={viewMode === 'list' ? 'layers-outline' : 'list-outline'}
            size={20}
            color={Colors.primaryColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.resultsMeta}>
        <Text style={styles.resultsCount}>
          {filteredProperties.length} properties found
        </Text>
      </View>

      {viewMode === 'list' ? (
        isLoading ? (
          <FlatList
            data={[1, 2, 3]}
            keyExtractor={(i) => String(i)}
            renderItem={() => <PropertyCardSkeleton />}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        ) : filteredProperties.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title={Strings.errors.noResults}
            subtitle={Strings.errors.noResultsSubtitle}
            ctaLabel="Clear Filters"
            onCta={resetFilters}
            style={styles.empty}
          />
        ) : (
          <FlatList
            data={filteredProperties}
            keyExtractor={keyExtractor}
            renderItem={renderPropertyItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={50}
            initialNumToRender={6}
            windowSize={10}
          />
        )
      ) : (
        renderSwipeView()
      )}

      <FilterBottomSheet
        sheetRef={sheetRef}
        filters={pendingFilters}
        onFiltersChange={setPendingFilters}
        onApply={handleApply}
        onReset={handleReset}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  searchBar: {},
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  viewToggle: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsMeta: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  resultsCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeActions: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    gap: Spacing['3xl'],
  },
  swipeActionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  skipBtn: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  likeBtn: {
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.primaryLight,
  },
});
