/**
 * Bold Signature Style (Legacy)
 * Colored name/title block with contrast-aware text color
 * Target: Marketing, Events Team
 */

import type { FormData, SocialOptions } from '../../types';
import { escapeHtml, sanitizePhone, sanitizeSocialUrl } from '../../utils';
import { getDarkModeStyles } from '../components/dark-mode';
import { getLogoUrls } from '../components/logos';

export function generate(
  data: FormData,
  websiteUrl: string,
  socialOptions: SocialOptions,
  accentColor: string,
  isPreview: boolean
): string {
  const logos = getLogoUrls();

  // Determine text color based on background (yellow needs dark text for contrast)
  const textColor = accentColor === '#F9B21D' ? '#333333' : '#FFFFFF';

  // Build contact links (will be colored in accent color)
  const contacts: string[] = [];
  if (data.email) {
    contacts.push(
      `<a href="mailto:${escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${escapeHtml(data.email)}</a>`
    );
  }
  if (data.phone) {
    contacts.push(
      `<a href="tel:${sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${escapeHtml(data.phone)}</a>`
    );
  }
  if (data.linkedin) {
    const linkedinPath = sanitizeSocialUrl(data.linkedin, 'linkedin.com');
    const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
    contacts.push(
      `<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">LinkedIn</a>`
    );
  }
  if (websiteUrl) {
    contacts.push(
      `<a href="${websiteUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">zoho.com</a>`
    );
  }

  // Build social media icons if enabled
  let socialHtml = '';
  if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
    const socialData: Record<string, { url: string; text: string; icon: string }> = {
      twitter: { url: 'https://x.com/Zoho', text: 'X', icon: '𝕏' },
      linkedin: {
        url: 'https://www.linkedin.com/company/zoho',
        text: 'LinkedIn',
        icon: 'in',
      },
      facebook: { url: 'https://www.facebook.com/zoho', text: 'Facebook', icon: 'f' },
      instagram: {
        url: 'https://www.instagram.com/zoho/',
        text: 'Instagram',
        icon: 'IG',
      },
    };

    const socialLinks = socialOptions.channels
      .map((channel) => {
        const channelData = socialData[channel];
        if (!channelData) return '';

        return `<a href="${channelData.url}" class="sig-link" style="display: inline-block; margin: 0 4px; width: 24px; height: 24px; background: ${accentColor}; color: ${textColor}; text-align: center; line-height: 24px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 600;">${channelData.icon}</a>`;
      })
      .filter((link) => link !== '')
      .join('');

    if (socialLinks) {
      socialHtml = `
                <div style="margin-top: 8px;">
                    ${socialLinks}
                </div>
                `;
    }
  }

  return (
    getDarkModeStyles(isPreview) +
    `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; max-width: 500px;">
    <tr>
        <td style="padding: 12px 0;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                    <!-- Logo (left) -->
                    <td style="width: 60px; vertical-align: middle; padding-right: 12px;">
                        <a href="${websiteUrl}" style="text-decoration: none; display: block;">
                            <img src="${logos.light}"
                                 alt="Zoho"
                                 class="sig-logo-light"
                                 style="height: 32px; display: block; border: 0;"
                                 height="32">
                            <img src="${logos.dark}"
                                 alt="Zoho"
                                 class="sig-logo-dark"
                                 style="height: 32px; display: none; border: 0;"
                                 height="32">
                        </a>
                    </td>

                    <!-- Info block -->
                    <td style="vertical-align: middle;">
                        <!-- Colored name/title block -->
                        <div style="background: ${accentColor}; color: ${textColor}; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px;">
                            <div class="sig-name" style="font-size: 16px; font-weight: 700; margin-bottom: 2px;">
                                ${escapeHtml(data.name)}
                            </div>
                            ${
                              data.title
                                ? `
                            <div class="sig-title" style="font-size: 13px; opacity: 0.9;">
                                ${escapeHtml(data.title)}
                            </div>
                            `
                                : ''
                            }
                        </div>

                        <!-- Contact info (horizontal) -->
                        ${
                          contacts.length > 0
                            ? `
                        <div style="font-size: 13px; color: #666666;">
                            ${contacts.join('<span class="sig-separator" style="margin: 0 6px; color: #CCCCCC;">•</span>')}
                        </div>
                        `
                            : ''
                        }

                        <!-- Social media -->
                        ${socialHtml}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`.trim()
  );
}
