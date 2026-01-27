/**
 * Logo Components
 * Handles dual logo generation (light/dark modes) for email signatures
 */

/**
 * Get logo URLs for both light and dark modes
 * Uses relative paths for local development and absolute URLs for production
 */
export function getLogoUrls(): { light: string; dark: string } {
  // Check if we're on GitHub Pages or local
  const isProduction = window.location.hostname.includes('github.io');
  const baseUrl = isProduction
    ? 'https://tejasgadhia.github.io/zoho-signature-generator/assets'
    : './assets';

  return {
    light: `${baseUrl}/zoho-logo-light.png`,
    dark: `${baseUrl}/zoho-logo-dark.png`,
  };
}

/**
 * Generate dual logo HTML (light + dark versions)
 * Both logos included, CSS media query controls visibility
 */
export function generateDualLogos(websiteUrl: string, height: number = 32): string {
  const logos = getLogoUrls();
  return `
<a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
    <img src="${logos.light}"
         alt="Zoho"
         class="sig-logo-light"
         style="height: ${height}px; display: block; border: 0;"
         height="${height}">
    <img src="${logos.dark}"
         alt="Zoho"
         class="sig-logo-dark"
         style="height: ${height}px; display: none; border: 0;"
         height="${height}">
</a>`.trim();
}
