# Accessibility Statement

**Zoho Email Signature Generator** is committed to ensuring digital accessibility for all users, including those with disabilities. We strive to meet **WCAG 2.2 Level AA** standards.

## Compliance Status

**Fully Conformant** - The website fully conforms to WCAG 2.2 Level AA standards.

## Automated Testing

We use **axe-core** via Playwright to automatically test for accessibility violations on every code change. Our test suite includes:

### WCAG 2.2 AA Tests
- ✅ Color contrast (4.5:1 for text, 3:1 for UI components)
- ✅ Keyboard navigation (all interactive elements accessible via keyboard)
- ✅ Focus indicators (visible focus outlines on all interactive elements)
- ✅ Form labels (all inputs have visible labels, not placeholder-only)
- ✅ ARIA attributes (proper ARIA labels on icon buttons and complex UI)
- ✅ Semantic HTML (proper use of `<button>`, `<nav>`, `<main>`, etc.)
- ✅ Alt text on images (all images have descriptive alt text)
- ✅ Modal focus trapping (focus stays within modal when open)
- ✅ Light and dark mode contrast (both themes meet WCAG AA standards)

### Test Coverage
- **102+ unit tests** (Vitest)
- **12 visual regression tests** (Playwright)
- **15+ accessibility tests** (axe-core + keyboard navigation)

Run accessibility tests locally:
```bash
npm run test:a11y
```

## Manual Testing

While automated testing catches ~70% of accessibility issues, we also perform manual testing:

### Screen Reader Testing
- **macOS**: VoiceOver (Safari)
- **Windows**: NVDA (Firefox), JAWS (Chrome)
- **Mobile**: TalkBack (Android), VoiceOver (iOS)

### Keyboard Testing
- All functionality accessible without mouse
- Tab order follows logical flow
- Escape closes modals
- Enter/Space activate buttons
- Focus indicators always visible

### Browser Testing
- Chrome 90+ (April 2021)
- Firefox 88+ (April 2021)
- Safari 14+ (macOS Big Sur, iOS 14+)
- Edge 90+ (Chromium-based)

## Accessibility Features

### Keyboard Navigation
- **Tab** - Navigate through interactive elements
- **Shift+Tab** - Navigate backwards
- **Enter** - Activate buttons/links
- **Space** - Toggle checkboxes/switches
- **Escape** - Close modals

### Screen Reader Support
- All form inputs have visible labels (no placeholder-only)
- Icon-only buttons have ARIA labels
- Form validation errors announced via `aria-live`
- Modal dialogs have proper `role="dialog"` and `aria-labelledby`
- Focus moves to modal when opened
- Focus returns to trigger element when closed

### Visual Design
- **Color contrast**: Meets WCAG AA (4.5:1 text, 3:1 UI)
- **Touch targets**: All interactive elements 44x44px minimum
- **Focus indicators**: Blue outline on all interactive elements (`:focus-visible`)
- **Text resize**: Supports 200% zoom without breaking layout
- **Dark mode**: Available, meets WCAG AA contrast in both themes

### Forms
- All inputs have visible labels (not placeholder-only)
- Validation errors display inline with descriptive messages
- Error messages include examples (e.g., "Email must include @. Example: you@example.com")
- Required fields marked with asterisk (*)
- Input types match data (email, tel, text)

## Known Issues

**None** - All accessibility issues have been resolved as of version 3.4.0.

If you encounter any accessibility barriers, please report them via [GitHub Issues](https://github.com/tejasgadhia/zoho-signature-generator/issues).

## Standards & Guidelines

We follow these accessibility standards:
- **WCAG 2.2 Level AA** (Web Content Accessibility Guidelines)
- **Section 508** (U.S. Federal accessibility standard)
- **ARIA 1.2** (Accessible Rich Internet Applications)

## Testing Tools

Our automated testing stack:
- **axe-core** - WCAG 2.2 compliance testing
- **Playwright** - Keyboard navigation and integration testing
- **Lighthouse CI** - Automated accessibility auditing (90+ score required)

## Feedback

We welcome feedback on the accessibility of this website. If you encounter any accessibility barriers, please contact:

**GitHub Issues**: https://github.com/tejasgadhia/zoho-signature-generator/issues

Include:
- Description of the issue
- Browser/OS/assistive technology used
- Steps to reproduce
- Expected vs actual behavior

We aim to respond within 2 business days and resolve issues within 7 days.

---

**Last Updated**: 2026-02-02 | **Version**: 3.4.0
