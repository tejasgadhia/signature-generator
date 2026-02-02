/**
 * Encrypted localStorage Wrapper
 * Provides encryption layer for sensitive data in localStorage
 * Uses Web Crypto API (AES-GCM 256-bit)
 *
 * USAGE GUIDELINES:
 * - Use for sensitive data (PII, credentials, tokens)
 * - Don't use for non-sensitive preferences (theme, UI state)
 * - Currently formData is NOT persisted (good for privacy)
 * - This utility is available if future features need encrypted storage
 */

import { encryptData, decryptData, isCryptoAvailable } from './crypto';

/**
 * Save encrypted data to localStorage
 * @param key - Storage key
 * @param value - Data to encrypt and store
 */
export async function setEncrypted(key: string, value: string): Promise<void> {
  if (!isCryptoAvailable()) {
    console.warn('Crypto API unavailable, storing unencrypted');
    localStorage.setItem(key, value);
    return;
  }

  try {
    const encrypted = await encryptData(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Encryption failed, storing unencrypted:', error);
    localStorage.setItem(key, value);
  }
}

/**
 * Get and decrypt data from localStorage
 * @param key - Storage key
 * @returns Decrypted value or null if not found
 */
export async function getEncrypted(key: string): Promise<string | null> {
  const stored = localStorage.getItem(key);
  if (!stored) return null;

  if (!isCryptoAvailable()) {
    return stored;
  }

  try {
    return await decryptData(stored);
  } catch (error) {
    console.error('Decryption failed, returning raw value:', error);
    return stored;
  }
}

/**
 * Save encrypted JSON object to localStorage
 * @param key - Storage key
 * @param data - Object to encrypt and store
 */
export async function setEncryptedJSON<T>(key: string, data: T): Promise<void> {
  const json = JSON.stringify(data);
  await setEncrypted(key, json);
}

/**
 * Get and decrypt JSON object from localStorage
 * @param key - Storage key
 * @returns Decrypted object or null if not found
 */
export async function getEncryptedJSON<T>(key: string): Promise<T | null> {
  const json = await getEncrypted(key);
  if (!json) return null;

  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * SECURITY NOTE:
 * Currently, only non-sensitive data is stored in localStorage:
 * - Accent color preference (not sensitive)
 * - Social channel order (not sensitive)
 * - Format lock states (not sensitive)
 * - Schema version (not sensitive)
 *
 * FormData (name, email, phone, linkedin) is transient and NOT persisted.
 * This is intentional for privacy - no PII in localStorage.
 *
 * If future features require persisting sensitive data, use these
 * encrypted storage functions instead of direct localStorage access.
 */
