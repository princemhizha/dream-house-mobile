export const Strings = {
  app: {
    name: 'Dream House',
    tagline: 'Find your perfect home',
    city: 'Harare',
  },

  nav: {
    home: 'Home',
    search: 'Search',
    saved: 'Saved',
    profile: 'Profile',
  },

  home: {
    greeting: 'Find your perfect home in',
    sections: {
      featured: 'Featured Properties',
      newlyAdded: 'Newly Added',
      trending: 'Trending Now',
      student: 'Student Housing',
    },
    studentBanner: {
      title: 'Student Housing',
      subtitle: 'Affordable rooms near universities',
      cta: 'Browse Rooms',
    },
  },

  filters: {
    all: 'All',
    rent: 'Rent',
    buy: 'Buy',
    student: 'Student',
    shortStay: 'Short Stay',
    budget: 'Budget',
    bedrooms: 'Bedrooms',
    parking: 'Parking',
    wifi: 'WiFi',
    backupPower: 'Backup Power',
    borehole: 'Borehole',
    pets: 'Pets',
    apply: 'Apply Filters',
    reset: 'Reset',
    filters: 'Filters',
    priceRange: 'Price Range',
    propertyType: 'Property Type',
    bathrooms: 'Bathrooms',
    amenities: 'Amenities',
    furnished: 'Furnished',
    unfurnished: 'Unfurnished',
    either: 'Either',
  },

  propertyTypes: {
    house: 'House',
    apartment: 'Apartment',
    room: 'Room',
    townhouse: 'Townhouse',
    studentRoom: 'Student Room',
  },

  amenities: {
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
  },

  availability: {
    available: 'Available',
    reserved: 'Reserved',
    rented: 'Rented',
    sold: 'Sold',
  },

  property: {
    perMonth: '/month',
    beds: 'Beds',
    baths: 'Baths',
    parking: 'Parking',
    size: 'sqm',
    description: 'Description',
    amenities: 'Amenities',
    landlord: 'Listed by',
    verified: 'Verified',
    similar: 'Similar Properties',
    viewingRequest: 'Request Viewing',
    save: 'Save',
    saved: 'Saved',
    share: 'Share',
    unlockContact: 'Unlock Contact Details',
    unlockSubtitle: 'Subscribe to view contact details',
    callNow: 'Call Now',
    whatsapp: 'Chat on WhatsApp',
    email: 'Send Email',
    contactLocked: 'Contact details locked',
  },

  saved: {
    title: 'Saved',
    savedHomes: 'Saved Homes',
    comparison: 'Comparison List',
    empty: 'No saved properties yet',
    emptySubtitle: 'Browse and save properties you love',
    browseCta: 'Browse Properties',
    compareSelected: 'Compare Selected',
    removeHint: 'Swipe left to remove',
  },

  subscription: {
    title: 'Unlock Contacts',
    subtitle: 'Get direct access to landlords',
    free: 'Free',
    premium: 'Premium',
    perMonth: '/month',
    currentPlan: 'Current Plan',
    upgradeCta: 'Upgrade to Premium',
    features: {
      free: ['Browse all properties', 'Save up to 5 properties', 'View property details'],
      premium: [
        'Unlock all contact details',
        'Unlimited saves',
        'Access premium listings',
        'Priority support',
        'WhatsApp landlords directly',
      ],
    },
  },

  onboarding: {
    welcome: 'Welcome to',
    subtitle: 'Zimbabwe\'s premier property marketplace',
    getStarted: 'Get Started',
    roleTitle: 'What brings you here?',
    roleSubtitle: 'We\'ll personalise your experience',
    roles: {
      renting: 'I\'m renting',
      buying: 'I\'m buying',
      student: 'Student housing',
      landlord: 'I\'m a landlord',
    },
  },

  landlord: {
    dashboard: 'My Listings',
    addNew: 'Add New',
    stats: {
      views: 'Total Views',
      saves: 'Saves',
      unlocks: 'Contact Unlocks',
    },
    boost: 'Boost Listing',
    newListing: {
      title: 'New Listing',
      steps: ['Basics', 'Details', 'Amenities', 'Photos', 'Contact', 'Review'],
      publish: 'Pay & Publish',
    },
  },

  errors: {
    generic: 'Something went wrong',
    noResults: 'No properties found',
    noResultsSubtitle: 'Try adjusting your search filters',
    loading: 'Loading...',
  },

  whatsapp: {
    viewingMessage: 'Hi, I\'m interested in viewing the property listed on Dream House. Could we arrange a viewing?',
  },
} as const;
