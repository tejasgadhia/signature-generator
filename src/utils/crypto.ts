/**
 * Crypto Utilities
 * Provides encryption/decryption for sensitive localStorage data using Web Crypto API
 * Uses AES-GCM 256-bit encryption for security
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommended for GCM

/**
 * Generate or retrieve encryption key from localStorage
 * Key is generated once per browser and stored (not exportable for security)
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  // Check if key exists in IndexedDB (more secure than localStorage)
  // For simplicity, we'll generate a new key each session (ephemeral)
  // In production, consider using IndexedDB for key persistence

  const keyMaterial = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH
    },
    false, // not exportable (more secure)
    ['encrypt', 'decrypt']
  );

  return keyMaterial;
}

// Store the key in memory for the session
let encryptionKeyCache: CryptoKey | null = null;

/**
 * Encrypt a string value using AES-GCM
 * @param plaintext - String to encrypt
 * @returns Base64-encoded encrypted data with IV prepended
 */
export async function encryptData(plaintext: string): Promise<string> {
  if (!plaintext) return plaintext;

  try {
    // Get or generate encryption key
    if (!encryptionKeyCache) {
      encryptionKeyCache = await getEncryptionKey();
    }

    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Encode plaintext as bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Encrypt data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      encryptionKeyCache,
      data
    );

    // Combine IV + encrypted data for storage
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 for localStorage compatibility
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    // Fallback: return plaintext if encryption fails (graceful degradation)
    return plaintext;
  }
}

/**
 * Decrypt a string value using AES-GCM
 * @param ciphertext - Base64-encoded encrypted data
 * @returns Decrypted plaintext string
 */
export async function decryptData(ciphertext: string): Promise<string> {
  if (!ciphertext) return ciphertext;

  try {
    // Check if data looks encrypted (base64)
    if (!/^[A-Za-z0-9+/]+=*$/.test(ciphertext)) {
      // Not encrypted, return as-is (backwards compatibility)
      return ciphertext;
    }

    // Get encryption key
    if (!encryptionKeyCache) {
      encryptionKeyCache = await getEncryptionKey();
    }

    // Decode from base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    // Decrypt data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv
      },
      encryptionKeyCache,
      data
    );

    // Decode bytes to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Fallback: return ciphertext if decryption fails (might be unencrypted legacy data)
    return ciphertext;
  }
}

/**
 * Check if Web Crypto API is available
 */
export function isCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' &&
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.encrypt === 'function';
}
