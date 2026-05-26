// ─── INTERFACES ───────────────────────────────────────────────────────────────

export interface MockLandlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: 'individual' | 'agency';
  agencyName?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  resubmissionCount: number;
  idImageUrl: string;
  propertiesListed: number;
  joinedAt: string;
  suburb: string;
}

export interface MockActivity {
  id: string;
  action: 'approved' | 'rejected' | 'submitted' | 'viewed' | 'login';
  landlordId?: string;
  landlordName?: string;
  adminName: string;
  timestamp: string;
  note?: string;
}

export interface MockOverviewStats {
  pendingCount: number;
  verifiedToday: number;
  rejectedToday: number;
  totalVerified: number;
  totalLandlords: number;
  totalProperties: number;
  pendingOlderThan24h: number;
  averageReviewTimeHours: number;
}

export interface DayData {
  day: string;
  approved: number;
  rejected: number;
  submitted: number;
}

export interface StatusData {
  status: string;
  count: number;
  percentage: number;
}

export interface SuburbData {
  suburb: string;
  count: number;
}

export interface MockAnalyticsData {
  verificationsByDay: DayData[];
  statusBreakdown: StatusData[];
  registrationsByDay: DayData[];
  topSuburbs: SuburbData[];
}

// ─── HELPERS FOR TIMESTAMP GENERATION ────────────────────────────────────────

const daysAgo = (days: number, hoursOffset = 0): string =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000).toISOString();

const hoursAgo = (hours: number): string =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60 * 1000).toISOString();

// ─── MOCK LANDLORDS ───────────────────────────────────────────────────────────

export const mockLandlords: MockLandlord[] = [
  {
    id: 'landlord_001',
    name: 'Tinashe Moyo',
    email: 'tinashe.moyo@gmail.com',
    phone: '+263 77 123 4567',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(3),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=1',
    propertiesListed: 0,
    joinedAt: daysAgo(5),
    suburb: 'Borrowdale',
  },
  {
    id: 'landlord_002',
    name: 'Rudo Chikwanda',
    email: 'rudo.chikwanda@yahoo.com',
    phone: '+263 71 234 5678',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(6),
    reviewedAt: daysAgo(5),
    reviewedBy: 'James Chirwa',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=2',
    propertiesListed: 4,
    joinedAt: daysAgo(7),
    suburb: 'Avondale',
  },
  {
    id: 'landlord_003',
    name: 'Farai Mutasa',
    email: 'farai.mutasa@gmail.com',
    phone: '+263 73 345 6789',
    accountType: 'individual',
    verificationStatus: 'rejected',
    rejectionReason: 'Photo too blurry to read details',
    submittedAt: daysAgo(4),
    reviewedAt: daysAgo(3),
    reviewedBy: 'System Admin',
    resubmissionCount: 1,
    idImageUrl: 'https://picsum.photos/800/500?random=3',
    propertiesListed: 0,
    joinedAt: daysAgo(5),
    suburb: 'Highlands',
  },
  {
    id: 'landlord_004',
    name: 'Tafadzwa Nyoni',
    email: 'tafadzwa.nyoni@gmail.com',
    phone: '+263 77 456 7890',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(7),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=4',
    propertiesListed: 0,
    joinedAt: daysAgo(3),
    suburb: 'Msasa',
  },
  {
    id: 'landlord_005',
    name: 'Chiedza Makoni',
    email: 'chiedza.makoni@outlook.com',
    phone: '+263 71 567 8901',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(7),
    reviewedAt: daysAgo(6),
    reviewedBy: 'Priya Naidoo',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=5',
    propertiesListed: 7,
    joinedAt: daysAgo(7),
    suburb: 'Greendale',
  },
  {
    id: 'landlord_006',
    name: 'Simbarashe Dube',
    email: 'simba.dube@gmail.com',
    phone: '+263 73 678 9012',
    accountType: 'individual',
    verificationStatus: 'unverified',
    submittedAt: daysAgo(1),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=6',
    propertiesListed: 0,
    joinedAt: daysAgo(1),
    suburb: 'Mount Pleasant',
  },
  {
    id: 'landlord_007',
    name: 'Rutendo Chirwa',
    email: 'rutendo.chirwa@gmail.com',
    phone: '+263 77 789 0123',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(12),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=7',
    propertiesListed: 0,
    joinedAt: daysAgo(2),
    suburb: 'Hatfield',
  },
  {
    id: 'landlord_008',
    name: 'Blessed Nkomo',
    email: 'blessed.nkomo@yahoo.com',
    phone: '+263 71 890 1234',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(5),
    reviewedAt: daysAgo(4),
    reviewedBy: 'James Chirwa',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=8',
    propertiesListed: 3,
    joinedAt: daysAgo(6),
    suburb: 'Waterfalls',
  },
  {
    id: 'landlord_009',
    name: 'Thandiwe Mpofu',
    email: 'thandiwe.mpofu@gmail.com',
    phone: '+263 73 901 2345',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(5),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=9',
    propertiesListed: 0,
    joinedAt: daysAgo(2),
    suburb: 'Borrowdale',
  },
  {
    id: 'landlord_010',
    name: 'Kudakwashe Banda',
    email: 'kuda.banda@gmail.com',
    phone: '+263 77 012 3456',
    accountType: 'individual',
    verificationStatus: 'rejected',
    rejectionReason: 'ID appears expired',
    submittedAt: daysAgo(3),
    reviewedAt: daysAgo(2),
    reviewedBy: 'Priya Naidoo',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=10',
    propertiesListed: 0,
    joinedAt: daysAgo(4),
    suburb: 'Avondale',
  },
  {
    id: 'landlord_011',
    name: 'Nyasha Chiota',
    email: 'nyasha.chiota@outlook.com',
    phone: '+263 71 123 4560',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(6),
    reviewedAt: daysAgo(5),
    reviewedBy: 'System Admin',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=11',
    propertiesListed: 5,
    joinedAt: daysAgo(7),
    suburb: 'Highlands',
  },
  {
    id: 'landlord_012',
    name: 'Takudzwa Sibanda',
    email: 'taku.sibanda@gmail.com',
    phone: '+263 73 234 5601',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(9),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=12',
    propertiesListed: 0,
    joinedAt: daysAgo(3),
    suburb: 'Msasa',
  },
  {
    id: 'landlord_013',
    name: 'Pearl Investments',
    email: 'contact@pearlinvestments.co.zw',
    phone: '+263 77 345 6702',
    accountType: 'agency',
    agencyName: 'Pearl Investments',
    verificationStatus: 'verified',
    submittedAt: daysAgo(7),
    reviewedAt: daysAgo(6),
    reviewedBy: 'James Chirwa',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=13',
    propertiesListed: 12,
    joinedAt: daysAgo(7),
    suburb: 'Greendale',
  },
  {
    id: 'landlord_014',
    name: 'Primrose Mazive',
    email: 'primrose.mazive@gmail.com',
    phone: '+263 71 456 7803',
    accountType: 'individual',
    verificationStatus: 'unverified',
    submittedAt: daysAgo(1),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=14',
    propertiesListed: 0,
    joinedAt: daysAgo(1),
    suburb: 'Mount Pleasant',
  },
  {
    id: 'landlord_015',
    name: 'Fortune Mutendi',
    email: 'fortune.mutendi@outlook.com',
    phone: '+263 73 567 8904',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(5),
    reviewedAt: daysAgo(4),
    reviewedBy: 'Priya Naidoo',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=15',
    propertiesListed: 6,
    joinedAt: daysAgo(6),
    suburb: 'Hatfield',
  },
  {
    id: 'landlord_016',
    name: 'Loveness Ncube',
    email: 'loveness.ncube@gmail.com',
    phone: '+263 77 678 9005',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(2),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=16',
    propertiesListed: 0,
    joinedAt: daysAgo(1),
    suburb: 'Borrowdale',
  },
  {
    id: 'landlord_017',
    name: 'Webster Choto',
    email: 'webster.choto@yahoo.com',
    phone: '+263 71 789 0106',
    accountType: 'individual',
    verificationStatus: 'verified',
    submittedAt: daysAgo(4),
    reviewedAt: daysAgo(3),
    reviewedBy: 'James Chirwa',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=17',
    propertiesListed: 2,
    joinedAt: daysAgo(5),
    suburb: 'Avondale',
  },
  {
    id: 'landlord_018',
    name: 'Harare Estates Ltd',
    email: 'info@harareestates.co.zw',
    phone: '+263 73 890 1207',
    accountType: 'agency',
    agencyName: 'Harare Estates Ltd',
    verificationStatus: 'verified',
    submittedAt: daysAgo(7),
    reviewedAt: daysAgo(6),
    reviewedBy: 'System Admin',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=18',
    propertiesListed: 18,
    joinedAt: daysAgo(7),
    suburb: 'Highlands',
  },
  {
    id: 'landlord_019',
    name: 'Tatenda Mwangi',
    email: 'tatenda.mwangi@gmail.com',
    phone: '+263 77 901 2308',
    accountType: 'individual',
    verificationStatus: 'rejected',
    rejectionReason: 'Name does not match account registration',
    submittedAt: daysAgo(2),
    reviewedAt: daysAgo(1),
    reviewedBy: 'Priya Naidoo',
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=19',
    propertiesListed: 0,
    joinedAt: daysAgo(3),
    suburb: 'Msasa',
  },
  {
    id: 'landlord_020',
    name: 'Chenai Mapfumo',
    email: 'chenai.mapfumo@outlook.com',
    phone: '+263 71 012 3409',
    accountType: 'individual',
    verificationStatus: 'pending',
    submittedAt: hoursAgo(1),
    resubmissionCount: 0,
    idImageUrl: 'https://picsum.photos/800/500?random=20',
    propertiesListed: 0,
    joinedAt: daysAgo(1),
    suburb: 'Greendale',
  },
];

// ─── MOCK ACTIVITY LOG ────────────────────────────────────────────────────────

export const mockActivity: MockActivity[] = [
  {
    id: 'act_001',
    action: 'login',
    adminName: 'System Admin',
    timestamp: hoursAgo(0),
  },
  {
    id: 'act_002',
    action: 'submitted',
    landlordId: 'landlord_020',
    landlordName: 'Chenai Mapfumo',
    adminName: 'System',
    timestamp: hoursAgo(1),
  },
  {
    id: 'act_003',
    action: 'submitted',
    landlordId: 'landlord_016',
    landlordName: 'Loveness Ncube',
    adminName: 'System',
    timestamp: hoursAgo(2),
  },
  {
    id: 'act_004',
    action: 'viewed',
    landlordId: 'landlord_001',
    landlordName: 'Tinashe Moyo',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(2),
  },
  {
    id: 'act_005',
    action: 'submitted',
    landlordId: 'landlord_001',
    landlordName: 'Tinashe Moyo',
    adminName: 'System',
    timestamp: hoursAgo(3),
  },
  {
    id: 'act_006',
    action: 'submitted',
    landlordId: 'landlord_009',
    landlordName: 'Thandiwe Mpofu',
    adminName: 'System',
    timestamp: hoursAgo(5),
  },
  {
    id: 'act_007',
    action: 'viewed',
    landlordId: 'landlord_009',
    landlordName: 'Thandiwe Mpofu',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(5),
  },
  {
    id: 'act_008',
    action: 'submitted',
    landlordId: 'landlord_007',
    landlordName: 'Rutendo Chirwa',
    adminName: 'System',
    timestamp: hoursAgo(12),
  },
  {
    id: 'act_009',
    action: 'login',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(12),
  },
  {
    id: 'act_010',
    action: 'submitted',
    landlordId: 'landlord_012',
    landlordName: 'Takudzwa Sibanda',
    adminName: 'System',
    timestamp: hoursAgo(9),
  },
  {
    id: 'act_011',
    action: 'viewed',
    landlordId: 'landlord_012',
    landlordName: 'Takudzwa Sibanda',
    adminName: 'System Admin',
    timestamp: hoursAgo(8),
  },
  {
    id: 'act_012',
    action: 'submitted',
    landlordId: 'landlord_004',
    landlordName: 'Tafadzwa Nyoni',
    adminName: 'System',
    timestamp: hoursAgo(7),
  },
  {
    id: 'act_013',
    action: 'rejected',
    landlordId: 'landlord_019',
    landlordName: 'Tatenda Mwangi',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(24),
    note: 'Name does not match account registration',
  },
  {
    id: 'act_014',
    action: 'approved',
    landlordId: 'landlord_017',
    landlordName: 'Webster Choto',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(25),
  },
  {
    id: 'act_015',
    action: 'approved',
    landlordId: 'landlord_015',
    landlordName: 'Fortune Mutendi',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(26),
  },
  {
    id: 'act_016',
    action: 'viewed',
    landlordId: 'landlord_019',
    landlordName: 'Tatenda Mwangi',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(27),
  },
  {
    id: 'act_017',
    action: 'login',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(25),
  },
  {
    id: 'act_018',
    action: 'rejected',
    landlordId: 'landlord_010',
    landlordName: 'Kudakwashe Banda',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(30),
    note: 'ID appears expired',
  },
  {
    id: 'act_019',
    action: 'approved',
    landlordId: 'landlord_008',
    landlordName: 'Blessed Nkomo',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(32),
  },
  {
    id: 'act_020',
    action: 'viewed',
    landlordId: 'landlord_008',
    landlordName: 'Blessed Nkomo',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(33),
  },
  {
    id: 'act_021',
    action: 'approved',
    landlordId: 'landlord_011',
    landlordName: 'Nyasha Chiota',
    adminName: 'System Admin',
    timestamp: hoursAgo(35),
  },
  {
    id: 'act_022',
    action: 'submitted',
    landlordId: 'landlord_019',
    landlordName: 'Tatenda Mwangi',
    adminName: 'System',
    timestamp: hoursAgo(36),
  },
  {
    id: 'act_023',
    action: 'viewed',
    landlordId: 'landlord_011',
    landlordName: 'Nyasha Chiota',
    adminName: 'System Admin',
    timestamp: hoursAgo(36),
  },
  {
    id: 'act_024',
    action: 'login',
    adminName: 'System Admin',
    timestamp: hoursAgo(35),
  },
  {
    id: 'act_025',
    action: 'rejected',
    landlordId: 'landlord_003',
    landlordName: 'Farai Mutasa',
    adminName: 'System Admin',
    timestamp: hoursAgo(40),
    note: 'Photo too blurry to read details',
  },
  {
    id: 'act_026',
    action: 'approved',
    landlordId: 'landlord_005',
    landlordName: 'Chiedza Makoni',
    adminName: 'Priya Naidoo',
    timestamp: hoursAgo(42),
  },
  {
    id: 'act_027',
    action: 'submitted',
    landlordId: 'landlord_010',
    landlordName: 'Kudakwashe Banda',
    adminName: 'System',
    timestamp: hoursAgo(44),
  },
  {
    id: 'act_028',
    action: 'approved',
    landlordId: 'landlord_002',
    landlordName: 'Rudo Chikwanda',
    adminName: 'James Chirwa',
    timestamp: hoursAgo(46),
  },
  {
    id: 'act_029',
    action: 'viewed',
    landlordId: 'landlord_003',
    landlordName: 'Farai Mutasa',
    adminName: 'System Admin',
    timestamp: hoursAgo(47),
  },
  {
    id: 'act_030',
    action: 'submitted',
    landlordId: 'landlord_003',
    landlordName: 'Farai Mutasa',
    adminName: 'System',
    timestamp: hoursAgo(48),
  },
];

// ─── MOCK OVERVIEW STATS ──────────────────────────────────────────────────────

const pendingCount = mockLandlords.filter((l) => l.verificationStatus === 'pending').length;
const totalVerified = mockLandlords.filter((l) => l.verificationStatus === 'verified').length;
const totalProperties = mockLandlords.reduce((sum, l) => sum + l.propertiesListed, 0);

export const mockOverviewStats: MockOverviewStats = {
  pendingCount,
  verifiedToday: 4,
  rejectedToday: 2,
  totalVerified,
  totalLandlords: mockLandlords.length,
  totalProperties,
  pendingOlderThan24h: 3,
  averageReviewTimeHours: 6.4,
};

// ─── MOCK ANALYTICS DATA ──────────────────────────────────────────────────────

export const mockAnalyticsData: MockAnalyticsData = {
  verificationsByDay: [
    { day: 'Mon', approved: 3, rejected: 1, submitted: 5 },
    { day: 'Tue', approved: 2, rejected: 0, submitted: 4 },
    { day: 'Wed', approved: 5, rejected: 2, submitted: 8 },
    { day: 'Thu', approved: 4, rejected: 1, submitted: 6 },
    { day: 'Fri', approved: 3, rejected: 1, submitted: 5 },
    { day: 'Sat', approved: 1, rejected: 0, submitted: 2 },
    { day: 'Sun', approved: 2, rejected: 1, submitted: 3 },
  ],
  statusBreakdown: [
    {
      status: 'verified',
      count: totalVerified,
      percentage: Math.round((totalVerified / mockLandlords.length) * 100),
    },
    {
      status: 'pending',
      count: pendingCount,
      percentage: Math.round((pendingCount / mockLandlords.length) * 100),
    },
    {
      status: 'rejected',
      count: mockLandlords.filter((l) => l.verificationStatus === 'rejected').length,
      percentage: Math.round(
        (mockLandlords.filter((l) => l.verificationStatus === 'rejected').length /
          mockLandlords.length) *
          100,
      ),
    },
    {
      status: 'unverified',
      count: mockLandlords.filter((l) => l.verificationStatus === 'unverified').length,
      percentage: Math.round(
        (mockLandlords.filter((l) => l.verificationStatus === 'unverified').length /
          mockLandlords.length) *
          100,
      ),
    },
  ],
  registrationsByDay: [
    { day: 'Mon', approved: 4, rejected: 0, submitted: 4 },
    { day: 'Tue', approved: 3, rejected: 0, submitted: 3 },
    { day: 'Wed', approved: 5, rejected: 0, submitted: 5 },
    { day: 'Thu', approved: 2, rejected: 0, submitted: 2 },
    { day: 'Fri', approved: 3, rejected: 0, submitted: 3 },
    { day: 'Sat', approved: 1, rejected: 0, submitted: 1 },
    { day: 'Sun', approved: 2, rejected: 0, submitted: 2 },
  ],
  topSuburbs: [
    { suburb: 'Borrowdale', count: 4 },
    { suburb: 'Avondale', count: 3 },
    { suburb: 'Highlands', count: 3 },
    { suburb: 'Mount Pleasant', count: 2 },
    { suburb: 'Greendale', count: 3 },
  ],
};

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export const getMockLandlordById = (id: string): MockLandlord | undefined =>
  mockLandlords.find((l) => l.id === id);

export const getPendingLandlords = (): MockLandlord[] =>
  mockLandlords
    .filter((l) => l.verificationStatus === 'pending')
    .sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    );

export const getRelativeTime = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const formatAdminDate = (timestamp: string): string =>
  new Date(timestamp).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
