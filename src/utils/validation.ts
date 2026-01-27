/**
 * Input Validation Utilities
 * Pure validation functions for form inputs
 */

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number format
 * Accepts formats like: +1 (512) 555-1234, +1-512-555-1234, 512-555-1234, etc.
 * Minimum 10 digits required (excluding country code +)
 * @param phone - Phone number to validate
 * @returns true if phone has at least 10 digits
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters except + at the start
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Check if we have at least 10 digits (US number) or starts with + and has 10+ digits
  return /^\+?\d{10,}$/.test(cleaned);
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns true if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    // Add https:// if missing for validation
    const normalized = url.match(/^https?:\/\//) ? url : 'https://' + url.replace(/^\/+/, '');
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email prefix (before @zohocorp.com)
 * Strict validation: ONLY lowercase letters, numbers, and dots
 * Explicitly disallows: hyphens, underscores, plus signs, uppercase, all other special chars
 *
 * @param prefix - Email prefix to validate
 * @returns Error message if invalid, null if valid
 */
export function validateEmailPrefix(prefix: string): string | null {
  if (!prefix || prefix.length < 2) {
    return 'Email needs at least 2 characters (e.g., js, john.smith)';
  }

  // Strict email prefix validation: ONLY lowercase letters, numbers, and dots
  const prefixRegex = /^[a-z0-9.]+$/;
  if (!prefixRegex.test(prefix)) {
    return 'Use only letters, numbers, and dots (e.g., john.smith or jsmith2)';
  }

  // Check for trailing dots, leading dots, or consecutive dots
  if (prefix.startsWith('.') || prefix.endsWith('.') || prefix.includes('..')) {
    return 'Dots can\'t be at the start, end, or in a row (e.g., john.smith ✓, .john ✗)';
  }

  return null;
}
