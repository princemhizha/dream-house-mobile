import React, { useCallback, useState } from 'react';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { PropertyCarousel } from '../../components/property/PropertyCarousel';
import { PropertyCard } from '../../components/property/PropertyCard';
import { AvailabilityBadge } from '../../components/ui/AvailabilityBadge';
import { GoldBadge } from '../../components/ui/GoldBadge';
import { GlassCard } from '../../components/ui/GlassCard';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { useSavedStore } from '../../store/useSavedStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { Property } from '../../types';

const AMENITY_ICONS: Record<string, string> = {
  wifi: 'wifi',
  backupPower: 'battery-charging',
  borehole: 'water',
  generator: 'flash',
  security: 'shield-checkmark',
  cctv: 'videocam',
  pool: 'water-outline',
  gym: 'barbell-outline',
  parking: 'car',
  garden: 'leaf',
  servantQuarters: 'home-outline',
  aircon: 'snow',
  petsAllowed: 'paw',
};

const AMENITY_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  backupPower: 'Backup Power',
  borehole: 'Borehole',
  generator: 'Generator',
  security: 'Security',
  cctv: 'CCTV',
  pool: 'Pool',
  gym: 'Gym',
  parking: 'Parking',
  garden: 'Garden',
  servantQuarters: 'Servant Qtrs',
  aircon: 'Air Con',
  petsAllowed: 'Pets OK',
};

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedStore();
  const { isSubscribed } = useAuthStore();
  const getPropertyById = usePropertyStore((s) => s.getPropertyById);
  const allProperties = usePropertyStore((s) => s.allProperties);
  const [descExpanded, setDescExpanded] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      const prop = await getPropertyById(id ?? '');
      setProperty(prop);
      setLoading(false);
    };
    loadProperty();
  }, [id, getPropertyById]);

  const whatsappPhone = property?.landlord.whatsapp?.replace(/\D/g, '') ?? '';
  const phoneNumber = property?.landlord.phone ?? '';
  const emailAddress = property?.landlord.email ?? '';

  const handleWhatsApp = useCallback(() => {
    if (!whatsappPhone) {
      return;
    }

    const msg = encodeURIComponent(Strings.whatsapp.viewingMessage);
    Linking.openURL(`https://wa.me/${whatsappPhone}?text=${msg}`);
  }, [whatsappPhone]);

  const handleCall = useCallback(() => {
    if (!phoneNumber) {
      return;
    }

    Linking.openURL(`tel:${phoneNumber}`);
  }, [phoneNumber]);

  const handleEmail = useCallback(() => {
    if (!emailAddress) {
      return;
    }

    Linking.openURL(`mailto:${emailAddress}`);
  }, [emailAddress]);

  const handleShare = useCallback(() => {
    if (!property) {
      return;
    }

    Share.share({
      title: property.title,
      message: `${property.title} in ${property.suburb}, ${property.city} for $${property.price.toLocaleString()}`,
    }).catch(() => null);
  }, [property]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Loading property...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Property not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const saved = isSaved(property.id);
  const similar = allProperties
    .filter((p) => p.id !== property.id && p.suburb === property.suburb)
    .slice(0, 4);

  const activeAmenities = Object.entries(property.amenities)
    .filter(([key, val]) => val === true && key !== 'petsAllowed')
    .map(([key]) => key);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]}
      >
        {/* Image Carousel */}
        <View style={styles.carouselWrapper}>
          <PropertyCarousel images={property.images} height={360} />

          {/* Back + Save buttons overlay */}
          <SafeAreaView style={styles.carouselOverlay} edges={['top']}>
            <TouchableOpacity style={styles.iconOverlayBtn} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.overlaySpacer} />
            <TouchableOpacity
              style={styles.iconOverlayBtn}
              onPress={() => toggleSave(property.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={22}
                color={saved ? Colors.error : Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconOverlayBtn} activeOpacity={0.8} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.availabilityOverlay}>
            <AvailabilityBadge status={property.availability} />
            {property.featured && <GoldBadge variant="featured" style={styles.featuredBadge} />}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleSection}>
            <Text style={styles.propertyTitle}>{property.title}</Text>
            <Text style={styles.location}>
              <Ionicons name="location" size={14} color={Colors.emerald} />{' '}
              {property.suburb}, {property.city}
            </Text>
            <Text style={styles.price}>
              {property.listingType === 'buy'
                ? `$${property.price.toLocaleString()}`
                : `$${property.price.toLocaleString()}`}
              {property.listingType !== 'buy' && (
                <Text style={styles.priceLabel}>{Strings.property.perMonth}</Text>
              )}
            </Text>
            {property.listingType !== 'buy' && (
              <Text style={styles.depositText}>
                Deposit: ${property.deposit.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Stats Row */}
          <GlassCard style={styles.statsCard}>
            <StatItem icon="bed-outline" value={String(property.bedrooms)} label="Beds" />
            <StatDivider />
            <StatItem icon={null} iconComp={<MaterialCommunityIcons name="shower" size={18} color={Colors.emerald} />} value={String(property.bathrooms)} label="Baths" />
            {property.parkingSpaces > 0 && (
              <>
                <StatDivider />
                <StatItem icon="car-outline" value={String(property.parkingSpaces)} label="Parking" />
              </>
            )}
            {property.sizeSqm > 0 && (
              <>
                <StatDivider />
                <StatItem
                  icon={null}
                  iconComp={<MaterialCommunityIcons name="ruler-square" size={16} color={Colors.emerald} />}
                  value={`${property.sizeSqm}`}
                  label="m2"
                />
              </>
            )}
          </GlassCard>

          {/* Amenities */}
          {activeAmenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{Strings.property.amenities}</Text>
              <View style={styles.amenityGrid}>
                {activeAmenities.map((key) => (
                  <View key={key} style={styles.amenityChip}>
                    <Ionicons
                      name={(AMENITY_ICONS[key] as never) ?? 'checkmark'}
                      size={14}
                      color={Colors.emerald}
                    />
                    <Text style={styles.amenityLabel}>{AMENITY_LABELS[key] ?? key}</Text>
                  </View>
                ))}
                {property.amenities.petsAllowed && (
                  <View style={styles.amenityChip}>
                    <Ionicons name="paw" size={14} color={Colors.emerald} />
                    <Text style={styles.amenityLabel}>Pets OK</Text>
                  </View>
                )}
                <View style={styles.amenityChip}>
                  <Ionicons name="cube-outline" size={14} color={Colors.emerald} />
                  <Text style={styles.amenityLabel}>
                    {property.amenities.furnished === 'furnished'
                      ? 'Furnished'
                      : property.amenities.furnished === 'unfurnished'
                      ? 'Unfurnished'
                      : 'Furn/Unfurn'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{Strings.property.description}</Text>
            <Text
              style={styles.description}
              numberOfLines={descExpanded ? undefined : 4}
            >
              {property.description}
            </Text>
            <TouchableOpacity
              onPress={() => setDescExpanded((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.readMore}>
                {descExpanded ? 'Show less' : 'Read more'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Landlord Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{Strings.property.landlord}</Text>
            <GlassCard style={styles.landlordCard}>
              <View style={styles.landlordInfo}>
                <View style={styles.landlordAvatar}>
                  <Ionicons name="person" size={24} color={Colors.textMuted} />
                </View>
                <View style={styles.landlordText}>
                  <Text style={styles.landlordName}>{property.landlord.name}</Text>
                  {property.landlord.verified && (
                    <GoldBadge variant="verified" />
                  )}
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            {isSubscribed ? (
              <View style={styles.contactActions}>
                <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
                  <Ionicons name="call" size={18} color={Colors.background} />
                  <Text style={styles.callBtnText}>{Strings.property.callNow}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
                  <Ionicons name="logo-whatsapp" size={18} color={Colors.background} />
                  <Text style={styles.whatsappBtnText}>{Strings.property.whatsapp}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emailBtn} onPress={handleEmail} activeOpacity={0.85}>
                  <Ionicons name="mail-outline" size={18} color={Colors.emerald} />
                  <Text style={styles.emailBtnText}>{Strings.property.email}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lockedContact}>
                <BlurView intensity={20} tint="dark" style={styles.blurOverlay}>
                  <View style={styles.lockedRow}>
                    <Ionicons name="call" size={16} color={Colors.textMuted} />
                    <Text style={styles.lockedText}>+263 7X XXX XXXX</Text>
                  </View>
                  <View style={styles.lockedRow}>
                    <Ionicons name="logo-whatsapp" size={16} color={Colors.textMuted} />
                    <Text style={styles.lockedText}>+263 7X XXX XXXX</Text>
                  </View>
                </BlurView>
                <TouchableOpacity
                  style={styles.unlockBtn}
                  onPress={() => router.push('/subscription')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="lock-open-outline" size={18} color={Colors.background} />
                  <Text style={styles.unlockBtnText}>{Strings.property.unlockContact}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Request Viewing */}
          <TouchableOpacity style={styles.viewingBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Ionicons name="calendar-outline" size={18} color={Colors.emerald} />
            <Text style={styles.viewingBtnText}>{Strings.property.viewingRequest}</Text>
          </TouchableOpacity>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{Strings.property.similar}</Text>
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

function StatItem({
  icon,
  iconComp,
  value,
  label,
}: {
  icon: string | null;
  iconComp?: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <View style={statStyles.item}>
      {iconComp ?? (
        <Ionicons name={(icon as never) ?? 'help'} size={18} color={Colors.emerald} />
      )}
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function StatDivider() {
  return <View style={statStyles.divider} />;
}

const statStyles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  value: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  carouselWrapper: {
    position: 'relative',
  },
  carouselOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  overlaySpacer: {
    flex: 1,
  },
  iconOverlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityOverlay: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  featuredBadge: {},
  content: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
  },
  titleSection: {
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  propertyTitle: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    lineHeight: FontSize['2xl'] * 1.2,
  },
  location: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  price: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize['3xl'],
    color: Colors.emerald,
    marginTop: Spacing.sm,
  },
  priceLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
  depositText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  statsCard: {
    flexDirection: 'row',
    marginBottom: Spacing.base,
    padding: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  amenityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.emeraldMuted,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  amenityLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.emerald,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  readMore: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.sm,
    color: Colors.emerald,
  },
  landlordCard: {
    padding: Spacing.base,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.glassHover,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landlordText: {
    gap: 4,
  },
  landlordName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  contactActions: {
    gap: Spacing.sm,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.emerald,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  callBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.background,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  whatsappBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.background,
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.emeraldMuted,
    borderWidth: 1,
    borderColor: Colors.emerald,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  emailBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.emerald,
  },
  lockedContact: {
    gap: Spacing.base,
  },
  blurOverlay: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lockedText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textDisabled,
    letterSpacing: 4,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  unlockBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.background,
  },
  viewingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.emerald,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  viewingBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.emerald,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  notFoundText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
  backBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.emerald,
    borderRadius: Radius.lg,
  },
  backBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.background,
  },
});
