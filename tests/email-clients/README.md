# Email Client Compatibility Testing

**Purpose**: Ensure signatures render correctly across major email clients.

**When to test**: Before major releases (v4.0.0, v5.0.0), after HTML structure changes, when adding new signature styles.

---

## Email Clients to Test

### Critical (Always Test)

1. **Gmail Web** - Most common, strict CSS filtering
2. **Outlook Desktop** (Windows) - Notorious for CSS stripping
3. **Apple Mail** (macOS/iOS) - Native rendering, generally good

### Secondary (Test for major releases)

4. **Outlook Web (outlook.com)** - Different rendering from desktop
5. **Gmail Mobile** (Android/iOS) - Mobile-specific layout issues
6. **Thunderbird** - Open-source reference

---

## Test Data Sets

Use these data sets to cover edge cases:

### 1. Standard Data
```
Name: Jasmine Frank
Title: Director of Marketing
Department: Zoho One
Email: jasmine.frank@zohocorp.com
Phone: +1 (281) 330-8004
LinkedIn: https://linkedin.com/in/jasminefrank
Twitter: https://x.com/jasminefrank
```

### 2. Long Names/Titles
```
Name: Christopher Alexander Montgomery-Wellington Jr.
Title: Senior Vice President of Strategic Product Development
Department: Enterprise Solutions & Customer Success Division
```

### 3. All Social Channels
```
LinkedIn: ✅
Twitter: ✅
Bookings: ✅
```

### 4. Minimal Data (Only Required Fields)
```
Name: Alex Johnson
Title: Engineer
Email: alex.johnson@zohocorp.com
(All other fields disabled)
```

---

## Testing Process

### Step 1: Generate Signatures

1. Open https://tejasgadhia.github.io/zoho-signature-generator
2. Fill form with test data (see above)
3. Test each of 6 signature styles:
   - Classic
   - Modern
   - Compact
   - Minimal
   - Professional
   - Creative
4. Click "Copy to Clipboard"

### Step 2: Import to Email Client

**Gmail**:
1. Settings → See all settings → General → Signature
2. Click "+ Create new" → Name it "Test [Style] [Date]"
3. Paste signature (Cmd/Ctrl+V)
4. Click "Save Changes"

**Outlook Desktop (Windows)**:
1. File → Options → Mail → Signatures
2. Click "New" → Name it "Test [Style] [Date]"
3. Paste signature (Ctrl+V)
4. Click "OK"

**Outlook Desktop (Mac)**:
1. Outlook → Preferences → Signatures
2. Click "+" → Name it "Test [Style] [Date]"
3. Paste signature (Cmd+V)
4. Close Preferences (auto-saves)

**Apple Mail**:
1. Mail → Settings → Signatures
2. Select account → Click "+"
3. Replace "Signature #N" with "Test [Style] [Date]"
4. Delete placeholder text
5. Paste signature (Cmd+V)

**Thunderbird**:
1. Account Settings → [Your Account] → Signature Text
2. Enable "Use HTML"
3. Paste signature (Ctrl/Cmd+V)
4. Click "OK"

### Step 3: Send Test Email

1. Compose new email
2. To: Your personal email (gmail, outlook, apple, etc.)
3. Subject: "Signature Test - [Style] - [Date]"
4. Body: Brief note about what you're testing
5. **Verify signature appears in compose window**
6. Send

### Step 4: Verify Rendering

**Check in recipient's inbox**:
1. Open received email
2. Use verification checklist (see below)
3. Take screenshots for documentation (if issues found)
4. Test in both light and dark mode (if supported)

---

## Verification Checklist

For each signature, verify:

### Typography
- [ ] **Font**: Verdana is applied (or fallback sans-serif)
- [ ] **Size**: Text is readable (not too small/large)
- [ ] **Weight**: Bold headings, normal body text
- [ ] **Color**: Text color matches design (not overridden by client)

### Layout
- [ ] **Structure**: Table-based layout intact
- [ ] **Spacing**: Padding/margins preserved
- [ ] **Alignment**: Elements align correctly
- [ ] **Width**: Signature fits in viewport (not too wide)

### Images
- [ ] **Logo**: Zoho logo loads and displays
- [ ] **Size**: Logo is correct size (not stretched/squished)
- [ ] **Resolution**: Logo is crisp on high-DPI displays

### Links
- [ ] **Clickable**: All links (email, phone, LinkedIn, etc.) are clickable
- [ ] **Target**: Links open in new tab (if applicable)
- [ ] **URL**: Correct URL on hover/click

### Dark Mode (if supported)
- [ ] **Text**: Readable in dark mode (light text on dark background)
- [ ] **Logo**: Dark mode logo variant displays
- [ ] **Colors**: Accent colors still visible

### Edge Cases
- [ ] **Long Name**: Wraps gracefully, no overflow
- [ ] **Long Title**: Doesn't break layout
- [ ] **Missing Fields**: Layout adapts correctly
- [ ] **All Socials**: Social links display correctly

---

## Known Issues

### Gmail

**Issue**: Extra spacing between table cells
- **Impact**: Low - Adds 1-2px gaps
- **Workaround**: Ensure `cellspacing="0"` on all tables

**Issue**: `style` blocks sometimes stripped
- **Impact**: High - Dark mode may not work
- **Workaround**: Use inline styles only

**Issue**: `class` attributes removed
- **Impact**: Medium - Dark mode selectors won't work
- **Workaround**: Use inline styles + media queries

### Outlook Desktop (Windows)

**Issue**: Uses Word rendering engine (not browser)
- **Impact**: High - CSS support very limited
- **Workaround**: Table-based layout, inline styles, no advanced CSS

**Issue**: Ignores `max-width`, `max-height`
- **Impact**: Medium - Images may be oversized
- **Workaround**: Use explicit `width` and `height` attributes

**Issue**: Strips `background-color` from `<table>`
- **Impact**: Low - Use background on `<td>` instead

### Apple Mail

**Issue**: Generally good CSS support
- **Impact**: None - Usually renders correctly
- **Workaround**: None needed

**Issue**: Dark mode auto-inverts colors (iOS 13+)
- **Impact**: Medium - May invert logo/colors incorrectly
- **Workaround**: Use `color-scheme: light` meta tag

### Outlook Web

**Issue**: Better than desktop, but still limited
- **Impact**: Medium - More CSS support than desktop
- **Workaround**: Test separately from desktop

### Gmail Mobile

**Issue**: Adds responsive layout automatically
- **Impact**: Low - May change spacing
- **Workaround**: Use `!important` on critical styles

---

## Paid Testing Services

For comprehensive testing across 90+ email clients:

### Litmus (https://litmus.com)
- **Cost**: $99-299/month
- **Pros**: Most comprehensive, instant previews, spam testing
- **Use when**: Major releases, critical changes

### Email on Acid (https://www.emailonacid.com)
- **Cost**: $99-199/month
- **Pros**: Good client coverage, collaboration tools
- **Use when**: Major releases, team needs access

**Recommendation**: Use free manual testing for regular development, reserve paid services for v4.0.0, v5.0.0, etc.

---

## Reporting Issues

**Format**:
```
## [Email Client] - [Issue Title]

**Signature Style**: Classic
**Test Data**: Long Name
**Client**: Gmail Web
**Browser**: Chrome 119
**Screenshot**: [Attach]

**Expected**: Name wraps gracefully
**Actual**: Name overflows container

**Impact**: Medium
**Proposed Fix**: Add `word-wrap: break-word` to name cell
```

**Where to report**:
- GitHub Issues: https://github.com/tejasgadhia/zoho-signature-generator/issues
- Label: `email-compatibility`

---

## Testing History

Keep a log of testing sessions:

| Date | Version | Tester | Clients Tested | Issues Found | Notes |
|------|---------|--------|----------------|--------------|-------|
| 2026-01-30 | 3.1.0 | Tejas | Gmail, Outlook Desktop, Apple Mail | 0 | All 6 styles tested |
| [Add your entries] | | | | | |

---

## Quick Reference

**Test before every major release**: v4.0.0, v5.0.0, etc.

**Test after structural changes**: HTML/CSS changes to signature generation

**Minimum testing**: Gmail Web + Outlook Desktop + Apple Mail

**Full testing**: All 6 clients + mobile + dark mode

**Use checklist**: [test-checklist.md](test-checklist.md)
