import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Property } from '../../types';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { AvailabilityBadge } from '../ui/AvailabilityBadge';

interface ListingRowProps {
  property: Property;
  onBoost?: () => void;
}

export function ListingRow({ property, onBoost }: ListingRowProps) {
  const router = useRouter();
  const handleBoost = onBoost ?? (() => null);

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/property/${property.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: property.images[0] }}
        style={styles.thumbnail}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title}
        </Text>
        <Text style={styles.suburb}>{property.suburb}</Text>
        <View style={styles.row2}>
          <AvailabilityBadge status={property.availability} />
          <Text style={styles.price}>${property.price.toLocaleString()}/mo</Text>
        </View>
        <View style={styles.stats}>
          <Ionicons name="eye-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.statText}>{property.views}</Text>
          <Ionicons name="heart-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.statText}>{property.saves}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.boostBtn} onPress={handleBoost} activeOpacity={0.8}>
          <Ionicons name="rocket-outline" size={14} color={Colors.emerald} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/property/${property.id}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  thumbnail: {
    width: 90,
    height: 90,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: 3,
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  suburb: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  price: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.sm,
    color: Colors.emerald,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  actions: {
    padding: Spacing.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  boostBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.emeraldMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
