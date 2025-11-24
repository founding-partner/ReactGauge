import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { resources, AppLanguage } from './resources';

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ta', label: 'தமிழ்' },
] as const;

export type SupportedLanguageCode = (typeof supportedLanguages)[number]['code'];

export const fallbackLanguage: SupportedLanguageCode = 'en';

const supportedCodes = supportedLanguages.map((lang) => lang.code) as SupportedLanguageCode[];

const resolveBestLanguage = (): SupportedLanguageCode => {
  const locales = RNLocalize.getLocales();
  for (const locale of locales) {
    const candidate =
      locale.languageCode ??
      (locale.languageTag ? locale.languageTag.split('-')[0] : undefined);
    if (candidate && supportedCodes.includes(candidate as SupportedLanguageCode)) {
      return candidate as SupportedLanguageCode;
    }
  }
  return fallbackLanguage;
};

const initialLanguage = resolveBestLanguage();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export type TranslationResources = typeof resources;
export type TranslationNamespaces = keyof TranslationResources[AppLanguage];

export default i18n;
