export type PropertyType = 'house' | 'apartment' | 'room' | 'townhouse' | 'studentRoom';
export type ListingType = 'rent' | 'buy' | 'shortStay';
export type AvailabilityStatus = 'available' | 'reserved' | 'rented' | 'sold';
export type UserRole = 'renter' | 'buyer' | 'student' | 'landlord' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface VerificationRecord {
  landlordId: string;
  idImageUrl: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}
export type PropertyPriceUnit = 'month' | 'night' | 'week';
export type PropertyCategory = 'rent' | 'sale' | 'short_stay' | 'student';
export type PropertyDataType = 'house' | 'apartment' | 'room' | 'townhouse' | 'student_room';

export interface Landlord {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  verified: boolean;
  avatar?: string;
}

export interface PropertyAmenities {
  wifi: boolean;
  backupPower: boolean;
  borehole: boolean;
  generator: boolean;
  security: boolean;
  cctv: boolean;
  pool: boolean;
  gym: boolean;
  parking: boolean;
  garden: boolean;
  servantQuarters: boolean;
  aircon: boolean;
  petsAllowed: boolean;
  furnished: 'furnished' | 'unfurnished' | 'either';
}

export interface Property {
  id: string;
  title: string;
  suburb: string;
  city: string;
  address: string;
  price: number;
  priceUnit: PropertyPriceUnit;
  deposit: number;
  propertyType: PropertyType;
  type: PropertyDataType;
  listingType: ListingType;
  category: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  parkingSpaces: number;
  sizeSqm: number;
  description: string;
  images: string[];
  amenities: PropertyAmenities;
  availability: AvailabilityStatus;
  featured: boolean;
  verified: boolean;
  landlord: Landlord;
  createdAt: string;
  views: number;
  saves: number;
}

export interface FilterState {
  query: string;
  listingType: ListingType | 'all';
  propertyType: PropertyType | 'all';
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  bathrooms: number | null;
  parking: boolean | null;
  amenities: Partial<PropertyAmenities>;
  furnished: 'furnished' | 'unfurnished' | 'either' | null;
  shortStay: boolean;
}

export interface SubscriptionPlan {
  id: 'free' | 'premium';
  name: string;
  price: number;
  features: string[];
}
