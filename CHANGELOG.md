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
