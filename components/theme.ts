import { Platform } from 'react-native';

export const colors = {
  background: '#0F172A',
  surface: '#F1F5F9',
  primary: '#2563EB',
  success: '#22C55E',
  warning: '#F97316',
  accent: '#FACC15',
  border: '#CBD5F5',
  neutral: '#1E293B',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textOnPrimary: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

const PRIMARY_FONT = 'Inter';
const MONO_FONT = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'Courier New',
});

export const typography = {
  display: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '700' as const,
    fontSize: 28,
    lineHeight: 36,
  },
  heading: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '600' as const,
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '400' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '500' as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  mono: {
    fontFamily: MONO_FONT,
    fontSize: 14,
    lineHeight: 20,
  },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 14,
  pill: 999,
} as const;
