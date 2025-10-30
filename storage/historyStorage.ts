import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizAttempt, QuizAttemptHistory } from '../types/history';

const STORAGE_KEY = 'reactGauge:quizHistory';

export async function loadHistory(): Promise<QuizAttemptHistory> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as QuizAttemptHistory;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    console.warn('[ReactGauge] Failed to load history', error);
    return [];
  }
}

export async function saveHistory(history: QuizAttemptHistory): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('[ReactGauge] Failed to persist history', error);
  }
}

export async function appendAttempt(attempt: QuizAttempt): Promise<QuizAttemptHistory> {
  const existing = await loadHistory();
  const next = [attempt, ...existing];
  await saveHistory(next);
  return next;
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('[ReactGauge] Failed to clear history', error);
  }
}
