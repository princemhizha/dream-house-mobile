// -- EMERALD SCALE (brand palette) --
const emerald950 = '#022614';
const emerald900 = '#043D21';
const emerald800 = '#075235';
const emerald700 = '#0A6E47';
const emerald600 = '#0D8A59';
const emerald500 = '#0FA36A';
const emerald400 = '#26C281';
const emerald300 = '#5FCFA0';
const emerald200 = '#A3E1C6';
const emerald100 = '#D1F0E2';
const emerald50  = '#F0FAF6';

// -- LUXURY GREEN (deep premium primary) --
const luxuryGreen  = '#0F6A3D';
const luxuryMid    = '#1A7B47';
const luxuryLight  = '#DFF4E8';
const luxuryDark   = '#073D22';

// -- DARK SURFACE SCALE (kept for image overlays) --
const deepDark  = '#0C1A12';
const darkBase  = '#111A15';
const darkRaised = '#162010';
const darkHigh  = '#1D2B1F';

// -- GOLD SCALE (premium accents) --
const gold400 = '#C9A84C';
const gold300 = '#D9BB6E';
const gold200 = '#EDD49A';
const gold500 = '#B8962E';
const gold600 = '#8A6E1A';

export const Colors = {
  // -- EMERALD SCALE --
  emerald950,
  emerald900,
  emerald800,
  emerald700,
  emerald600,
  emerald500,
  emerald400,
  emerald300,
  emerald200,
  emerald100,
  emerald50,

  // -- LUXURY GREEN --
  luxuryGreen,
  luxuryMid,
  luxuryLight,
  luxuryDark,

  // -- DARK SURFACE SCALE (available for image overlays) --
  deepDark,
  darkBase,
  darkRaised,
  darkHigh,

  // -- GOLD SCALE --
  gold400,
  gold300,
  gold200,
  gold500,
  gold600,
  gold100: '#F5EDD0',

  // ====================================================
  // SEMANTIC TOKENS — White + Luxury Green design system
  // ====================================================

  // Surfaces
  background:    '#FFFFFF',
  backgroundAlt: '#F8F9FA',
  surface:       '#FFFFFF',
  surfaceRaised: '#F6FAF7',
  surfaceHigh:   '#EEF7EF',

  // Text
  textPrimary:   '#1A1A1A',
  textBody:      '#2E2E2E',
  textSecondary: '#6E6E6E',
  textMuted:     '#9A9A9A',
  textDisabled:  '#BCBCBC',
  textInverse:   '#FFFFFF',
  textNavy:      luxuryGreen,

  // Borders
  borderSubtle:  '#F0F0F0',
  borderDefault: '#E8E8E8',
  borderStrong:  '#CDCDCD',
  borderNavy:    '#DDEEE5',
  borderGold:    'rgba(201,168,76,0.35)' as const,

  // Primary brand
  primaryColor:  luxuryGreen,
  primaryLight:  luxuryLight,
  primaryDark:   luxuryDark,

  // -- STATUS --
  available: luxuryGreen,
  reserved:  '#D97706',
  rented:    '#DC2626',
  sold:      '#6B7280',

  success: luxuryGreen,
  warning: '#D97706',
  error:   '#DC2626',
  info:    luxuryMid,

  // -- OVERLAY / SCRIM --
  scrimLight:  'rgba(0,0,0,0.12)' as const,
  scrimMedium: 'rgba(0,0,0,0.40)' as const,
  scrimHeavy:  'rgba(0,0,0,0.76)' as const,
  scrimWhite:  'rgba(255,255,255,0.90)' as const,

  // -- GLASS / OVERLAY --
  glass:        'rgba(255,255,255,0.96)' as const,
  glassHover:   'rgba(248,250,248,1.0)' as const,
  overlay:      'rgba(0,0,0,0.45)' as const,
  overlayLight: 'rgba(0,0,0,0.15)' as const,

  // -- EMERALD SEMANTIC --
  emerald:        luxuryGreen,
  emeraldPrimary: luxuryGreen,
  emeraldDark:    luxuryDark,
  emeraldMuted:   'rgba(15,106,61,0.08)' as const,
  emeraldGlow:    'rgba(15,106,61,0.18)' as const,
  borderEmerald:  'rgba(15,106,61,0.22)' as const,

  // -- NAVY LEGACY → LUXURY GREEN ALIASES --
  navy50:  emerald50,
  navy100: emerald100,
  navy200: emerald200,
  navy300: emerald300,
  navy400: luxuryGreen,
  navy500: luxuryGreen,
  navy600: luxuryMid,
  navy700: luxuryDark,
  navy800: luxuryDark,
  navy900: luxuryDark,
  navy950: luxuryDark,

  // -- GOLD SEMANTIC --
  gold:        gold400,
  goldLight:   gold300,
  goldMuted:   'rgba(201,168,76,0.12)' as const,
  goldShimmer: 'rgba(201,168,76,0.35)' as const,
  goldGlow:    'rgba(201,168,76,0.20)' as const,

  // -- LEGACY SURFACE ALIASES --
  obsidian:     '#FFFFFF',
  void:         '#F8F9FA',
  cavern:       '#F6FAF7',
  cardBg:       '#FFFFFF',
  cardBgHover:  '#F6FAF7',
  snow:         '#FFFFFF',
  cloud:        '#F6FAF7',
  mist:         '#EEF7EF',
  silver:       '#E8E8E8',
  ash:          '#9A9A9A',
  slate:        '#6E6E6E',
  steel:        '#2E2E2E',
  graphite:     '#1A1A1A',
  ink:          luxuryDark,

  // Legacy borders
  border:       '#E8E8E8',
  borderLight:  '#F0F0F0',

  white: '#FFFFFF',
  black: '#1A1A1A',
  transparent: 'transparent' as const,
} as const;

// -- GRADIENTS --
export const Gradients = {
  // Luxury green — for CTA buttons
  emerald:     [luxuryMid, luxuryGreen] as const,
  emeraldDark: [luxuryGreen, luxuryDark] as const,
  navy:        [luxuryGreen, luxuryDark] as const,
  navyLight:   [luxuryMid, luxuryGreen] as const,
  navyMesh:    [luxuryGreen, luxuryMid, luxuryDark] as const,

  // Gold (unchanged)
  gold: [gold300, gold500] as const,

  // Card/hero image overlays (dark scrim over photos)
  card: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.90)'] as const,
  hero: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.50)', 'rgba(0,0,0,0.92)'] as const,

  // Surface / background
  surface:    ['#FFFFFF', '#F6FAF7'] as const,
  background: ['#FFFFFF', '#F8FAF8', '#FFFFFF'] as const,

  // Soft green tint for banners/highlights
  greenTint:  [luxuryLight, '#C5EDD4'] as const,

  // Premium gold tint
  premium: ['rgba(201,168,76,0.10)', 'rgba(201,168,76,0.02)'] as const,
} as const;

export type ColorKey = keyof typeof Colors;
