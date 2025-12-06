import React, { createContext, useContext, useMemo } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark';

type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryMuted: string;
  success: string;
  successMuted: string;
  warning: string;
  accent: string;
  danger: string;
  dangerStrong: string;
  dangerMuted: string;
  border: string;
  neutral: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  codeBackground: string;
  codeText: string;
  shadow: string;
};

export type Theme = {
  name: ThemeMode;
  colors: ColorTokens;
  spacing: typeof baseSpacing;
  typography: typeof baseTypography;
  radius: typeof baseRadius;
};

const baseSpacing = {
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

const baseTypography = {
  display: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '700' as const,
    fontSize: 28,
    lineHeight: 36,
  },
  heading: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '700' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  subheading: {
    fontFamily: PRIMARY_FONT,
    fontWeight: '400' as const,
    fontSize: 14,
    lineHeight: 20,
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

const baseRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  pill: 999,
} as const;

const lightColors: ColorTokens = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  primary: '#2563EB',
  primaryMuted: 'rgba(37, 99, 235, 0.08)',
  success: '#22C55E',
  successMuted: '#DCFCE7',
  warning: '#F97316',
  accent: '#FACC15',
  danger: '#DC2626',
  dangerStrong: '#EF4444',
  dangerMuted: '#FEE2E2',
  border: '#CBD5F5',
  neutral: '#1E293B',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textOnPrimary: '#FFFFFF',
  codeBackground: '#0F172A',
  codeText: '#E2E8F0',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

const darkColors: ColorTokens = {
  background: '#0B1221',
  surface: '#111827',
  surfaceMuted: '#1F2937',
  primary: '#2563EB',
  primaryMuted: 'rgba(37, 99, 235, 0.16)',
  success: '#22C55E',
  successMuted: '#16452B',
  warning: '#F97316',
  accent: '#FACC15',
  danger: '#DC2626',
  dangerStrong: '#F87171',
  dangerMuted: '#2F1416',
  border: '#1F2937',
  neutral: '#E2E8F0',
  textPrimary: '#E2E8F0',
  textSecondary: '#94A3B8',
  textOnPrimary: '#FFFFFF',
  codeBackground: '#0B1221',
  codeText: '#E2E8F0',
  shadow: 'rgba(0, 0, 0, 0.35)',
};

const createTheme = (name: ThemeMode, palette: ColorTokens): Theme => ({
  name,
  colors: palette,
  spacing: baseSpacing,
  typography: baseTypography,
  radius: baseRadius,
});

export const lightTheme = createTheme('light', lightColors);
export const darkTheme = createTheme('dark', darkColors);

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const mode: ThemeMode = colorScheme === 'dark' ? 'dark' : 'light';

  const theme = useMemo(
    () => (mode === 'dark' ? darkTheme : lightTheme),
    [mode],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export const useThemedStyles = <T extends StyleSheet.NamedStyles<T> | any>(
  styleCreator: (theme: Theme) => T,
) => {
  const theme = useTheme();
  return useMemo(() => styleCreator(theme), [styleCreator, theme]);
};

export const makeStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleCreator: (theme: Theme) => T,
) => {
  return () => {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(styleCreator(theme)), [theme]);
  };
};

// Backwards compatibility exports for direct imports
export const colors = lightTheme.colors;
export const spacing = lightTheme.spacing;
export const typography = lightTheme.typography;
export const radius = lightTheme.radius;
