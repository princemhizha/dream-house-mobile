import React, { useCallback, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FilterState, PropertyType } from '../../types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { FilterChip } from './FilterChip';

interface FilterBottomSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const PRICE_OPTIONS = [
  { label: 'Any', min: 0, max: 999999 },
  { label: 'Under $300', min: 0, max: 300 },
  { label: '$300-$600', min: 300, max: 600 },
  { label: '$600-$1200', min: 600, max: 1200 },
  { label: '$1200-$2500', min: 1200, max: 2500 },
  { label: '$2500+', min: 2500, max: 999999 },
];

const PROPERTY_TYPES: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'room', label: 'Room' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studentRoom', label: 'Student Room' },
];

const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];

const AMENITY_KEYS = [
  { key: 'wifi', label: Strings.amenities.wifi },
  { key: 'backupPower', label: Strings.amenities.backupPower },
  { key: 'borehole', label: Strings.amenities.borehole },
  { key: 'generator', label: Strings.amenities.generator },
  { key: 'security', label: Strings.amenities.security },
  { key: 'cctv', label: Strings.amenities.cctv },
  { key: 'pool', label: Strings.amenities.pool },
  { key: 'gym', label: Strings.amenities.gym },
  { key: 'garden', label: Strings.amenities.garden },
] as const;

export function FilterBottomSheet({
  sheetRef,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: FilterBottomSheetProps) {
  const snapPoints = useMemo(() => ['75%', '95%'], []);

  const update = useCallback(
    (patch: Partial<FilterState>) => {
      onFiltersChange({ ...filters, ...patch });
    },
    [filters, onFiltersChange]
  );

  const toggleAmenity = useCallback(
    (key: string) => {
      const current = filters.amenities as Record<string, boolean>;
      update({ amenities: { ...filters.amenities, [key]: !current[key] } });
    },
    [filters.amenities, update]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{Strings.filters.filters}</Text>
        <TouchableOpacity onPress={onReset}>
          <Text style={styles.resetText}>{Strings.filters.reset}</Text>
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <Section title={Strings.filters.priceRange}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {PRICE_OPTIONS.map((opt) => {
              const selected =
                filters.minPrice === opt.min && filters.maxPrice === opt.max;
              return (
                <FilterChip
                  key={opt.label}
                  label={opt.label}
                  selected={selected}
                  onPress={() => update({ minPrice: opt.min, maxPrice: opt.max })}
                  style={styles.chipGap}
                />
              );
            })}
          </ScrollView>
        </Section>

        <Section title={Strings.filters.propertyType}>
          <View style={styles.chipGrid}>
            {PROPERTY_TYPES.map((type) => (
              <FilterChip
                key={type.value}
                label={type.label}
                selected={filters.propertyType === type.value}
                onPress={() => update({ propertyType: type.value })}
              />
            ))}
          </View>
        </Section>

        <Section title={Strings.filters.bedrooms}>
          <View style={styles.chipRow}>
            {BEDROOM_OPTIONS.map((n) => (
              <FilterChip
                key={n}
                label={n === 0 ? 'Any' : n === 5 ? '5+' : String(n)}
                selected={filters.minBedrooms === n}
                onPress={() => update({ minBedrooms: n })}
              />
            ))}
          </View>
        </Section>

        <Section title={Strings.filters.amenities}>
          <View style={styles.chipGrid}>
            {AMENITY_KEYS.map(({ key, label }) => (
              <FilterChip
                key={key}
                label={label}
                selected={!!(filters.amenities as Record<string, boolean>)[key]}
                onPress={() => toggleAmenity(key)}
              />
            ))}
          </View>
        </Section>

        <Section title={Strings.filters.furnished}>
          <View style={styles.chipRow}>
            {(['furnished', 'unfurnished', 'either'] as const).map((val) => (
              <FilterChip
                key={val}
                label={Strings.filters[val]}
                selected={filters.furnished === val}
                onPress={() => update({ furnished: val })}
              />
            ))}
          </View>
        </Section>

        <Section title="Other">
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Parking</Text>
            <Switch
              value={filters.parking === true}
              onValueChange={(v) => update({ parking: v ? true : null })}
              trackColor={{ true: Colors.emerald, false: Colors.surface }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Short Stay</Text>
            <Switch
              value={filters.shortStay}
              onValueChange={(v) => update({ shortStay: v })}
              trackColor={{ true: Colors.emerald, false: Colors.surface }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Pets Allowed</Text>
            <Switch
              value={!!(filters.amenities as Record<string, boolean>).petsAllowed}
              onValueChange={(v) =>
                update({ amenities: { ...filters.amenities, petsAllowed: v } })
              }
              trackColor={{ true: Colors.emerald, false: Colors.surface }}
              thumbColor={Colors.white}
            />
          </View>
        </Section>

        <TouchableOpacity style={styles.applyBtn} onPress={onApply} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>{Strings.filters.apply}</Text>
        </TouchableOpacity>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sStyles.section}>
      <Text style={sStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

const sStyles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
});

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  handle: {
    backgroundColor: Colors.textMuted,
    width: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  resetText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.emerald,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing['4xl'],
  },
  chipScroll: {
    flexDirection: 'row',
  },
  chipGap: {
    marginRight: Spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  switchLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  applyBtn: {
    backgroundColor: Colors.emerald,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.base,
  },
  applyBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.background,
  },
});
