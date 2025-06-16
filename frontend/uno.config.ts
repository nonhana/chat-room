import { presetRemToPx } from '@unocss/preset-rem-to-px'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  presets: [
    /* Core Presets */
    presetWind3(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        noto: [
          'Noto Sans:300,400',
          'Noto Sans SC:300,400',
          'Noto Sans TC:300,400',
          'Noto Sans JP:300,400',
        ],
      },
    }),

    /* Community Presets */
    presetRemToPx(),
    presetScrollbar(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#A8E6CF',
        50: '#F5FCF9',
        100: '#E8F8F1',
        200: '#D1F1E3',
        300: '#B9EAD5',
        400: '#A8E6CF',
        500: '#80DBB9',
        600: '#59CFA3',
        700: '#37BE8C',
        800: '#2B976F',
        900: '#206F52',
        950: '#1A5B43',
      },
      secondary: {
        DEFAULT: '#FFD3B6',
        50: '#FFF8F2',
        100: '#FFEEE2',
        200: '#FFE1CC',
        300: '#FFD3B6',
        400: '#FFBF99',
        500: '#FFA877',
        600: '#FF8F55',
        700: '#FF7733',
        800: '#E6601F',
        900: '#B34719',
        950: '#8C3914',
      },
      accent: {
        DEFAULT: '#FF8C94',
        50: '#FFF5F6',
        100: '#FFE8EB',
        200: '#FFD1D5',
        300: '#FFBAC0',
        400: '#FF8C94',
        500: '#FF5E69',
        600: '#FF3040',
        700: '#E01D2C',
        800: '#B31622',
        900: '#8C1019',
        950: '#6E0C14',
      },
      neutral: {
        DEFAULT: '#6B7280',
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#0A0F1A',
      },
      success: {
        DEFAULT: '#81C784',
        50: '#F2FBF5',
        100: '#E6F7EB',
        200: '#C7EED1',
        300: '#A8E6B7',
        400: '#81C784',
        500: '#66B366',
        600: '#4A9951',
        700: '#35793D',
        800: '#265B2E',
        900: '#1A4121',
      },
      warning: {
        DEFAULT: '#FFC107',
        50: '#FFF8E1',
        100: '#FFECB3',
        200: '#FFE082',
        300: '#FFD54F',
        400: '#FFC107',
        500: '#FFA000',
        600: '#FF8F00',
        700: '#FF6F00',
        800: '#E65100',
        900: '#BF360C',
      },
      error: {
        DEFAULT: '#E57373',
        50: '#FBE9E7',
        100: '#FFCCBC',
        200: '#FFAB91',
        300: '#FF8A65',
        400: '#E57373',
        500: '#EF5350',
        600: '#E53935',
        700: '#D32F2F',
        800: '#C62828',
        900: '#B71C1C',
      },
    },
  },
  preflights: [
    {
      getCSS: () => `
        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          @apply contents font-noto;
        }

        #app {
          height: 100vh;
        }
        
        ::selection {
          @apply bg-primary/50 text-primary-900;
        }
      `,
    },
  ],
})
