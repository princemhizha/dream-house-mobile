import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/spacing';
import { Strings } from '../../constants/strings';
import { FilterChip } from '../../components/search/FilterChip';
import { useAuthStore } from '../../store/useAuthStore';
import { usePropertyStore } from '../../store/usePropertyStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../../constants/colors';
import { Property } from '../../types';
import { FormInput } from '../../components/ui/FormInput';

const STEPS = Strings.landlord.newListing.steps;

const PROPERTY_TYPES = ['House', 'Apartment', 'Room', 'Townhouse', 'Student Room'];
const AMENITY_OPTIONS = [
  'WiFi', 'Backup Power', 'Borehole', 'Generator',
  'Security', 'CCTV', 'Pool', 'Gym', 'Parking', 'Garden',
];

const PROPERTY_TYPE_MAP: Record<string, Property['propertyType']> = {
  House: 'house',
  Apartment: 'apartment',
  Room: 'room',
  Townhouse: 'townhouse',
  'Student Room': 'studentRoom',
};

export default function NewListingScreen() {
  const router = useRouter();
  const { verificationStatus, userId, userName, userEmail } = useAuthStore((s) => ({
    verificationStatus: s.verificationStatus,
    userId: s.userId,
    userName: s.userName,
    userEmail: s.userEmail,
  }));
  const addProperty = usePropertyStore((s) => s.addProperty);
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    propertyType: '',
    suburb: '',
    city: 'Harare',
    price: '',
    deposit: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    sizeSqm: '',
    furnished: '',
    amenities: [] as string[],
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    availability: 'available',
  });

  const updateForm = (key: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const canGoNext = () => {
    if (step === 0) return form.propertyType && form.suburb && form.price;
    if (step === 1) return form.bedrooms && form.bathrooms && form.description.trim();
    if (step === 3) return photos.length > 0;
    if (step === 4) return form.contactName.trim() && form.contactPhone.trim();
    return true;
  };

  const handlePickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.9,
      selectionLimit: 10,
    });

    if (!result.canceled) {
      setPhotos(result.assets.map((asset) => asset.uri));
      setSubmitError(null);
    }
  };

  const handlePublish = async () => {
    if (!userId || verificationStatus !== 'verified' || publishing) {
      return;
    }

    setPublishing(true);
    setSubmitError(null);

    try {
      const propertyType = PROPERTY_TYPE_MAP[form.propertyType] ?? 'house';
      const parkingSpaces = Number(form.parking || '0');
      const property: Property = {
        id: `custom_${Date.now()}`,
        title: `${form.bedrooms}-Bed ${form.propertyType} in ${form.suburb}`,
        suburb: form.suburb.trim(),
        city: form.city.trim(),
        address: `${form.suburb.trim()}, ${form.city.trim()}`,
        price: Number(form.price || '0'),
        priceUnit: 'month',
        deposit: Number(form.deposit || '0'),
        propertyType,
        type: propertyType === 'studentRoom' ? 'student_room' : propertyType,
        listingType: 'rent',
        category: propertyType === 'studentRoom' ? 'student' : 'rent',
        bedrooms: Number(form.bedrooms || '0'),
        bathrooms: Number(form.bathrooms || '0'),
        parking: parkingSpaces > 0,
        parkingSpaces,
        sizeSqm: Number(form.sizeSqm || '0'),
        description: form.description.trim(),
        images: photos,
        amenities: {
          wifi: form.amenities.includes('WiFi'),
          backupPower: form.amenities.includes('Backup Power'),
          borehole: form.amenities.includes('Borehole'),
          generator: form.amenities.includes('Generator'),
          security: form.amenities.includes('Security'),
          cctv: form.amenities.includes('CCTV'),
          pool: form.amenities.includes('Pool'),
          gym: form.amenities.includes('Gym'),
          parking: form.amenities.includes('Parking') || parkingSpaces > 0,
          garden: form.amenities.includes('Garden'),
          servantQuarters: false,
          aircon: false,
          petsAllowed: false,
          furnished:
            form.furnished === 'Furnished'
              ? 'furnished'
              : form.furnished === 'Unfurnished'
                ? 'unfurnished'
                : 'either',
        },
        availability: form.availability as Property['availability'],
        featured: false,
        verified: verificationStatus === 'verified',
        landlord: {
          id: userId,
          name: form.contactName.trim() || userName || 'Landlord',
          phone: form.contactPhone.trim(),
          whatsapp: form.contactPhone.trim(),
          email: form.contactEmail.trim() || userEmail || 'landlord@dreamhouse.app',
          verified: verificationStatus === 'verified',
        },
        createdAt: new Date().toISOString(),
        views: 0,
        saves: 0,
      };

      await addProperty(property);
      router.replace('/landlord/dashboard');
    } catch {
      setSubmitError('We could not publish the listing right now. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepLabel}>Property Type</Text>
            <View style={styles.chipGrid}>
              {PROPERTY_TYPES.map((t) => (
                <FilterChip
                  key={t}
                  label={t}
                  selected={form.propertyType === t}
                  onPress={() => updateForm('propertyType', t)}
                />
              ))}
            </View>
            <FormField label="Suburb" value={form.suburb} onChangeText={(v) => updateForm('suburb', v)} placeholder="e.g. Borrowdale" />
            <FormField label="City" value={form.city} onChangeText={(v) => updateForm('city', v)} placeholder="e.g. Harare" />
            <FormField label="Monthly Rent (USD)" value={form.price} onChangeText={(v) => updateForm('price', v)} placeholder="e.g. 1200" keyboardType="numeric" />
            <FormField label="Deposit (USD)" value={form.deposit} onChangeText={(v) => updateForm('deposit', v)} placeholder="e.g. 2400" keyboardType="numeric" />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <FormField label="Bedrooms" value={form.bedrooms} onChangeText={(v) => updateForm('bedrooms', v)} placeholder="e.g. 3" keyboardType="numeric" />
            <FormField label="Bathrooms" value={form.bathrooms} onChangeText={(v) => updateForm('bathrooms', v)} placeholder="e.g. 2" keyboardType="numeric" />
            <FormField label="Parking Spaces" value={form.parking} onChangeText={(v) => updateForm('parking', v)} placeholder="e.g. 1" keyboardType="numeric" />
            <FormField label="Size (sqm)" value={form.sizeSqm} onChangeText={(v) => updateForm('sizeSqm', v)} placeholder="e.g. 150" keyboardType="numeric" />
            <Text style={styles.stepLabel}>Furnished Status</Text>
            <View style={styles.chipRow}>
              {['Furnished', 'Unfurnished', 'Either'].map((f) => (
                <FilterChip key={f} label={f} selected={form.furnished === f} onPress={() => updateForm('furnished', f)} />
              ))}
            </View>
            <FormField
              label="Description"
              value={form.description}
              onChangeText={(v) => updateForm('description', v)}
              placeholder="Describe the property, highlights, and nearby amenities"
              multiline
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepLabel}>Select Amenities</Text>
            <View style={styles.chipGrid}>
              {AMENITY_OPTIONS.map((a) => (
                <FilterChip
                  key={a}
                  label={a}
                  selected={form.amenities.includes(a)}
                  onPress={() => toggleAmenity(a)}
                />
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepLabel}>Photos</Text>
            <TouchableOpacity style={styles.photoPicker} activeOpacity={0.8} onPress={handlePickPhotos}>
              <Ionicons name="camera-outline" size={32} color={Colors.textMuted} />
              <Text style={styles.photoPickerText}>{photos.length > 0 ? `${photos.length} photo${photos.length === 1 ? '' : 's'} selected` : 'Tap to add photos'}</Text>
              <Text style={styles.photoPickerHint}>Up to 10 photos. First photo is cover.</Text>
            </TouchableOpacity>
            {photos.length > 0 ? (
              <View style={styles.photoMetaRow}>
                {photos.slice(0, 3).map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.photoMetaPill}>
                    <Ionicons name="image-outline" size={12} color={Colors.emerald} />
                    <Text style={styles.photoMetaText}>Photo {index + 1}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <FormField label="Your Name" value={form.contactName} onChangeText={(v) => updateForm('contactName', v)} placeholder="Full name" />
            <FormField label="Phone / WhatsApp" value={form.contactPhone} onChangeText={(v) => updateForm('contactPhone', v)} placeholder="+263 77 XXX XXXX" keyboardType="phone-pad" />
            <FormField label="Email (optional)" value={form.contactEmail} onChangeText={(v) => updateForm('contactEmail', v)} placeholder="you@email.com" keyboardType="email-address" />
            <Text style={styles.stepLabel}>Availability</Text>
            <View style={styles.chipRow}>
              {(['available', 'reserved'] as const).map((a) => (
                <FilterChip key={a} label={a.charAt(0).toUpperCase() + a.slice(1)} selected={form.availability === a} onPress={() => updateForm('availability', a)} />
              ))}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.reviewTitle}>Review Your Listing</Text>
            <ReviewRow label="Type" value={form.propertyType} />
            <ReviewRow label="Location" value={`${form.suburb}, ${form.city}`} />
            <ReviewRow label="Price" value={`$${form.price}/mo`} />
            <ReviewRow label="Beds / Baths" value={`${form.bedrooms} bed / ${form.bathrooms} bath`} />
            <ReviewRow label="Amenities" value={form.amenities.join(', ') || 'None'} />
            <ReviewRow label="Contact" value={form.contactName || 'Not set'} />

            {verificationStatus !== 'verified' ? (
              <View style={styles.lockedCard}>
                <Ionicons name="lock-closed" size={28} color={Colors.gold400} />
                <Text style={styles.lockedTitle}>Listing Locked</Text>
                <Text style={styles.lockedBody}>
                  You must complete identity verification before publishing any properties.
                </Text>
                <TouchableOpacity
                  style={styles.lockedCtaWrap}
                  onPress={() => router.push('/landlord/verification')}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={Gradients.gold}
                    style={styles.lockedCtaGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.lockedCtaText}>Verify My Identity</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.publishNote}>
                Publishing costs $5. Your listing will go live immediately after payment.
              </Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{Strings.landlord.newListing.title}</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Step Indicators */}
      <View style={styles.stepIndicators}>
        {STEPS.map((s, i) => (
          <TouchableOpacity
            key={s}
            style={[styles.stepDot, i <= step && styles.stepDotActive, i === step && styles.stepDotCurrent]}
            onPress={() => i < step && setStep(i)}
          >
            {i < step ? (
              <Ionicons name="checkmark" size={10} color={Colors.background} />
            ) : (
              <Text style={[styles.stepDotText, i === step && styles.stepDotTextActive]}>{i + 1}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.stepTitle}>{STEPS[step]}</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
        {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.backStepBtn}
            onPress={() => setStep((s) => s - 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.backStepText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, !canGoNext() && styles.nextBtnDisabled, step === 0 && styles.nextBtnFull]}
          onPress={() => {
            if (step < STEPS.length - 1) {
              setStep((s) => s + 1);
            } else if (verificationStatus === 'verified') {
              handlePublish();
            }
          }}
          disabled={publishing || !canGoNext() || (step === STEPS.length - 1 && verificationStatus !== 'verified')}
          activeOpacity={0.85}
        >
          {publishing ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.nextBtnText}>
              {step === STEPS.length - 1
                ? verificationStatus === 'verified'
                  ? Strings.landlord.newListing.publish
                  : 'Verification Required'
                : 'Continue'}
            </Text>
          )}
          {!publishing && step < STEPS.length - 1 && (
            <Ionicons name="arrow-forward" size={18} color={Colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  multiline?: boolean;
}) {
  return (
    <FormInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={rvStyles.row}>
      <Text style={rvStyles.label}>{label}</Text>
      <Text style={rvStyles.value}>{value}</Text>
    </View>
  );
}

const rvStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  value: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.base,
  },
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
    paddingVertical: Spacing.base,
  },
  headerTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: Colors.emeraldDark,
    borderColor: Colors.emeraldDark,
  },
  stepDotCurrent: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  stepDotText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  stepDotTextActive: {
    color: Colors.white,
  },
  stepTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
  },
  stepContent: {
    gap: Spacing.xs,
  },
  stepLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginBottom: Spacing.base,
  },
  photoPicker: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.xl,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  photoPickerText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  photoPickerHint: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textDisabled,
  },
  photoMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  photoMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.emeraldMuted,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  photoMetaText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  reviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  publishNote: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    textAlign: 'center',
    lineHeight: 20,
  },
  lockedCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.navy50,
    borderWidth: 1.5,
    borderColor: Colors.borderNavy,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  lockedTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  lockedBody: {
    fontFamily: FontFamily.bodyLight,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.6,
  },
  lockedCtaWrap: {
    width: '100%',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  lockedCtaGradient: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  lockedCtaText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  submitError: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    color: Colors.error,
    marginTop: Spacing.base,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.base,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  backStepBtn: {
    flex: 1,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backStepText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  nextBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.emerald,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.base,
  },
  nextBtnFull: {
    flex: 1,
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.base,
    color: Colors.background,
  },
});
