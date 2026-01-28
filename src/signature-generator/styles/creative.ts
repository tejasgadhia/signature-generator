/**
 * Creative Signature Style
 * Thick left accent bar with logo stacked above name
 * Best for Marketing, Design, Events teams
 */

import type { FormData } from '../../types';
import { escapeHtml } from '../../utils';
import { getDarkModeStyles } from '../components/dark-mode';
import { generateDualLogos } from '../components/logos';
import { buildTier1Links, buildTier2Links } from '../components/contact-tiers';

export function generate(
  data: FormData,
  websiteUrl: string,
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
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="width: 4px; background: ${accentColor};">&nbsp;</td>
        <td style="padding-left: 14px; vertical-align: top;">
            <div style="margin-bottom: 10px;">
                ${generateDualLogos(websiteUrl, 32)}
            </div>
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;">
                ${escapeHtml(data.name)}
            </div>
            ${
              titleLine
                ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;">
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
