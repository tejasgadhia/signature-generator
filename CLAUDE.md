# Zoho Email Signature Generator - Developer Guidelines

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator | **Version**: 0.9.0 | **Updated**: 2026-01-24

Professional, privacy-first web app for Zoho employees. 6 signature templates with Verdana font, 3-tier content hierarchy, 4 accent colors, live preview, one-click copy.

---

## Tejas's Workflow Preferences

**IMPORTANT:** Follow these preferences in all development sessions.

### Git Completion Workflow
- **Always choose option 1 (merge locally)** when finishing feature branches
- Never ask for permission - just merge to main automatically
- Clean up worktree and feature branch after merge
- User will push to GitHub Pages when ready

### Development Process
- **Screenshot-driven iteration** - Request screenshots for visual review of UI changes
- **Idiot-proof instructions** - Assume no UI literacy when writing user-facing steps
- **Research current UIs** - Web search for 2026-dated guides before writing instructions
- **Document learnings** - Create comprehensive learnings doc at end of major features (in `docs/learnings/`)

### Communication Style
- **Explanatory mode enabled** - Provide educational insights with code
- **Visual feedback valued** - Screenshots more useful than text descriptions
- **Research appreciated** - User trusts web search verification for accuracy

### Technical Preferences
- **WCAG AAA compliance** - Design for 7:1+ contrast ratios from start
- **Responsive design** - Test from 320px to 1440px
- **No dark mode for site UI** - Only email signature preview has dark mode
- **Accessibility from day one** - Don't retrofit, design it in

### Questions to Ask Upfront
When starting new features, always ask:
1. "Do you want to see a screenshot after initial implementation?"
2. "Should this component use dark mode or always stay light?"
3. "Do you have screenshots of the actual UI?" (if writing instructions)
4. "How detailed should the instructions be?"
5. "What level of accessibility compliance?" (though default to AAA)

---

## Recent Changes

### Current Version: 0.10.0 (2026-01-24)

**Form UX Improvement**: Empty form fields with smart preview (#11)
**Smart Preview**: Shows example signature when name field is empty, switches to user data when name is filled
**Zero Friction**: Click and type immediately, no need to clear pre-filled data
**Example Data**: "Sarah Mitchell" example appears in preview when form is empty
**Logic**: Preview switches based on name field (required field) - if name is empty → example, if name has value → user data
**Backwards Compatible**: All existing features work identically

### Version: 0.9.0 (2026-01-24)

**Template Redesign**: 6 templates with 3-tier content hierarchy (Phone/Email → LinkedIn/X/Bookings → Follow Zoho)
**Typography**: Verdana font across all templates (Zoho Mail default)
**New Templates**: Professional (two-column), Creative (bold left accent bar) - replaced Executive/Bold
**User-Focused Descriptions**: "Best for Sales", "Best for Engineering" instead of design descriptions
**Bug Fixes**: Form data mapping on page load, X/Twitter field rendering, Modern accent bar collapse

**Full version history**: See [CHANGELOG.md](CHANGELOG.md) for complete release notes (v0.1.0 through v0.9.0)

---

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Design System**: CSS Custom Properties (370+ tokens in `.ui-design/`)
- **No Dependencies**: Zero npm packages or build tools
- **Browser APIs**: Clipboard API, localStorage, URL API, URLSearchParams API
- **Deployment**: GitHub Pages (main branch)
- **Version**: 0.9.0

## Architecture Principles

### Module Organization (3 Modules)
1. **signature.js** - Pure utility (signature generation, validation)
2. **app.js** - Application state and orchestration
3. **modal.js** - Modal UI controller

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
```javascript
'theme'                      // 'dark' or null (light mode)
'signature-accent-color'     // Hex color (#E42527, #089949, #226DB4, #F9B21D)
'social-order'               // JSON array of channel order
'format-lock-name'           // boolean (default: true)
'format-lock-title'          // boolean (default: true)
'format-lock-department'     // boolean (default: true)
```

### Dark Mode Implementation
```javascript
// Logo URLs from GitHub Pages
const logos = SignatureGenerator.getLogoUrls();
// {
//   light: "https://tejasgadhia.github.io/zoho-signature-generator/assets/zoho-logo-light.png",
//   dark: "https://tejasgadhia.github.io/zoho-signature-generator/assets/zoho-logo-dark.png"
// }

// Every signature includes:
// 1. Dark mode CSS style block (getDarkModeStyles())
// 2. Dual logos (generateDualLogos())
// 3. CSS classes on all text elements
// 4. Inline styles as fallback
```

### Email Client Compatibility
- **Table-based HTML** (not div-based)
- **Inline styles** (no external CSS)
- **Maximum compatibility** with Gmail, Outlook, Apple Mail, etc.

### Key Implementation Patterns

**URL Prefix Input**: `<span class="url-prefix">` + `<input>` (user types ID only, JS constructs full URL)
**Smart Title Case**: `toSmartTitleCase()` preserves 18 acronyms (VP, CEO, iOS, API, B2B, etc.)
**UTM Tracking**: `getTrackedWebsiteURL()` adds `utm_source/medium/campaign` params to zoho.com
**Tooltips**: Positioned above icons (`bottom: calc(100% + 8px)`), `z-index: 1000` prevents clipping
**Split Buttons**: Flexbox layout, 40px logo wrapper, 12px/16px padding

## Code Conventions

### JavaScript

**Naming**:
- camelCase: `escapeHtml()`, `sanitizePhone()`, `updatePreview()`
- PascalCase for modules: `SignatureGenerator`, `AppState`, `ModalController`
- Descriptive names reflecting functionality

**Module Pattern**:
```javascript
const ModuleName = {
    method1() { /* logic */ },
    method2() { /* logic */ }
};
```

**Key Functions**:
- `SignatureGenerator.generate(data, style, socialOptions)` - Create signature HTML
- `AppState.updatePreview()` - Reactive preview updates
- `ModalController.open(modalId)` - Modal lifecycle management

### Validation

**Email Validation**:
```javascript
function isValidEmail(email) {
    return /^[^\s@]+@zohocorp\.com$/i.test(email);
}
```
- **REQUIRED**: `@zohocorp.com` domain enforcement

**Phone Validation**:
- Format-flexible (accepts various formats)
- Minimum 10 digits (excluding + and country code)

**URL Validation**:
- Uses URL constructor for validation
- Auto-adds `https://` if missing
- LinkedIn URL cleanup (removes tracking parameters)

### CSS

**Design System**:
The project uses a comprehensive design token system located in `.ui-design/tokens/tokens.css`.

```css
/* Import design tokens (already done in styles.css) */
@import '../.ui-design/tokens/tokens.css';

/* Use tokens for colors */
background: var(--color-bg-elevated);
color: var(--color-text-primary);
border: 1px solid var(--color-border);

/* Use tokens for spacing (Tailwind-compatible) */
padding: var(--spacing-4);  /* 16px */
gap: var(--spacing-2);      /* 8px */

/* Use tokens for semantic colors */
background: var(--color-primary-500);  /* Zoho Red */
background: var(--color-success);       /* Green */
background: var(--color-error);         /* Red */
```

**Theme System**:
Semantic color tokens auto-switch between light and dark modes:
- `--color-bg` - Page background
- `--color-bg-elevated` - Cards, modals, inputs
- `--color-text-primary` - Main text
- `--color-text-secondary` - Secondary text
- `--color-border` - Borders and dividers

**Toggle Switches**:
- iOS-style design with CSS pseudo-elements
- Smooth transitions (0.3s)
- Fully keyboard accessible (Enter/Space keys)
- ARIA `role="switch"` and `aria-checked` attributes

## Signature Styles

**Classic**: Logo top, vertical stack, formal | **Compact**: Single-line, space-efficient | **Modern**: Logo left, red separator, 2-column | **Minimal**: Text-only, red accent line, no logo | **Executive**: Centered, large name, accent line | **Bold**: Colored block, rounded corners
**Implementation**: `switch(style)` returns table-based HTML with inline styles

## Clipboard Operations

**Modern**: `navigator.clipboard.write()` with `ClipboardItem` (HTML + plain text blobs)
**Fallback**: `execCommand('copy')` with temp div (IE/old browsers)

## Development Workflow

**Local**: `open index.html` or `npx serve` (no build needed)
**Testing**: 6 styles render, toggles work, preview updates, clipboard copy, @zohocorp.com validation, dark mode persists, LinkedIn cleanup, modal keyboard nav, title case, UTM tracking, drag-drop, email client testing (Gmail/Outlook/Apple Mail/Thunderbird)

## Toggle System

`setupFieldToggles()` listens to `.toggle-switch input[data-field]`, updates `AppState.fieldToggles`, disables/clears field when off, calls `updatePreview()`

## URL Handling

**LinkedIn Cleanup**: `cleanLinkedInUrl()` removes tracking params with URL constructor
**Normalization**: Add `https://` if missing, validate with URL API

## Modal System

`ModalController.open/close()` - backdrop click, Escape key, focus trapping (Tab cycles), body scroll prevention (`overflow: hidden`)

## Best Practices

**DO**: Validate inputs, test in email clients, table-based HTML, inline styles, escape user input, client-side only, test both clipboard methods
**DON'T**: Add dependencies, div layouts for emails, skip validation, store user data, external stylesheets, skip Outlook testing

## Quick Start for Development

**Resume**: `git status`, `git log --oneline -5`, open `index.html`, check `AppState` in console, check localStorage
**Local**: `open index.html` or `npx serve` (no build)
**Testing**: Edit JS/CSS/HTML → Cmd+R → check console → test browsers → test email client

## Common Tasks

**New Style**: Add `<option>` in HTML → Add `case 'new-style'` in `signature.js` (table-based HTML, inline styles) → Test email clients
**New Field**: Add `<input>` in HTML → Add toggle if optional → Update signature generation
**New Social**: Add to `SOCIAL_CHANNELS` in `signature.js` → Add toggle card in `index.html` → Update `AppState.socialOptions`

## Security Considerations

**XSS**: `escapeHtml()` uses `div.textContent` → `div.innerHTML`
**Sanitization**: Validate email domain, sanitize phone, validate URLs with URL constructor, escape all inputs
**Privacy**: No cookies, no server tracking (UTM for analytics only), no data storage (except localStorage prefs), 100% client-side

## Accessibility

ARIA labels, full keyboard nav, modal focus trapping, semantic HTML, toggle switches (`role="switch"`, `aria-checked`, Enter/Space), HTML5 validation (red/green borders), `prefers-reduced-motion`

## Performance

Zero dependencies (~50KB), single `innerHTML` per preview, GPU-accelerated CSS animations, ~1K lines JS

## Git Workflow

Main = production (GitHub Pages), feature branches, descriptive commits, test before push

## GitHub Pages Deployment

**CRITICAL**: `.nojekyll` file required (Jekyll blocks `.ui-design` directory otherwise)

**Pre-Push Checklist**:
```bash
node --check js/*.js  # Validate syntax
python3 -c "assert open('css/styles.css').read().count('{') == open('css/styles.css').read().count('}'), 'Unmatched braces'"
test -f .nojekyll  # Verify exists
open index.html  # Manual test
```

**Common Issues**:
1. **Dot dirs 404**: Need `.nojekyll` in root
2. **CSS @import fails**: Check relative paths (`../.ui-design/tokens/tokens.css`)
3. **Case sensitivity**: Linux is case-sensitive (use `git ls-files`)
4. **Caching**: Hard refresh (Cmd+Shift+R), wait 2-3min for CDN

**Test Deployed**: `curl -I <url>` for CSS/JS files (should return 200), check Network tab for 404s
**Rollback**: `git revert <hash> && git push origin main`
**Required Files**: `index.html`, `css/styles.css`, `.ui-design/tokens/tokens.css`, `js/*.js`

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

## File Change Impact Map

**`index.html`**: Form layout → update CSS selectors, DOM queries in `app.js` → Test: rendering, toggles, buttons
**`js/app.js`**: State/events → preview updates, validation → Test: all interactions
**`js/signature.js`**: HTML output → email compatibility → Test: clipboard, paste in clients
**`css/styles.css`**: Visual only → Test: light/dark, responsive, animations
**`js/modal.js`**: Modal behavior → Test: open/close, keyboard nav

## Code Quality Checklist

Before commit: No console errors, test Chrome/Firefox/Safari, clipboard copy, dark mode, responsive, validate inputs, descriptive commit message, update README (user changes) / CLAUDE.md (architecture changes)

---

## Git Workflow

**Commit Convention**: `feat:` (new feature) | `fix:` (bug) | `docs:` (documentation) | `style:` (CSS/visual) | `refactor:` (restructure) | `test:` (tests) | `chore:` (maintenance)
**Branch Strategy**: main = production (GitHub Pages), feature branches optional, direct commits OK for small fixes

## Resources & References

**Docs**: `README.md` (user-facing, direct tone, no emojis/marketing), `CLAUDE.md` (dev guide), `.ui-design/docs/design-system.md` (tokens)
**Design**: `.ui-design/design-system.json` (config), `.ui-design/tokens/tokens.css` (370+ tokens)
**Code**: `signature.js` (generation), `app.js` (state), `modal.js` (UI), `styles.css` (theme/animations)
**External**: [Email HTML Best Practices](https://www.campaignmonitor.com/css/), [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API), [Email Client CSS Support](https://www.caniemail.com/)

---

## Development Learnings

### v0.7.0 Import Modal Redesign (Jan 2026)
**Key Insight**: Always research existing tools (HubSpot, Canva, etc.) BEFORE designing features. Pattern: Research 3-5 tools → comparison table → show user → recommend → design.
**Workflow Success**: Brainstorming → Design doc → Implementation plan → Git worktree → Parallel execution → Release. Clear visibility at every stage.
**Full retrospective**: `docs/sessions/2026-01-22-session-retrospective.md` | **Learnings doc**: `docs/learnings/2026-01-22-modal-redesign-session.md`

### v0.6.0 Dark Mode Implementation (Jan 2026)
**Key Insights**: (1) Use `md5` checksums to verify assets immediately, (2) Design for both local+production from start, (3) Preview toggles need class-based CSS in addition to media queries, (4) Helper functions first (abstractions before implementation), (5) Design for graceful degradation not universal support
**Tools**: `md5` (verify files), `sips` (convert images), `node --check` (JS validation), `python3 -c` (CSS braces), `git worktree` (isolation)
**Full retrospective**: See CHANGELOG.md v0.6.0 section

### Content Policy (To Prevent Bloat)
**✅ Keep in CLAUDE.md**: Current version details, architecture, Tejas's preferences, quick reference
**📦 Move to separate files**: Full retrospectives → `docs/sessions/`, detailed learnings → `docs/learnings/`, old changelogs → `CHANGELOG.md`
**🔄 Rotation**: When new version ships, condense previous version to 2-3 lines, keep new version detailed

---

## Quick Reference

**Feature Dev**: New field/style/component? Email client compatibility? Validation needed?
**Bug Fixes**: Reproducible in console? Browser/client-specific? JS error?
**Design**: Mobile layout? Zoho brand consistency? Dark mode works?

Keep it simple, accessible, email-compatible.
