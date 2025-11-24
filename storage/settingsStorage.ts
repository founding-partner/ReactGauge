import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportedLanguageCode, fallbackLanguage, supportedLanguages } from '../localization/i18n';

const LANGUAGE_KEY = 'reactGauge:language';

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
