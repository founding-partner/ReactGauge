import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguageCode, fallbackLanguage, supportedLanguages } from '../localization/i18n';

const LANGUAGE_KEY = 'reactGauge:language';
const THEME_KEY = 'reactGauge:theme';

const supportedCodes = supportedLanguages.map((lang) => lang.code);

export async function loadLanguagePreference(): Promise<SupportedLanguageCode | null> {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (!stored || !supportedCodes.includes(stored as SupportedLanguageCode)) {
      return null;
    }
    return stored as SupportedLanguageCode;
  } catch (error) {
    console.warn('[ReactGauge] Failed to load language preference', error);
    return null;
  }
}

export async function saveLanguagePreference(language: SupportedLanguageCode): Promise<void> {
  try {
    const nextLanguage = supportedCodes.includes(language) ? language : fallbackLanguage;
    await AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
  } catch (error) {
    console.warn('[ReactGauge] Failed to persist language preference', error);
  }
}

export type StoredThemePreference = 'system' | 'light' | 'dark';

export async function loadThemePreference(): Promise<StoredThemePreference> {
  try {
    const stored = await AsyncStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  } catch (error) {
    console.warn('[ReactGauge] Failed to load theme preference', error);
    return 'system';
  }
}

export async function saveThemePreference(theme: StoredThemePreference): Promise<void> {
  try {
    const next = theme === 'light' || theme === 'dark' ? theme : 'system';
    await AsyncStorage.setItem(THEME_KEY, next);
  } catch (error) {
    console.warn('[ReactGauge] Failed to persist theme preference', error);
  }
}
