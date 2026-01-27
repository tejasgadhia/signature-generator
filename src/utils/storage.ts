/**
 * localStorage Wrapper Utilities
 * Type-safe localStorage operations for application state persistence
 */

type Theme = 'dark' | 'light';

/**
 * Get theme preference from localStorage
 * @returns 'dark' if dark mode saved, 'light' otherwise
 */
export function getThemePreference(): Theme {
  const saved = localStorage.getItem('zoho-signature-preview-theme');
  return saved === 'dark' ? 'dark' : 'light';
}

/**
 * Save theme preference to localStorage
 * @param theme - Theme to save ('dark' or 'light')
 */
export function saveThemePreference(theme: Theme): void {
  localStorage.setItem('zoho-signature-preview-theme', theme);
}

/**
 * Get saved accent color from localStorage
 * @returns Saved accent color or default Zoho red
 */
export function getAccentColor(): string {
  return localStorage.getItem('signature-accent-color') || '#E42527';
}

/**
 * Save accent color to localStorage
 * @param color - Hex color string to save
 */
export function saveAccentColor(color: string): void {
  localStorage.setItem('signature-accent-color', color);
}

/**
 * Get format lock state for a field (title case auto-formatting)
 * @param field - Field name ('name', 'title', or 'department')
 * @returns true if format lock enabled (default), false if disabled
 */
export function getFormatLockState(field: string): boolean {
  const saved = localStorage.getItem(`format-lock-${field}`);
  // Default to true (enabled) if not set
  return saved !== 'false';
}

/**
 * Save format lock state for a field
 * @param field - Field name ('name', 'title', or 'department')
 * @param enabled - true to enable format lock, false to disable
 */
export function saveFormatLockState(field: string, enabled: boolean): void {
  localStorage.setItem(`format-lock-${field}`, String(enabled));
}

/**
 * Get saved social channel order from localStorage
 * @returns Array of channel names in custom order, or null if not saved
 */
export function getSocialChannelOrder(): string[] | null {
  const saved = localStorage.getItem('socialChannelOrder');
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

/**
 * Save social channel order to localStorage
 * @param order - Array of channel names in desired order
 */
export function saveSocialChannelOrder(order: string[]): void {
  localStorage.setItem('socialChannelOrder', JSON.stringify(order));
}
