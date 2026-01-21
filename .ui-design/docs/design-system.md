# Zoho Email Signature Generator - Design System

## Overview

This design system provides the foundation for consistent UI development in the Zoho Email Signature Generator. Built on CSS Custom Properties for maximum compatibility.

**Version**: 1.0.0
**Generated**: 2026-01-21
**Preset**: Standard

---

## Quick Start

Import the tokens in your CSS:

```css
@import '.ui-design/tokens/tokens.css';
```

Or reference individual tokens:

```css
.button {
  background: var(--color-primary-500);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.button:hover {
  background: var(--color-primary-600);
}
```

---

## Colors

### Primary Palette (Zoho Red)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-50` | #FEF2F2 | Backgrounds, hover states |
| `--color-primary-100` | #FEE2E2 | Light backgrounds |
| `--color-primary-200` | #FECACA | Borders, dividers |
| `--color-primary-300` | #FCA5A5 | Disabled states |
| `--color-primary-400` | #F87171 | Icons, secondary elements |
| `--color-primary-500` | #E42527 | **Primary brand color** |
| `--color-primary-600` | #C41F21 | Hover state |
| `--color-primary-700` | #A31B1D | Active/pressed state |
| `--color-primary-800` | #7F1517 | Dark accents |
| `--color-primary-900` | #5C1011 | Very dark accents |
| `--color-primary-950` | #3D0A0B | Near black |

### Neutral Palette (Grays)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | #F9FAFB | Page background (light) |
| `--color-neutral-100` | #F3F4F6 | Card backgrounds |
| `--color-neutral-200` | #E5E7EB | Borders, dividers |
| `--color-neutral-300` | #D1D5DB | Disabled borders |
| `--color-neutral-400` | #9CA3AF | Placeholder text |
| `--color-neutral-500` | #6B7280 | Secondary text |
| `--color-neutral-600` | #4B5563 | Body text |
| `--color-neutral-700` | #374151 | Headings |
| `--color-neutral-800` | #1F2937 | Dark surfaces |
| `--color-neutral-900` | #111827 | Primary text, dark bg |
| `--color-neutral-950` | #030712 | Near black |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | #22C55E | Success messages |
| `--color-success-light` | #DCFCE7 | Success backgrounds |
| `--color-warning` | #F59E0B | Warning messages |
| `--color-warning-light` | #FEF3C7 | Warning backgrounds |
| `--color-error` | #EF4444 | Error messages |
| `--color-error-light` | #FEE2E2 | Error backgrounds |
| `--color-info` | #3B82F6 | Info messages |
| `--color-info-light` | #DBEAFE | Info backgrounds |

### Semantic Aliases

These automatically switch between light and dark mode:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--color-bg` | neutral-50 | neutral-900 |
| `--color-bg-elevated` | white | neutral-800 |
| `--color-surface` | neutral-100 | neutral-800 |
| `--color-border` | neutral-200 | neutral-700 |
| `--color-text-primary` | neutral-900 | neutral-50 |
| `--color-text-secondary` | neutral-600 | neutral-300 |
| `--color-text-muted` | neutral-400 | neutral-500 |

---

## Typography

### Font Families

```css
--font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
--font-family-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

### Font Sizes

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `--font-size-xs` | 0.75rem | 12px | Captions, labels |
| `--font-size-sm` | 0.875rem | 14px | Secondary text |
| `--font-size-base` | 1rem | 16px | Body text |
| `--font-size-lg` | 1.125rem | 18px | Large body |
| `--font-size-xl` | 1.25rem | 20px | Subheadings |
| `--font-size-2xl` | 1.5rem | 24px | Section headings |
| `--font-size-3xl` | 1.875rem | 30px | Page headings |
| `--font-size-4xl` | 2.25rem | 36px | Display |
| `--font-size-5xl` | 3rem | 48px | Hero |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Subheadings |
| `--font-weight-bold` | 700 | Headings |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings |
| `--line-height-snug` | 1.375 | Compact text |
| `--line-height-normal` | 1.5 | Body text |
| `--line-height-relaxed` | 1.625 | Readable paragraphs |
| `--line-height-loose` | 2 | Spacious text |

---

## Spacing

Tailwind-compatible spacing scale based on 4px (0.25rem) increments.

### Numeric Scale

| Token | Size | Pixels |
|-------|------|--------|
| `--spacing-0` | 0 | 0 |
| `--spacing-px` | 1px | 1px |
| `--spacing-0-5` | 0.125rem | 2px |
| `--spacing-1` | 0.25rem | 4px |
| `--spacing-2` | 0.5rem | 8px |
| `--spacing-3` | 0.75rem | 12px |
| `--spacing-4` | 1rem | 16px |
| `--spacing-5` | 1.25rem | 20px |
| `--spacing-6` | 1.5rem | 24px |
| `--spacing-8` | 2rem | 32px |
| `--spacing-10` | 2.5rem | 40px |
| `--spacing-12` | 3rem | 48px |
| `--spacing-16` | 4rem | 64px |
| `--spacing-20` | 5rem | 80px |
| `--spacing-24` | 6rem | 96px |

### Semantic Aliases (Backwards Compatible)

| Token | Maps To | Pixels |
|-------|---------|--------|
| `--spacing-xs` | spacing-2 | 8px |
| `--spacing-sm` | spacing-4 | 16px |
| `--spacing-md` | spacing-6 | 24px |
| `--spacing-lg` | spacing-8 | 32px |
| `--spacing-xl` | spacing-12 | 48px |

---

## Border Radius

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `--radius-none` | 0 | 0 | Sharp corners |
| `--radius-sm` | 0.125rem | 2px | Subtle |
| `--radius-base` | 0.25rem | 4px | Default |
| `--radius-md` | 0.375rem | 6px | Buttons, inputs |
| `--radius-lg` | 0.5rem | 8px | Cards |
| `--radius-xl` | 0.75rem | 12px | Modals |
| `--radius-2xl` | 1rem | 16px | Large cards |
| `--radius-3xl` | 1.5rem | 24px | Hero sections |
| `--radius-full` | 9999px | - | Circles, pills |

---

## Shadows

| Token | Usage |
|-------|-------|
| `--shadow-sm` | Subtle elevation |
| `--shadow-base` | Default cards |
| `--shadow-md` | Dropdowns |
| `--shadow-lg` | Modals |
| `--shadow-xl` | Popovers |
| `--shadow-2xl` | High elevation |
| `--shadow-inner` | Inset elements |
| `--shadow-focus` | Focus rings |

### Example

```css
.card {
  box-shadow: var(--shadow-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.input:focus {
  box-shadow: var(--shadow-focus);
}
```

---

## Animation

### Durations

| Token | Time | Usage |
|-------|------|-------|
| `--duration-fastest` | 50ms | Micro-interactions |
| `--duration-faster` | 100ms | Quick feedback |
| `--duration-fast` | 150ms | Buttons, toggles |
| `--duration-normal` | 200ms | Standard transitions |
| `--duration-slow` | 300ms | Page transitions |
| `--duration-slower` | 400ms | Complex animations |
| `--duration-slowest` | 500ms | Elaborate effects |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-linear` | linear | Continuous motion |
| `--ease-default` | cubic-bezier(0.4, 0, 0.2, 1) | General purpose |
| `--ease-in` | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| `--ease-out` | cubic-bezier(0, 0, 0.2, 1) | Enter animations |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Reversible |

### Transition Shorthands

```css
/* Quick interactions */
transition: all var(--transition-fast);  /* 150ms ease */

/* Standard */
transition: all var(--transition-base);  /* 300ms ease */

/* Smooth */
transition: all var(--transition-slow);  /* 400ms ease */
```

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-0` | 0 | Base |
| `--z-10` | 10 | Elevated |
| `--z-20` | 20 | Higher |
| `--z-dropdown` | 1000 | Dropdowns |
| `--z-sticky` | 1020 | Sticky headers |
| `--z-fixed` | 1030 | Fixed elements |
| `--z-modal-backdrop` | 1040 | Modal backdrops |
| `--z-modal` | 1050 | Modals |
| `--z-popover` | 1060 | Popovers |
| `--z-tooltip` | 1070 | Tooltips |
| `--z-toast` | 2000 | Toast notifications |

---

## Dark Mode

The design system supports automatic dark mode via:

1. **System preference**: Uses `prefers-color-scheme: dark`
2. **Manual toggle**: Add `data-theme="dark"` or `.dark-mode` class to root

### Implementation

```html
<!-- System preference (automatic) -->
<html>

<!-- Force light mode -->
<html data-theme="light">

<!-- Force dark mode -->
<html data-theme="dark">

<!-- Class-based (your current approach) -->
<html class="dark-mode">
```

### JavaScript Toggle

```javascript
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark-mode');
  // Or use data attribute:
  // document.documentElement.dataset.theme =
  //   document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
}
```

---

## Legacy Compatibility

The following aliases maintain backwards compatibility with existing code:

```css
--zoho-red: var(--color-primary-500);
--zoho-red-hover: var(--color-primary-600);
--zoho-red-light: var(--color-primary-50);
```

---

## Breakpoints

Use in media queries (CSS custom properties can't be used in media queries):

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

```css
@media (min-width: 768px) {
  .container {
    max-width: var(--breakpoint-lg);
  }
}
```

---

## File Structure

```
.ui-design/
  design-system.json     # Master configuration
  tokens/
    tokens.css           # CSS custom properties
  docs/
    design-system.md     # This file
```

---

## Regeneration

To update the design system, run:

```
/ui-design:design-system-setup
```

Select "Integrate with existing system" to preserve customizations.
