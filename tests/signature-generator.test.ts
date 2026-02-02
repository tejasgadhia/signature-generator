/**
 * Signature Generator Tests
 * Comprehensive testing for all signature styles and edge cases
 */

import { describe, it, expect } from 'vitest';
import { SignatureGenerator } from '../src/signature-generator';
import type { SignatureStyle, SocialOptions } from '../src/types';
import {
  standardData,
  longNameData,
  allSocialsData,
  minimalData,
  xssData,
  emptyData,
  specialCharsData,
  unicodeData
} from './fixtures/signature-data';

// Test configuration
const accentColors = ['#E42527', '#089949', '#226DB4', '#F9B21D'];
const signatureStyles: SignatureStyle[] = [
  'classic',
  'modern',
  'compact',
  'minimal',
  'professional',
  'creative'
];

const defaultSocialOptions: SocialOptions = {
  enabled: true,
  channels: ['linkedin', 'twitter', 'instagram', 'facebook'],
  displayType: 'text'
};

describe('SignatureGenerator - Structure Validation', () => {
  it('all styles: generate table-based HTML', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toMatch(/^<table/);
      expect(html).toContain('cellpadding="0"');
      expect(html).toContain('cellspacing="0"');
    });
  });

  it('all styles: use inline styles (not external CSS)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should have style attributes
      expect(html).toMatch(/style="[^"]*font-family:/);
      expect(html).toMatch(/style="[^"]*color:/);

      // Should NOT have external stylesheet links
      expect(html).not.toContain('<link rel="stylesheet"');
      expect(html).not.toContain('<style>');
    });
  });

  it('all styles: include Verdana font', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain('Verdana');
    });
  });

  it('all styles: include Zoho logo', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should have logo image
      expect(html).toMatch(/<img[^>]*zoho-logo/i);
    });
  });
});

describe('SignatureGenerator - Dark Mode Support', () => {
  it('all styles: include dark mode CSS when isDarkModePreview=true', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        true
      );

      // Should include dark mode style block
      expect(html).toContain('<style>');
      expect(html).toContain('@media (prefers-color-scheme: dark)');
    });
  });

  it('all styles: include dual logos for light/dark', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        true
      );

      // Should have both light and dark logo variants
      expect(html).toContain('zoho-logo-light');
      expect(html).toContain('zoho-logo-dark');
    });
  });

  it('all styles: include .dark-mode class on text elements', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        true
      );

      expect(html).toMatch(/class="[^"]*dark-mode/);
    });
  });
});

describe('SignatureGenerator - Production URLs', () => {
  it('all styles: use absolute GitHub Pages URLs (not relative)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should use production URLs
      expect(html).toContain('tejasgadhia.github.io/zoho-signature-generator');

      // Should NOT use relative URLs
      expect(html).not.toMatch(/src="\.\/assets/);
      expect(html).not.toMatch(/src="\.\.\/assets/);
    });
  });
});

describe('SignatureGenerator - Edge Cases', () => {
  it('handles long names without breaking layout', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        longNameData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain(longNameData.name);
      expect(html).toMatch(/^<table/); // Still valid table structure
    });
  });

  it('handles all social channels enabled', () => {
    const allSocialOptions: SocialOptions = {
      enabled: true,
      channels: ['linkedin', 'twitter', 'instagram', 'facebook'],
      displayType: 'text'
    };

    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        allSocialsData,
        style,
        allSocialOptions,
        accentColors[0],
        false
      );

      // Should include all social links
      expect(html).toContain('linkedin.com');
      expect(html).toContain('x.com');
      expect(html).toContain('instagram.com');
      expect(html).toContain('facebook.com');
    });
  });

  it('handles minimal data (only required fields)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        minimalData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain(minimalData.name);
      expect(html).toContain(minimalData.email);
      expect(html).toMatch(/^<table/);
    });
  });

  it('handles empty data gracefully', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        emptyData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should still generate valid HTML structure
      expect(html).toMatch(/^<table/);
      expect(html).toContain('zoho-logo');
    });
  });

  it('handles special characters (apostrophes, hyphens, ampersands)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        specialCharsData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should escape HTML entities
      expect(html).toContain('&');
      expect(html).not.toContain('R&D">'); // Should be properly escaped
    });
  });

  it('handles Unicode characters and emoji', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        unicodeData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain('田中');
      expect(html).toContain('🚀');
    });
  });
});

describe('SignatureGenerator - Security (XSS Prevention)', () => {
  it('escapes HTML in user input fields', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain unescaped script tags
      expect(html).not.toMatch(/<script[^>]*>(?!<)/);

      // Should escape < and >
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');

      // Should escape quotes in attributes
      expect(html).not.toContain('"><script>');
    });
  });

  it('blocks javascript: URLs in links', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain javascript: protocol
      expect(html).not.toMatch(/href="javascript:/i);
    });
  });

  it('blocks data: URLs in links', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain data: protocol
      expect(html).not.toMatch(/href="data:/i);
    });
  });

  it('sanitizes onerror and other event handlers', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain event handlers
      expect(html).not.toMatch(/onerror=/i);
      expect(html).not.toMatch(/onclick=/i);
      expect(html).not.toMatch(/onload=/i);
    });
  });
});

describe('SignatureGenerator - Accent Colors', () => {
  it('applies custom accent colors correctly', () => {
    accentColors.forEach(color => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        color,
        false
      );

      // Should contain the accent color in styles
      expect(html).toContain(color);
    });
  });
});

describe('SignatureGenerator - Snapshot Tests', () => {
  describe('Classic Style', () => {
    it('classic: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('classic: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Modern Style', () => {
    it('modern: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'modern',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('modern: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'modern',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Compact Style', () => {
    it('compact: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'compact',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('compact: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'compact',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Minimal Style', () => {
    it('minimal: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'minimal',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('minimal: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'minimal',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Professional Style', () => {
    it('professional: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'professional',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('professional: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'professional',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Creative Style', () => {
    it('creative: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'creative',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('creative: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'creative',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });
});
