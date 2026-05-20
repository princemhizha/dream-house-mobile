export const fonts = {
  display: {
    regular:  'ChakraPetch_400Regular',
    semiBold: 'ChakraPetch_600SemiBold',
    bold:     'ChakraPetch_700Bold',
  },
  body: {
    light:    'Manrope_300Light',
    regular:  'Manrope_400Regular',
    medium:   'Manrope_500Medium',
    semiBold: 'Manrope_600SemiBold',
    bold:     'Manrope_700Bold',
  },
  mono: {
    regular: 'JetBrainsMono_400Regular',
    medium:  'JetBrainsMono_500Medium',
    bold:    'JetBrainsMono_700Bold',
  },
} as const;

export const FontFamily = {
  // Display (Chakra Petch — tech/luxury titles)
  display:       'ChakraPetch_700Bold',
  displayItalic: 'ChakraPetch_600SemiBold',
  displayBold:   'ChakraPetch_700Bold',
  displayLight:  'ChakraPetch_400Regular',
  serif:         'ChakraPetch_700Bold',

  // Body (Manrope — clean modern text)
  body:        'Manrope_400Regular',
  bodyLight:   'Manrope_300Light',
  bodyMedium:  'Manrope_500Medium',
  bodySemiBold:'Manrope_600SemiBold',
  bodyBold:    'Manrope_700Bold',

  // Mono (JetBrains Mono — pricing/data)
  mono:        'JetBrainsMono_400Regular',
  monoMedium:  'JetBrainsMono_500Medium',
  monoBold:    'JetBrainsMono_700Bold',
} as const;

export const FontSize = {
  '2xs': 10,
  xs:    12,
  sm:    13,
  base:  15,
  md:    16,
  lg:    17,
  xl:    20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
  '5xl': 48,
  '6xl': 60,
} as const;

export const LineHeight = {
  none:    1.0,
  tight:   1.15,
  snug:    1.3,
  normal:  1.5,
  relaxed: 1.65,
  loose:   1.85,
} as const;

export const LetterSpacing = {
  tighter: -0.8,
  tight:   -0.3,
  normal:   0,
  wide:     0.4,
  wider:    1.2,
  widest:   2.5,
  label:    3.0,
  mono:    -0.5,
} as const;
