// Formatting utilities
export {
  toSmartTitleCase,
  escapeHtml,
  sanitizePhone,
  generateEmailPrefix,
  formatPhoneNumber,
  filterPhoneDigits,
  minifyHtml
} from './formatting';

// URL utilities
export {
  normalizeUrl,
  sanitizeSocialUrl,
  sanitizeUrl,
  cleanLinkedInUrl,
  getTrackedWebsiteURL,
  extractBookingsSlug
} from './url';

// Performance utilities
export { debounce } from './debounce';

// Input validation layer
export { InputValidator, inputValidator } from './input-validator';
