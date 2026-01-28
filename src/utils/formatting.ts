/**
 * Text Formatting Utilities
 * Pure text transformation functions
 */

import { PRESERVED_ACRONYMS, LOWERCASE_WORDS } from '../constants';

/**
 * Convert string to smart title case, preserving acronyms and handling lowercase words
 *
 * Examples:
 * - "director of marketing" → "Director of Marketing"
 * - "VP of iOS engineering" → "VP of iOS Engineering"
 * - "senior b2b account manager" → "Senior B2B Account Manager"
 *
 * @param str - String to convert
 * @returns Title-cased string with preserved acronyms
 */
export function toSmartTitleCase(str: string): string {
  if (!str || typeof str !== 'string') return str;

  // Split into words
  const words = str.toLowerCase().split(/\s+/);

  // Process each word
  const result = words.map((word, index) => {
    // Always capitalize first word
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Check if it's a lowercase word
    if ((LOWERCASE_WORDS as readonly string[]).includes(word)) {
      return word;
    }

    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  // Restore preserved acronyms
  let finalResult = result;
  PRESERVED_ACRONYMS.forEach(acronym => {
    const regex = new RegExp('\\b' + acronym + '\\b', 'gi');
    finalResult = finalResult.replace(regex, acronym);
  });

  return finalResult;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize phone number for tel: links
 * Removes all characters except digits and +
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number (e.g., "+15125551234")
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Auto-generate email prefix from full name
 *
 * Examples:
 * - "John Smith" → "john.smith"
 * - "Jane Doe III" → "jane.doe"
 * - "Alice" → "alice"
 *
 * @param fullName - Full name to convert
 * @returns Email prefix (e.g., "john.smith")
 */
export function generateEmailPrefix(fullName: string): string {
  const cleaned = fullName.trim().toLowerCase();
  const parts = cleaned.split(/\s+/);

  if (parts.length >= 2) {
    const first = parts[0].replace(/[^a-z]/g, '');
    const last = parts[parts.length - 1].replace(/[^a-z]/g, '');
    return `${first}.${last}`;
  } else if (parts.length === 1 && parts[0]) {
    return parts[0].replace(/[^a-z]/g, '');
  }
  return '';
}
