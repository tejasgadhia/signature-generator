/**
 * Signature Generator - Main Entry Point
 * Orchestrates signature generation across all styles and components
 */

import type { FormData, SignatureStyle, SocialOptions } from '../types';
import { generateSocialLinks } from './components/social-links';

// Import all style generators
import * as ClassicStyle from './styles/classic';
import * as ProfessionalStyle from './styles/professional';
import * as CompactStyle from './styles/compact';
import * as ModernStyle from './styles/modern';
import * as CreativeStyle from './styles/creative';
import * as MinimalStyle from './styles/minimal';

/**
 * Main SignatureGenerator class
 * Provides static methods for generating email signatures
 */
export class SignatureGenerator {
  /**
   * Generate HTML signature from form data
   */
  static generate(
    data: FormData,
    style: SignatureStyle = 'classic',
    socialOptions: SocialOptions = { enabled: false, channels: [], displayType: 'text' },
    accentColor: string = '#E42527',
    isPreview: boolean = false
  ): string {
    const websiteUrl = data.website || 'https://www.zoho.com';

    // Build Zoho social handles if requested
    let zohoSocialHtml = '';
    if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
      zohoSocialHtml = generateSocialLinks(
        socialOptions.channels,
        socialOptions.displayType,
        accentColor
      );
    }

    // Generate signature based on style
    switch (style) {
      case 'professional':
        return ProfessionalStyle.generate(
          data,
          websiteUrl,
          zohoSocialHtml,
          accentColor,
          isPreview
        );

      case 'minimal':
        return MinimalStyle.generate(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);

      case 'compact':
        return CompactStyle.generate(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);

      case 'modern':
        return ModernStyle.generate(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);

      case 'creative':
        return CreativeStyle.generate(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);

      case 'classic':
      default:
        return ClassicStyle.generate(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
    }
  }

  /**
   * Generate preview HTML
   * Note: Preview container background is controlled by CSS (.preview-container.dark-mode)
   * Signature itself should maintain email-compatible colors (works on both light/dark)
   */
  static generatePreview(
    data: FormData,
    style: SignatureStyle = 'classic',
    socialOptions: SocialOptions = { enabled: false, channels: [], displayType: 'text' },
    accentColor: string = '#E42527'
  ): string {
    if (!data.name) {
      return `
                <div style="text-align: center; padding: 40px 20px; color: #999999;">
                    <p style="font-size: 16px; margin: 0;">Fill in your name to preview the signature</p>
                </div>
            `;
    }

    // Pass isPreview=true to exclude media query dark mode
    return this.generate(data, style, socialOptions, accentColor, true);
  }
}
