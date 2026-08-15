import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../config/config';

/**
 * Loads the saved chat history from device storage.
 * Returns an empty array if nothing is stored yet or on error.
 */
export async function loadHistory() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to load chat history:', err);
    return [];
  }
}

/**
 * Persists the given messages array to device storage.
 */
export async function saveHistory(messages) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.warn('Failed to save chat history:', err);
  }
}

/**
 * Clears all saved chat history.
 */
export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear chat history:', err);
  }
}
