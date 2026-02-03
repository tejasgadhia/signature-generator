# Zoho Email Signature Generator

**Professional email signatures for Zoho employees**

![Version](https://img.shields.io/badge/version-3.2.0-blue.svg) ![License](https://img.shields.io/badge/license-O'Saasy-green.svg)

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator/

---

## Overview

Privacy-first web app for creating professional, email-compatible signatures. Features 6 layout templates, 4 brand colors, dark mode support, and comprehensive accessibility (WCAG 2.2 AA compliant).

**Built with**: TypeScript + Vite, CSS Custom Properties, Modern Development Workflow

---

## Why Use This vs Zoho Mail's Native Editor?

**Zoho Mail has a built-in signature editor. So why use this tool?**

| Feature | This Tool | Zoho Mail Native Editor |
|---------|-----------|------------------------|
| **Professional Templates** | 6 layout options (Classic, Modern, Minimal, etc.) | 1 basic template |
| **Brand Compliance** | Enforces Zoho brand colors & design standards | Freeform editing, inconsistent styles |
| **Dark Mode** | Automatic theme detection in Gmail/Apple Mail | Manual HTML tweaking required |
| **Email Client Testing** | Tested in 9 clients (Gmail, Outlook, Apple Mail, etc.) | No testing guarantees |
| **Privacy** | 100% client-side, no data sent to servers | Unknown data handling |
| **Accessibility** | WCAG 2.2 AA compliant (screen readers, keyboard nav) | Basic accessibility |
| **One-Click Copy** | Copy entire signature with formatting | Manual HTML/CSS editing |
| **UTM Tracking** | Automatic campaign parameters on website links | Manual URL editing |
| **Format Locks** | Prevent accidental capitalization changes | No safeguards |

**TL;DR**: Use this tool for professional, brand-compliant signatures that look consistent across all email clients. Use Zoho Mail's editor for quick, informal signatures without branding requirements.

---

## Key Features

### ✨ Design & Customization
- **6 Signature Layouts** - Classic, Professional, Minimalist, Compact, Modern, Creative
- **4 Zoho Brand Colors** - Red, Green, Blue, Yellow (customizable accent colors)
- **Dark Mode Support** - Gmail, Apple Mail, Outlook (automatic theme detection)
- **370+ Design Tokens** - Comprehensive design system with CSS Custom Properties

### 🎯 Smart Input Features
- **Auto-formatting** - Phone numbers, email addresses, LinkedIn URLs
- **Smart Title Case** - Preserves 18 common acronyms (CEO, VP, iOS, B2B, etc.)
- **UTM Tracking** - Automatic campaign parameters on Zoho website links
- **Real-time Validation** - Instant feedback with WCAG-compliant error messages

### ♿ Accessibility (WCAG 2.2 AA)
- **Contextual Guidance** - URL prefixes, descriptive placeholders, real-time validation feedback
- **Keyboard Navigation** - Full keyboard support (Tab, Space, Enter, Escape)
- **Screen Reader Friendly** - Proper ARIA labels, live regions, semantic HTML
- **Touch-Friendly** - All interactive elements meet 44×44px minimum touch target size

### 🔒 Privacy-First
- **100% Client-Side** - No server communication, no data collection, no tracking
- **Zero Runtime Dependencies** - Pure TypeScript compiled to JavaScript, no external libraries loaded
- **localStorage Only** - Theme preference and color selection saved locally

### 📧 Email Client Compatibility
Tested in **9 email clients**: Gmail, Apple Mail, Outlook (Windows/macOS/Web/iOS/Android), Zoho Mail, Yahoo Mail, ProtonMail, Thunderbird.

**Dark Mode Support**:
- ✅ Gmail (Web + Mobile): Full support
- ✅ Apple Mail (macOS + iOS): Full support
- ⚠️ Outlook Web: Partial support
- ❌ Outlook Desktop: Light mode only

---

## How to Use

1. **Fill in your information** (only Full Name is required)
2. **Toggle optional fields** on/off (Email, Phone, LinkedIn, X, Bookings)
3. **Choose signature style** (6 layout options)
4. **Select accent color** (Red/Green/Blue/Yellow)
5. **Click "Copy Signature"**
6. **Click "How to Import?"** for client-specific instructions (Zoho Mail, Gmail, Apple Mail, Outlook, Zoho Desk)

---

## Troubleshooting

### Common Issues

**Signature not copying**
- ✅ Enable JavaScript
- ✅ Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- ✅ Check clipboard permissions in browser settings

**Toggle switches not working**
- ✅ Enable JavaScript
- ✅ Check browser console for errors
- ✅ Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Preview not updating**
- ✅ Check browser console for errors
- ✅ Verify form values are entered correctly
- ✅ Try toggling dark mode preview

**Signature looks different in email client**
- ✅ Normal behavior - email clients vary in CSS support
- ✅ Core layout and content always preserved
- ✅ Use "How to Import?" for client-specific guidance

---

## Project Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Full version history with detailed release notes
- **[CLAUDE.md](CLAUDE.md)** - Developer guidelines (architecture, patterns, workflows)
- **[LICENSE.md](LICENSE.md)** - O'Saasy License Agreement

---

## Browser Support

### ✅ Supported Browsers

| Browser | Minimum Version | Release Date | Notes |
|---------|----------------|--------------|-------|
| **Chrome** | 90+ | April 2021 | Includes Chromium-based Edge |
| **Firefox** | 88+ | April 2021 | Includes Developer Edition |
| **Safari** | 14+ | September 2020 | macOS Big Sur, iOS 14+ |
| **Edge** | 90+ | April 2021 | Chromium-based only |
| **Mobile Safari** | iOS 14+ | September 2020 | iPhone, iPad |
| **Chrome Mobile** | 90+ | April 2021 | Android |

### ⚠️ Limited/Unsupported

| Browser | Status | Reason |
|---------|--------|--------|
| **Firefox ESR** | ⚠️ May work | ESR 78 (June 2020) supports most features, but untested |
| **Samsung Internet** | ⚠️ May work | Chromium-based, but clipboard API support varies |
| **IE11** | ❌ Not supported | No ES6 modules, no Clipboard API, no CSS Grid |
| **Safari 13** | ❌ Not supported | Missing Clipboard API for HTML content |
| **Chrome <90** | ❌ Not supported | Missing Clipboard API improvements |

### Required Browser Features
- **ES6+ JavaScript**: async/await, modules, arrow functions, template literals
- **CSS Grid & Flexbox**: Layout system
- **CSS Custom Properties**: Design tokens (370+ variables)
- **Clipboard API**: `navigator.clipboard.write()` with HTML blob support
- **localStorage**: Theme and color preference persistence
- **URL API**: Link cleaning and validation

### Graceful Degradation
- **Clipboard API unavailable**: Falls back to `document.execCommand('copy')` (legacy)
- **localStorage blocked**: App works, but theme preference won't persist
- **No JavaScript**: Static content only, no signature generation

### Testing Coverage
**Automated**: 102 Playwright tests (Chrome, Firefox, Safari)
**Manual**: Tested in Gmail, Apple Mail, Outlook (Windows/macOS/Web/iOS/Android), Zoho Mail, Yahoo Mail, ProtonMail, Thunderbird

---

## License

This project is licensed under the [O'Saasy License Agreement](https://osaasy.dev/).

**TL;DR**: You can use, modify, and distribute this project freely. You can self-host it for personal or commercial use. However, you cannot offer it as a competing hosted/managed SaaS product.

See [LICENSE.md](LICENSE.md) for full details.

