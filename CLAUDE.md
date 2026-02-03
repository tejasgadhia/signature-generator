# Zoho Email Signature Generator - Developer Guidelines

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator | **Version**: 3.3.0 | **Updated**: 2026-02-02

Professional, privacy-first web app for Zoho employees. 6 signature templates with Verdana font, 3-tier content hierarchy, 4 accent colors, live preview, one-click copy.

---

## Recent Changes

**Version**: 3.3.0 (2026-02-02) - **Security & Testing Infrastructure**
**Latest**: localStorage encryption with HMAC tamper detection, 102 tests, Playwright visual regression, CI/CD integration
**Previous**: 3.2.0 - Social links drag-drop redesign, YouTube channel
**Full history**: See [CHANGELOG.md](CHANGELOG.md)

---

## Tech Stack

- **Frontend**: TypeScript + Vite
- **Build Tool**: Vite 5.x (module bundler with HMR)
- **Type System**: TypeScript 5.x (full type safety)
- **Styling**: CSS3 with custom properties (370+ design tokens)
- **Browser APIs**: Clipboard API, localStorage, URL API, Web Crypto API
- **Security**: Content Security Policy (CSP), AES-GCM-256 encryption, HMAC-SHA256 tamper detection
- **Deployment**: GitHub Pages (via GitHub Actions, deploying `dist/` folder)
- **CDN**: Cloudflare (free tier, global caching + DDoS protection)
- **Monitoring**: UptimeRobot (5min checks, email/Slack alerts on downtime)

---

## Browser Support

**Minimum Requirements**:
- Chrome 90+ (April 2021)
- Firefox 88+ (April 2021)
- Safari 14+ (September 2020, macOS Big Sur, iOS 14+)
- Edge 90+ (April 2021, Chromium-based only)
- Mobile Safari iOS 14+
- Chrome Mobile 90+

**Unsupported**:
- IE11 (no ES6 modules, no Clipboard API)
- Safari 13 (missing Clipboard API for HTML content)
- Firefox ESR 78 (untested, may work)
- Samsung Internet (untested, may work)

**Required APIs**: ES6+ modules, Clipboard API with HTML blob support, localStorage, CSS Grid, CSS Custom Properties

**Graceful Degradation**: Clipboard API fallback to `execCommand('copy')`, localStorage optional (theme won't persist)

See [README.md](README.md#browser-support) for full compatibility matrix.

---

## Architecture Principles

### Module Organization (TypeScript Modules)

**Entry Point**:
- `src/main.ts` - Application initialization and module wiring

**Core Application**:
- `src/app/state.ts` - Centralized state management with localStorage persistence
- `src/app/form-handler.ts` - Form input handling, validation, and event listeners
- `src/app/preview-renderer.ts` - Live signature preview rendering
- `src/app/clipboard.ts` - Clipboard operations (modern + fallback APIs)

**Signature Generation**:
- `src/signature-generator/index.ts` - Main signature generator interface
- `src/signature-generator/styles/` - Individual signature style implementations
- `src/signature-generator/html-builder.ts` - HTML template utilities

**UI Controllers**:
- `src/ui/modal.ts` - Modal dialog management (import instructions)
- `src/ui/theme.ts` - App-wide theme management (light/dark mode)
- `src/ui/drag-drop.ts` - Drag-and-drop functionality for social channels

**Utilities & Shared**:
- `src/utils/` - Reusable utility functions (title case, URL cleaning, validation)
- `src/utils/crypto.ts` - AES-GCM-256 encryption/decryption (Web Crypto API)
- `src/utils/tamper-detection.ts` - HMAC-SHA256 signature generation/verification
- `src/utils/encrypted-storage.ts` - High-level encrypted localStorage wrapper
- `src/types.ts` - TypeScript type definitions and interfaces
- `src/constants.ts` - Application constants (storage keys, URLs, example data)
- `src/styles/main.css` - Main stylesheet entry point

### State Management
```javascript
const AppState = {
    formData: {},           // User input data
    fieldToggles: {},       // Optional field states
    signatureStyle: '',     // Selected layout
    socialOptions: {},      // Zoho social media config
    accentColor: '#E42527', // Selected brand color (Red/Green/Blue/Yellow)
    isDarkMode: false       // Theme preference
};

// formData includes:
// - website: Tracked URL with UTM params (auto-generated)
// - bookings: Full URL constructed from bookings-id input
```

### localStorage Keys

**Encrypted (AES-GCM-256 + HMAC-SHA256)**:
```javascript
'signature-accent-color'     // Hex color - encrypted to prevent injection
'socialChannelOrder'         // JSON array - encrypted to prevent manipulation
'format-lock-name'           // boolean - encrypted for integrity
'format-lock-title'          // boolean - encrypted for integrity
'format-lock-department'     // boolean - encrypted for integrity
```

**Plaintext (intentionally unencrypted)**:
```javascript
'zoho-signature-preview-theme'  // Theme preference (not sensitive)
'app-schema-version'            // Migration tracking (needed before decryption)
'thanks-count'                  // Easter egg counter (not sensitive)
```

**Security Note**: FormData (name, email, phone) is **transient** and never persisted to localStorage. See [docs/SECURITY.md](docs/SECURITY.md) for details.

### Key Implementation Patterns

**URL Prefix Input**: `<span class="url-prefix">` + `<input>` (user types ID only, JS constructs full URL)

**Smart Title Case**: `toSmartTitleCase()` preserves 18 acronyms (VP, CEO, iOS, API, B2B, etc.)

**UTM Tracking**: `getTrackedWebsiteURL()` adds `utm_source/medium/campaign` params to zoho.com

**Clipboard Operations**: Modern API (`navigator.clipboard.write()` with HTML+text blobs), fallback (`execCommand('copy')`)

**Toggle System**: `setupFieldToggles()` listens to `.toggle-switch input[data-field]`, updates `AppState.fieldToggles`, disables/clears field when off

**Modal System**: `ModalController.open/close()` with backdrop click, Escape key, focus trapping, scroll prevention

**Dark Mode**: Every signature includes dual logos (light/dark), CSS style block, CSS classes on text, inline fallbacks

**Email Client Compatibility**: Table-based HTML (not div), inline styles (no external CSS), maximum compatibility with Gmail/Outlook/Apple Mail

**Validation Error Messages**: Enhanced with visual icons (✓ green valid, ✗ red invalid), improved phrasing (user-friendly + examples), adaptive feedback (icons shown only when field has value), proper ARIA (`aria-describedby`, `aria-invalid`, `aria-live`)

---

## Project-Specific Validation

**Email**: REQUIRED `@zohocorp.com` domain enforcement
```javascript
function isValidEmail(email) {
    return /^[^\s@]+@zohocorp\.com$/i.test(email);
}
```

**Phone**: Format-flexible, minimum 10 digits (excluding + and country code)

**LinkedIn**: URL cleanup removes tracking parameters using URL constructor

---

## Signature Styles

**Classic**: Logo top, vertical stack, formal | **Compact**: Single-line, space-efficient | **Modern**: Logo left, red separator, 2-column | **Minimal**: Text-only, red accent line, no logo | **Professional**: Two-column layout | **Creative**: Bold left accent bar

**Implementation**: `SignatureGenerator.generate()` in `src/signature-generator/index.ts` delegates to individual style modules in `src/signature-generator/styles/` directory. Each style returns table-based HTML with inline styles for maximum email client compatibility.

---

## Development Workflow

### Setup
```bash
npm install             # Install dependencies
```

### Local Development
```bash
npm run dev             # Start Vite dev server (localhost:5173)
```

### Production Build
```bash
npm run build           # Build for production (outputs to dist/)
npm run preview         # Preview production build locally
```

### Type Checking
```bash
npm run type-check      # Run TypeScript compiler (no emit)
```

### Testing Checklist
- [ ] 6 styles render correctly
- [ ] Toggles enable/disable fields
- [ ] Preview updates on input
- [ ] Clipboard copy works (modern + fallback)
- [ ] @zohocorp.com validation enforces domain
- [ ] Dark mode persists across sessions
- [ ] LinkedIn URL cleanup removes tracking
- [ ] Modal keyboard navigation (Escape, Tab)
- [ ] Title case respects format locks
- [ ] UTM tracking added to website URL
- [ ] Drag-drop reorder works
- [ ] Email client testing (Gmail, Outlook, Apple Mail, Thunderbird)
- [ ] Validation icons: Green ✓ for valid (with value), red ✗ for invalid, hidden for empty
- [ ] Error messages: Show red ✗ icon + user-friendly text with examples
- [ ] Accessibility: Lighthouse audit 95+ score, all WCAG 2.2 AA criteria met

### Git Workflow

**Branch Strategy**: main = production (GitHub Pages), feature branches optional, direct commits OK for small fixes

**Commit Convention**: `feat:` | `fix:` | `docs:` | `style:` | `refactor:` | `test:` | `chore:`

---

## Common Tasks

**New Signature Style**:
1. Add `<option>` in HTML style selector
2. Add `case 'new-style':` in signature.js `generate()` function
3. Return table-based HTML with inline styles
4. Test in Gmail, Outlook, Apple Mail

**New Form Field**:
1. Add `<input>` in HTML form section
2. Add toggle switch if optional
3. Update signature generation to include field
4. Update validation if needed

**New Social Channel**:
1. Add to `SOCIAL_CHANNELS` in signature.js
2. Add toggle card in HTML social grid
3. Update `AppState.socialOptions` initialization

---

## GitHub Pages Deployment

**CRITICAL**: `.nojekyll` file required (Jekyll blocks `.ui-design` directory otherwise)

### Automated Deployment Pipeline
Every push to `main` triggers:
1. **Validate** - Check required files (.nojekyll, index.html), Lighthouse CI (90+ scores)
2. **Test** - Run unit tests (102+), visual regression (12), accessibility (15+)
3. **Build** - Compile TypeScript, bundle with Vite
4. **Deploy** - Upload to GitHub Pages

### Pre-Commit Hooks (Husky)
Automatically runs on `git commit`:
- TypeScript type-check (`tsc --noEmit`)
- Lint-staged (validates changed files)

**Bypass if needed**: `git commit --no-verify` (use sparingly)

### Pre-Push Checklist (Automated)
✅ TypeScript compiles (`npm run type-check`)
✅ All tests pass (`npm run test:all`)
✅ Lighthouse scores >90 (automated via CI)
✅ `.nojekyll` exists (checked by validation workflow)
✅ No broken links (checked by validation workflow)

**Manual verification** (optional):
```bash
npm run build      # Build production bundle
npm run preview    # Preview locally
open http://localhost:4173
```

### Monitoring & Uptime
- **Status Page**: `https://stats.uptimerobot.com/[id]` (to be set up)
- **Alerts**: Email/Slack on downtime (5min checks)
- **Uptime Target**: 99.9%
- **Response Time Target**: <500ms

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Cloudflare/UptimeRobot setup.

### Failover Strategy
**Primary**: GitHub Pages + Cloudflare CDN
**Backup**: Netlify (manual deploy)

If GitHub Pages is down:
```bash
npm run build
netlify deploy --prod --dir=dist
```

Update Cloudflare DNS CNAME to point to Netlify URL.

### Common Issues
1. **Dot dirs 404**: Need `.nojekyll` in root
2. **CSS @import fails**: Check relative paths (`../.ui-design/tokens/tokens.css`)
3. **Case sensitivity**: Linux is case-sensitive (use `git ls-files`)
4. **Caching**: Hard refresh (Cmd+Shift+R), wait 2-3min for CDN

### Deployment Testing
```bash
curl -I <url>  # Verify CSS/JS files return 200, not 404
# Check Network tab in browser for any 404s
```

### Rollback
```bash
git revert <hash> && git push origin main
```

---

## Troubleshooting

**Preview not updating**: Check console errors, verify event listeners in `app.js`, inspect `AppState.formData`, check `updatePreview()` called

**Clipboard fails**: HTTPS/localhost required, test fallback, check console, verify permissions

**Email validation strict**: Check `validateEmail()` regex, test `name@zohocorp.com` formats, ensure `/i` flag

**LinkedIn not cleaned**: Verify `cleanLinkedInUrl()` called, check URL format, test various formats

**Dark mode resets**: Check `localStorage.getItem('theme')`, verify `saveDarkMode()`, check privacy settings

**Email client formatting**: Verify inline styles, check table structure, test in client editor, absolute URLs

**Title case fails**: Check lock icon (🔒 = enabled), verify `formatLockState`, check localStorage, ensure blur fires

**Bookings missing**: Check toggle enabled, verify ID entered, check `AppState.formData.bookings`

**Tooltips clipped**: Check `z-index: 1000+`, positioned above icon, no `overflow:hidden` parents

---

## File Change Impact Map

**`index.html`**: Form layout → update CSS selectors, DOM queries in `app.js` → Test: rendering, toggles, buttons

**`js/app.js`**: State/events → preview updates, validation → Test: all interactions

**`js/signature.js`**: HTML output → email compatibility → Test: clipboard, paste in clients

**`css/styles.css`**: Visual only → Test: light/dark, responsive, animations

**`js/modal.js`**: Modal behavior → Test: open/close, keyboard nav

---

## Resources & References

**Docs**: `README.md` (user-facing), `.ui-design/docs/design-system.md` (tokens)

**Design**: `.ui-design/design-system.json` (config), `.ui-design/tokens/tokens.css` (370+ tokens)

**Code**: `signature.js` (generation), `app.js` (state), `modal.js` (UI), `styles.css` (theme/animations)

**External**: [Email HTML Best Practices](https://www.campaignmonitor.com/css/), [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API), [Email Client CSS Support](https://www.caniemail.com/)

---

## Quick Reference

**Feature Dev**: New field/style/component? Email client compatibility? Validation needed?

**Bug Fixes**: Reproducible in console? Browser/client-specific? JS error?

**Design**: Mobile layout? Zoho brand consistency? Dark mode works?

Keep it simple, accessible, email-compatible.
