/**
 * Tamper Detection Utilities
 * Provides HMAC-SHA256 signature generation and verification for data integrity
 * Detects if localStorage values have been tampered with
 */

const ALGORITHM = 'HMAC';
const HASH = 'SHA-256';

/**
 * Ephemeral HMAC key stored in memory (not exportable)
 * Generated once per session for signing/verification
 * Does not persist between sessions (intentional for security)
 */
let hmacKeyCache: CryptoKey | null = null;

/**
 * Generate or retrieve HMAC key from memory cache
 * Key is ephemeral (session-only) for enhanced security
 */
async function getHmacKey(): Promise<CryptoKey> {
  if (hmacKeyCache) {
    return hmacKeyCache;
  }

  // Generate ephemeral HMAC key (not exportable)
  hmacKeyCache = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      hash: { name: HASH }
    },
    false, // not exportable (more secure)
    ['sign', 'verify']
  );

  return hmacKeyCache;
}

/**
 * Generate HMAC-SHA256 signature for data
 * @param data - Data to sign
 * @returns Base64-encoded signature
 */
export async function signData(data: string): Promise<string> {
  if (!data) return '';

  try {
    const key = await getHmacKey();
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Generate signature
    const signature = await crypto.subtle.sign(
      ALGORITHM,
      key,
      dataBytes
    );

    // Convert to base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } catch (error) {
    console.error('Failed to sign data:', error);
    return '';
  }
}

/**
 * Verify HMAC-SHA256 signature
 * @param data - Original data
 * @param signature - Base64-encoded signature to verify
 * @returns True if signature is valid, false otherwise
 */
export async function verifySignature(
  data: string,
  signature: string
): Promise<boolean> {
  if (!data || !signature) return false;

  try {
    const key = await getHmacKey();
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Decode signature from base64
    const signatureBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));

    // Verify signature
    return await crypto.subtle.verify(
      ALGORITHM,
      key,
      signatureBytes,
      dataBytes
    );
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
}

/**
 * Combined format for signed data
 * Format: "data|signature" (pipe-separated)
 */
function packSignedData(data: string, signature: string): string {
  return `${data}|${signature}`;
}

/**
 * Extract data and signature from combined format
 * @returns [data, signature] or null if invalid format
 */
function unpackSignedData(packed: string): [string, string] | null {
  const pipeIndex = packed.lastIndexOf('|');
  if (pipeIndex === -1) return null;

  const data = packed.substring(0, pipeIndex);
  const signature = packed.substring(pipeIndex + 1);

  return [data, signature];
}

/**
 * Sign and encrypt data in one operation
 * @param plaintext - Data to sign and encrypt
 * @param encryptFn - Encryption function to use
 * @returns Signed and encrypted data
 */
export async function signAndEncrypt(
  plaintext: string,
  encryptFn: (data: string) => Promise<string>
): Promise<string> {
  if (!plaintext) return plaintext;

  try {
    // First sign the plaintext
    const signature = await signData(plaintext);
    if (!signature) {
      // Signing failed, encrypt without signature
      console.warn('Signing failed, encrypting without signature');
      return await encryptFn(plaintext);
    }

    // Pack data with signature
    const packed = packSignedData(plaintext, signature);

    // Then encrypt the signed data
    return await encryptFn(packed);
  } catch (error) {
    console.error('Sign and encrypt failed:', error);
    // Fallback: encrypt without signature
    return await encryptFn(plaintext);
  }
}

/**
 * Decrypt and verify data in one operation
 * @param ciphertext - Encrypted and signed data
 * @param decryptFn - Decryption function to use
 * @returns Verified plaintext or null if tampered
 */
export async function decryptAndVerify(
  ciphertext: string,
  decryptFn: (data: string) => Promise<string>
): Promise<string | null> {
  if (!ciphertext) return ciphertext;

  try {
    // First decrypt
    const decrypted = await decryptFn(ciphertext);
    if (!decrypted) return null;

    // Try to unpack signed data
    const unpacked = unpackSignedData(decrypted);
    if (!unpacked) {
      // Not in signed format, might be legacy data
      // Return as-is for backward compatibility
      return decrypted;
    }

    const [data, signature] = unpacked;

    // Verify signature
    const isValid = await verifySignature(data, signature);
    if (!isValid) {
      console.warn('Tampered data detected! Signature verification failed.');
      return null; // Return null to indicate tampering
    }

    return data;
  } catch (error) {
    console.error('Decrypt and verify failed:', error);
    return null;
  }
}

/**
 * Check if Web Crypto API supports HMAC
 */
export function isHmacAvailable(): boolean {
  return (
    typeof crypto !== 'undefined' &&
    typeof crypto.subtle !== 'undefined' &&
    typeof crypto.subtle.sign === 'function' &&
    typeof crypto.subtle.verify === 'function'
  );
}

/**
 * Reset the HMAC key cache (useful for testing)
 * WARNING: This will invalidate all existing signatures
 */
export function resetHmacKey(): void {
  hmacKeyCache = null;
}
