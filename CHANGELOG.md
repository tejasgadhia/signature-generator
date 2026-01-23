# Changelog

All notable changes to the Zoho Email Signature Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-01-22

### ✨ Added

#### Social Media Section Redesign
- **iOS-Style Toggle List**: Replaced checkbox-based controls with consistent toggle switch list (Option 6 design)
- **Drag-and-Drop Reordering**: Premium drag-and-drop with live reordering and smooth 200ms animations
- **Keyboard Navigation**: Full keyboard support - Space to grab, Arrow keys to move, Space to drop, Escape to cancel
- **Screen Reader Support**: ARIA live regions announce all actions ("Grabbed Twitter/X", "Moved to position 2", etc.)
- **Haptic Feedback**: Mobile vibration on grab (10ms), drop (20ms), and move (5ms) actions
- **Always-Visible Drag Handles**: ☰ handles show at 50% opacity, 100% on hover for clear affordance
- **Drag Instructions**: Added hint text "Drag to reorder • Space + Arrows for keyboard"

#### UX Improvements
- **Live Reordering**: Items reposition in real-time as you drag (no guessing where items will land)
- **Order Persistence**: Custom channel order saves to localStorage and survives page refresh
- **Consistent Ordering**: Channels maintain canonical order when toggled on/off (no more "pushed to end")
- **Smooth Animations**: 200ms cubic-bezier transitions matching industry standards (Trello, Asana, Notion)
- **Visual Feedback**: Dragged items become 40% transparent, other items smoothly slide into place
- **Hover Effects**: Subtle elevation and background changes on list items

#### Accessibility (WCAG 2.2 Compliant)
- **Success Criterion 2.5.7**: Non-dragging keyboard alternative for all drag-and-drop functions
- **Success Criterion 2.5.5**: 44x44px minimum touch targets for drag handles
- **ARIA Labels**: Drag handles have descriptive labels ("Reorder Twitter/X. Press space to grab...")
- **Focus Management**: Clear visual focus indicators for keyboard users
- **Screen Reader Announcements**: All state changes announced to assistive technologies

### 🔧 Changed
- **Instagram Icon**: Changed from camera emoji (📸) to "IG" text for consistency with LinkedIn ("in") and Facebook ("f")
- **Event Handler Architecture**: Separated field toggles from social toggles to prevent collision (`.social-toggle` class)
- **Canonical Order System**: Implemented sortable order array that maintains proper sequencing

### 🐛 Fixed
- **Event Handler Collision**: Social toggles no longer trigger field toggle handlers (used to cause double-toggle bug)
- **Ordering Issue**: Re-enabling a channel now returns it to correct position instead of pushing to end
- **State Synchronization**: AppState, canonicalOrder array, and DOM now stay in perfect sync

### 📚 Research Sources
Implementation based on best practices from:
- Nielsen Norman Group: Drag-and-Drop Design Guidelines
- Atlassian Design System: Pragmatic Drag and Drop
- Salesforce UX: 4 Major Patterns for Accessible Drag and Drop
- Smart Interface Design Patterns: Drag-and-Drop UX
- LogRocket: Designing Drag and Drop UIs

### 🎯 Design Philosophy
This release embodies a research-driven approach to UI/UX:
1. Researched industry best practices before implementation
2. Studied patterns from Trello, Asana, Notion, Jira
3. Implemented consensus best practices (200ms animations, live reordering, keyboard support)
4. Exceeded WCAG 2.2 requirements for accessibility

---

## [0.8.0] - 2026-01-23

### ✨ Added

#### Color Theming System
- **4 Brand Colors**: Red (#E42527), Green (#089949), Blue (#226DB4), Yellow (#F9B21D)
- **Color Switcher**: CSS Grid layout with 4 equal-width buttons
- **Selected State**: Border highlight and box-shadow for active color
- **localStorage Persistence**: User's color preference saved across sessions
- **Dynamic Accent Colors**: All contact links (phone, email, social media) use selected accent color

#### New Signature Templates
- **Executive Template**: Centered layout with large name (20px bold), horizontal accent line below name (60px × 2px), designed for VPs/C-Suite/Senior Leadership
- **Bold Template**: Colored name/title block with rounded corners (8px), contrast-aware text color (dark on yellow, white on other colors), ideal for Marketing and Events teams

### 🔧 Changed
- **Style Selector**: Removed checkmark icon (border highlight sufficient), bolded template names (font-weight: 600), uniform 2-line help text descriptions
- **Dark Mode Toggle**: Replaced icon-based toggle with standard iOS-style switch, text label "Preview Dark Mode" outside toggle pill
- **Template Functions**: All now accept `accentColor` and `isPreview` parameters
- **AppState**: Added `accentColor` property (default: '#E42527')

### 🐛 Fixed
- **Accent Colors Not Applying**: Removed `!important` from `.sig-link` color in dark mode CSS (was overriding inline styles), kept it for fixed values (name, title)
- **Light Mode Text Illegible**: System dark mode preference (`@media (prefers-color-scheme: dark)`) was affecting preview even in light mode. Created dual dark mode context:
  - Preview mode (`isPreview=true`): Only `.dark-mode` class selectors
  - Copy mode (`isPreview=false`): Both media query AND `.dark-mode` selectors

### 📚 Documentation
- Created `docs/troubleshooting/css-important-conflicts.md`
- Created `docs/troubleshooting/dark-mode-system-preferences.md`

---

## [0.7.0] - 2026-01-22

### ✨ Added

#### Import Modal Redesign
- **Professional Design**: Email client branding with logo badges (48×48px with rounded corners)
- **WCAG AAA Compliance**: Verified contrast ratios 7:1+ for primary text (17.95:1 for titles, 15.21:1 for step text)
- **Numbered Step Circles**: Brand-colored badges (32px desktop, 28px mobile)
- **5 Email Client Instruction Sets**:
  - Zoho Mail: Red (#E42527), 5 steps with "Insert HTML" workflow
  - Zoho Desk: Orange (#F37021), 4 steps with signature management
  - Gmail: Red (#EA4335), 4 steps with direct paste (no Insert HTML button)
  - Apple Mail: Blue (#0071E3), 5 steps with critical font-matching checkbox
  - Outlook: Blue (#0078D4), 3 steps with rendered HTML paste
- **Responsive Design**: 320px to 1440px+ with single breakpoint at 640px
- **Tip Boxes**: Colored boxes for different message types:
  - Yellow (#FEF3C7 bg, #92400E text): General information
  - Blue (#DBEAFE bg, #1E40AF text): Best practices
  - Green (#D1FAE5 bg, #065F46 text): Success confirmations
  - All exceed WCAG AAA contrast (7.34:1 to 8.89:1)

#### Idiot-Proof Instructions
- Explicit UI element descriptions: "Insert HTML button (looks like </> brackets)"
- Visual clarity: "blue Insert button", "blue Update button"
- Context labels: "In the 'Insert HTML' popup"
- Step-by-step navigation: "Settings → Signature → Insert HTML"
- Client-specific warnings: Apple Mail font-matching checkbox

### 🔧 Changed
- **Modal Header**: Dynamic title with email client name, time estimate (e.g., "~1 minute • 5 steps"), professional close button (32×32px hit target)
- **CSS Architecture**: Forced light mode (explicit hex colors, no dark mode inheritance), CSS custom property `--step-color` for brand colors
- **JavaScript**: `ModalController.copySignature()` for inline copy button, `ModalController.updateContent()` for dynamic header/body injection
- **Animations**: Progressive enhancement with CSS-first approach, smooth animations with `prefers-reduced-motion` support, staggered fade-in (50ms delays)

### 📋 Accessibility
- Semantic HTML: `<ol>` lists with numbered steps
- ARIA labels on all interactive elements
- Keyboard navigation: Tab/Shift+Tab, Escape to close
- Focus trapping within modal
- Touch targets: 32×32px minimum (exceeds WCAG 2.2's 24×24px requirement)

### 📚 Testing
- Visual testing across all 5 email clients
- Responsive testing: 320px to 1440px verified
- Test results: `docs/test-results/2026-01-22-*.md`

---

## [0.6.0] - 2026-01-22

### ✨ Added

#### Dark Mode Email Signature Support
- **CSS Media Queries**: All 6 signature styles now include `<style>` block with `@media (prefers-color-scheme: dark)`
- **High Contrast Colors**: White text (#FFFFFF), light gray titles (#E0E0E0), blue links (#4A9EFF)
- **Dual Logo Strategy**: Every signature includes both light and dark Zoho logos with CSS `display: none/block` toggle
- **Helper Functions**:
  - `getDarkModeStyles()`: Generates CSS style block with media queries
  - `getLogoUrls()`: Returns light/dark logo URLs from GitHub Pages
  - `generateDualLogos()`: Creates HTML with both logo variants
- **CSS Classes**: `.sig-name` (primary text), `.sig-title` (secondary text), `.sig-link` (all links), `.sig-separator` (bullets), `.sig-logo-light`, `.sig-logo-dark`

### 🔧 Changed
- **Logo URLs**: Point to GitHub Pages (`tejasgadhia.github.io/signature-generator/assets/`)
- **Template Functions**: Now accept `isPreview` parameter for dual dark mode context

### 📋 Email Client Compatibility
- ✅ Gmail (web + mobile): Full dark mode support
- ✅ Apple Mail (macOS + iOS): Full dark mode support
- ⚠️ Outlook Web: Partial support (may strip some styles)
- ❌ Outlook Desktop: Fallback to light mode (inline styles only)

### 🏆 Key Insight
Design for graceful degradation, not universal support. Modern clients (Gmail/Apple Mail) cover ~80% of users.

---

## [0.5.0] - 2026-01-21

### ✨ Added
- **UTM Tracking**: Main zoho.com link includes tracking parameters (`utm_source=email-signature`, `utm_medium=signature`, `utm_campaign=[email-prefix]`), fallback to "zoho-employee" if email field empty
- **Smart Title Case**: Name, Title, Department fields auto-format to title case, preserves ~18 common acronyms (VP, CEO, iOS, API, B2B, etc.), lock icon (🔒/🔓) toggles formatting per field
- **Bookings URL Pattern**: Changed from free-form URL input to username-style pattern (`bookings.zohocorp.com/#/[your-id]`), accepts numeric IDs and custom slugs
- **Numbered Quick Start**: Changed from `<ul>` bullets to `<ol>` numbered list (semantic HTML), numbers styled in Zoho red (#E42527) using CSS counters

### 🔧 Changed
- **Twitter → X Rebrand**: Updated all references throughout application, changed URL prefix from `twitter.com/` to `x.com/`
- **Split Button Design**: Zoho Mail and Zoho Desk buttons redesigned with logo + text layout, full-branded logos (`mail-full.svg`, `desk-full.svg`) instead of icon-only
- **Sidebar Footer**: "Other Email Clients" section pinned to bottom, scrollable content wrapper for main sidebar content
- **Tooltip Positioning**: Tooltips now positioned above icons (not to the right), fixed z-index to prevent clipping
- **Text Readability**: Field labels changed to `--color-neutral-700` (#374151) for 11:1 contrast, readonly fields use font-weight 500
- **Social Media Cards**: Height reduced from 90px to 75px (icon: 24px, label: 10px), still exceeds 44×44px WCAG touch target

### 🔒 Privacy
- UTM tracking enables Zoho analytics to see signature traffic attribution
- No cookies, no server-side tracking, all processing client-side

---

## [0.4.0] - 2026-01-20

### ✨ Added
- Additional signature style templates (details TBD - version exists in git history)

---

## [0.2.0] - 2026-01-19

### ✨ Added

#### Design System
- **370+ CSS Tokens**: Comprehensive design system in `.ui-design/tokens/tokens.css`
- **Full Color Palette**: 50-950 shades for all colors (neutral, primary, success, error, warning)
- **Typography Scale**: Font sizes, weights, line heights
- **Tailwind-Compatible Spacing**: `--spacing-1` through `--spacing-96` (4px to 384px)
- **Semantic Color Tokens**: Auto-switch between light and dark modes
  - `--color-bg`, `--color-bg-elevated`
  - `--color-text-primary`, `--color-text-secondary`
  - `--color-border`, `--color-primary-500`
- **Documentation**: Full design system docs in `.ui-design/docs/design-system.md`

#### Accessibility Improvements
- **Keyboard-Accessible Toggles**: All toggle switches support Enter/Space keys
- **ARIA Attributes**: Added `role="switch"`, `aria-checked`, `tabindex="0"` to toggles
- **Visual Validation Feedback**: Form inputs show red/green borders on invalid/valid states

### 🐛 Fixed
- **Modal Memory Leak**: Fixed focus trap event listener cleanup (listeners now properly removed on close)
- **Hardcoded Colors**: Replaced all hardcoded hex colors with design tokens
- **Clear Button**: Improved tap target size (28×28px minimum, meets WCAG 2.2 requirement)

### 🔧 Changed
- **Demo Page**: `social-media-demo.html` now uses design system tokens
- **Consistent Theming**: All UI elements use semantic color variables

---

## [0.1.0] - 2026-01-17

### 🎉 Initial Release

First public release of the Zoho Email Signature Generator! A professional, privacy-first tool for creating beautiful email signatures.

### ✨ Added

#### Core Features
- **Live Preview System**: Real-time signature preview that updates as you type
- **4 Signature Styles**:
  - Classic: Traditional layout with logo on top
  - Compact: Minimal single-line design
  - Modern: Logo on left with vertical red separator
  - Minimal: Clean text-only without logo
- **One-Click Copy**: Copy HTML signature to clipboard with proper formatting
- **Import Instructions Modal**: Detailed guides for:
  - Zoho Mail (highlighted as recommended)
  - Gmail
  - macOS Mail
  - iOS Mail
  - Outlook

#### Form & Input System
- **8 Form Fields** with smart validation:
  - Name (required)
  - Job Title (optional, toggleable)
  - Department (optional, toggleable)
  - Email Address (optional, toggleable)
  - Phone Number (optional, toggleable)
  - LinkedIn Profile (optional, toggleable)
  - Twitter/X Handle (optional, toggleable)
  - Company Website (optional, toggleable)
- **iOS-Style Toggle Switches**: Professional UI to enable/disable optional fields
- **Clear Buttons**: Quick × buttons to clear individual fields
- **Sample Data**: Pre-populated with American sample (Sarah Mitchell, Account Executive, Austin TX)

#### Zoho Social Media Integration
- **Master Toggle**: Enable/disable all Zoho social handles at once
- **Granular Channel Control**: Individual toggles for:
  - Twitter/X (@Zoho)
  - LinkedIn (linkedin.com/company/zoho)
  - Facebook (facebook.com/zoho)
  - Instagram (@zoho)
- **Display Options**: Choose between text links or icon display
- **Smart Preview**: Social section only appears when explicitly enabled

#### Design & UX
- **Zoho Branding**: Official Zoho red (#E42527) throughout
- **Light/Dark Mode Preview**: Test signature in both themes
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Fade-up on load, transitions on interactions
- **Horizontal Label Layout**: Space-efficient side-by-side labels and inputs on desktop
- **Compact Vertical Spacing**: Reduced padding for less scrolling

#### Technical Implementation
- **Zero Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Email Compatible**: Table-based layouts with inline styles
- **Privacy-First**: All processing happens locally in browser
- **Theme Persistence**: localStorage remembers dark mode preference
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Modern APIs**: Clipboard API with fallback for older browsers

#### Code Quality
- **Well-Commented**: JSDoc-style documentation throughout
- **Semantic HTML5**: Proper use of semantic elements
- **Modern JavaScript**: ES6+ features (const/let, arrow functions, template literals)
- **Clean Architecture**: Separation of concerns (app.js, signature.js, modal.js)
- **Optimized Performance**: Efficient DOM manipulation, 60fps animations

### 📋 Technical Details

**Browser Support**:
- Chrome/Edge (Chromium) 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Email Client Compatibility**:
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS, iPadOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Zoho Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

**File Structure**:
```
signature-generator/
├── index.html           # Main application (16.4 KB)
├── css/styles.css       # Complete styling (15.2 KB)
├── js/
│   ├── app.js          # State management (13.8 KB)
│   ├── signature.js    # HTML generation (10.1 KB)
│   └── modal.js        # Modal controller (3.9 KB)
├── README.md           # Documentation (12.7 KB)
└── CHANGELOG.md        # This file
```

### 🎯 Design Decisions

1. **Toggle Switches over Checkboxes**: After creating comparison demo with 4 options (toggle switches, icon buttons, pill badges, plus/minus buttons), chose iOS-style toggle switches for most familiar and professional UX

2. **4 Signature Styles**: Added 4th style (Minimal) for symmetrical 2×2 grid layout instead of asymmetric 3-style layout

3. **Zoho Social Media Granularity**: Implemented master toggle with individual channel controls and text/icon display options for maximum flexibility

4. **American Sample Data**: Pre-populated with realistic Austin, TX-based Account Executive instead of generic or international examples

5. **Zoho Mail Instructions**: Detailed 9-step idiot-proof instructions highlighted in modal as recommended option

6. **Table-Based HTML**: Used HTML tables for signature layout instead of flexbox/grid for maximum email client compatibility

### 🔮 Future Considerations

Not included in v0.1.0 but potential for future versions:
- Save/load multiple signature profiles
- Export as image (PNG/JPG) or PDF
- QR code generation for contact info
- Bulk generation for teams (CSV import)
- Admin portal for company-wide templates
- Custom color scheme picker
- Image upload for personal photo

### 📦 Release Assets

- Source code (zip)
- Source code (tar.gz)

### 🙏 Acknowledgments

- Design pattern inspired by Lovable prompt found on X/Twitter
- Zoho branding and official social handles
- Toggle UI pattern from iOS/macOS design guidelines

---

**Full Changelog**: https://github.com/tejasgadhia/signature-generator/commits/v0.1.0
