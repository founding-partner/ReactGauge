import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/user';

const STORAGE_KEY = 'reactGauge:userProfile';

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as UserProfile;
    if (!parsed || typeof parsed.login !== 'string') {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('[ReactGauge] Failed to load saved profile', error);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile | null): Promise<void> {
  try {
    if (!profile) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('[ReactGauge] Failed to persist profile', error);
  }
}
