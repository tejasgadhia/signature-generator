/**
 * Minimal Signature Style
 * Text-only, no logo, tighter spacing
 * Best for Engineering, Technical Support, text-focused communication
 */

import type { FormData } from '../../types';
import { escapeHtml } from '../../utils';
import { getDarkModeStyles } from '../components/dark-mode';
import { buildTier1Links, buildTier2Links } from '../components/contact-tiers';

export function generate(
  data: FormData,
  _websiteUrl: string,
  zohoSocialHtml: string,
  accentColor: string,
  isPreview: boolean
): string {
  // Build title line
  const titleParts: string[] = [];
  if (data.title) titleParts.push(escapeHtml(data.title));
  if (data.department) titleParts.push(escapeHtml(data.department));
  const titleLine = titleParts.join(' | ');

  // Tier 1: Primary Contact (Phone + Email)
  const tier1Html = buildTier1Links(data, accentColor);

  // Tier 2: Personal Connections (LinkedIn + X + Bookings)
  const tier2Html = buildTier2Links(data, accentColor);

  return (
    getDarkModeStyles(isPreview) +
    `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333; max-width: 450px;">
    <tr>
        <td>
            <div class="sig-name" style="font-size: 16px; font-weight: bold; color: #333333; margin-bottom: 2px;">
                ${escapeHtml(data.name)}
            </div>
            ${
              titleLine
                ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 8px;">
                ${titleLine}
            </div>
            `
                : ''
            }
            ${
              tier1Html
                ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            `
                : ''
            }
            ${
              tier2Html
                ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            `
                : ''
            }
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim()
  );
}
