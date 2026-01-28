/**
 * Executive Signature Style (Legacy)
 * Large name, center-aligned, minimal info, accent line, no social media
 * Target: VPs, C-Suite, Senior Leadership
 */

import type { FormData } from '../../types';
import { escapeHtml, sanitizePhone } from '../../utils';
import { getDarkModeStyles } from '../components/dark-mode';
import { getLogoUrls } from '../components/logos';

export function generate(
  data: FormData,
  websiteUrl: string,
  accentColor: string,
  isPreview: boolean
): string {
  const logos = getLogoUrls();

  return (
    getDarkModeStyles(isPreview) +
    `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto;">
    <tr>
        <td style="padding: 20px 0; text-align: center;">
            <!-- Name (large, bold) -->
            <div class="sig-name" style="font-size: 20px; font-weight: 700; color: #000000; margin-bottom: 4px;">
                ${escapeHtml(data.name)}
            </div>

            <!-- Accent line below name -->
            <div style="width: 60px; height: 2px; background: ${accentColor}; margin: 8px auto 12px auto;"></div>

            <!-- Title (if provided) -->
            ${
              data.title
                ? `
            <div class="sig-title" style="font-size: 14px; color: #666666; margin-bottom: 12px;">
                ${escapeHtml(data.title)}
            </div>
            `
                : ''
            }

            <!-- Logo -->
            <div style="margin: 16px 0;">
                <a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
                    <img src="${logos.light}"
                         alt="Zoho"
                         class="sig-logo-light"
                         style="height: 40px; display: block; border: 0;"
                         height="40">
                    <img src="${logos.dark}"
                         alt="Zoho"
                         class="sig-logo-dark"
                         style="height: 40px; display: none; border: 0;"
                         height="40">
                </a>
            </div>

            <!-- Contact info (vertical stack, centered) -->
            ${
              data.email
                ? `
            <div style="margin-bottom: 4px;">
                <a href="mailto:${escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">
                    ${escapeHtml(data.email)}
                </a>
            </div>
            `
                : ''
            }

            ${
              data.phone
                ? `
            <div style="margin-bottom: 4px;">
                <a href="tel:${sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">
                    ${escapeHtml(data.phone)}
                </a>
            </div>
            `
                : ''
            }

            ${
              websiteUrl
                ? `
            <div style="margin-bottom: 4px;">
                <a href="${websiteUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">
                    zoho.com
                </a>
            </div>
            `
                : ''
            }
        </td>
    </tr>
</table>`.trim()
  );
}
