/**
 * Dark Mode Component
 * Generates CSS style blocks for dark mode email signatures
 */

/**
 * Generate dark mode CSS style block
 * @param isPreview - If true, only use .dark-mode class (ignore system preference)
 * @returns <style> block with dark mode overrides
 */
export function getDarkModeStyles(isPreview: boolean = false): string {
  if (isPreview) {
    // Preview mode: ONLY respond to .dark-mode class, ignore system preference
    return `
<style>
  /* Dark mode styles - ONLY for preview toggle (ignores system preference) */
  .dark-mode .sig-name { color: #FFFFFF !important; }
  .dark-mode .sig-title { color: #E0E0E0 !important; }
  /* Note: .sig-link uses inline accent color - no override needed */
  .dark-mode .sig-separator { color: #666666 !important; }
  .dark-mode .sig-logo-light { display: none !important; }
  .dark-mode .sig-logo-dark { display: inline-block !important; }

  /* Default: hide dark logo */
  .sig-logo-dark { display: none; }
</style>`.trim();
  } else {
    // Copy mode: Include media query for email clients
    return `
<style>
  /* Dark mode styles - applies when email client uses dark mode */
  @media (prefers-color-scheme: dark) {
    /* Text colors - High contrast for WCAG AA compliance */
    .sig-name { color: #FFFFFF !important; }
    .sig-title { color: #E0E0E0 !important; }
    /* Note: .sig-link uses inline accent color - no override needed */
    .sig-separator { color: #666666 !important; }

    /* Logo switching - hide light, show dark */
    .sig-logo-light { display: none !important; }
    .sig-logo-dark { display: inline-block !important; }
  }

  /* Also apply dark mode when container has .dark-mode class (for preview toggle) */
  .dark-mode .sig-name { color: #FFFFFF !important; }
  .dark-mode .sig-title { color: #E0E0E0 !important; }
  /* Note: .sig-link uses inline accent color - no override needed */
  .dark-mode .sig-separator { color: #666666 !important; }
  .dark-mode .sig-logo-light { display: none !important; }
  .dark-mode .sig-logo-dark { display: inline-block !important; }

  /* Default: hide dark logo */
  .sig-logo-dark { display: none; }
</style>`.trim();
  }
}
