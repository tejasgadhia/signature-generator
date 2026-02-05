# Security Documentation

**Version**: 3.4.0 | **Last Updated**: 2026-02-05

This document explains the security measures implemented in the Zoho Email Signature Generator to protect user data and prevent common web vulnerabilities.

---

## Table of Contents

- [Content Security Policy](#content-security-policy)
- [Data Classification](#data-classification)
- [Privacy-First Design](#privacy-first-design)
- [Threat Model](#threat-model)
- [What's NOT Protected](#whats-not-protected)
- [Future Considerations](#future-considerations)

---

## Content Security Policy

### Overview

The application implements a Content Security Policy (CSP) via meta tag in `index.html:10`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://tejasgadhia.github.io; font-src 'self'; connect-src 'self' ws:; media-src 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;">
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src 'self'` | Only allow resources from same origin | Blocks all external resources by default |
| `script-src 'self'` | Only allow scripts from same origin | **Prevents XSS via inline scripts** |
| `style-src 'self' 'unsafe-inline'` | Allow same-origin + inline styles | Inline styles needed for signature HTML |
| `img-src 'self' data: https://tejasgadhia.github.io` | Allow same-origin + data URIs + GitHub Pages | Supports logo images (absolute URLs in signatures) |
| `font-src 'self'` | Only allow fonts from same origin | Prevents font-based tracking |
| `connect-src 'self' ws:` | Allow same-origin + WebSocket | WebSocket needed for Vite HMR in dev; inert in production |
| `media-src 'self'` | Only allow media from same origin | Explicit declaration for audio/video |
| `base-uri 'self'` | Restrict `<base>` tag | Prevents base tag injection attacks |
| `form-action 'self'` | Only submit forms to same origin | Prevents form hijacking |
| `upgrade-insecure-requests` | Upgrade HTTP to HTTPS | Forces secure connections |

### Clickjacking Protection

**Note**: `frame-ancestors` is **not supported** in CSP meta tags per the [CSP specification](https://w3c.github.io/webappsec-csp/#meta-element). It only works via HTTP headers. For GitHub Pages deployments, clickjacking protection requires either:

1. **Cloudflare Transform Rules** (recommended): Add `X-Frame-Options: DENY` response header
2. **Custom server**: Set `Content-Security-Policy: frame-ancestors 'none'` as an HTTP header

### What CSP Protects Against

- **XSS (Cross-Site Scripting)**: Blocks inline scripts, only allows scripts from same origin
- **Data Exfiltration**: Blocks unauthorized API calls to external domains
- **Mixed Content**: Automatically upgrades HTTP resources to HTTPS
- **Malicious Extensions**: Limits what injected scripts can do

### Testing CSP

**Manual test**:
1. Open browser DevTools Console
2. Try to execute inline script:
   ```javascript
   eval('alert("xss")')
   ```
3. **Expected**: CSP violation error, script blocked

---

## Data Classification

### Validated Plaintext Keys (5 keys)

**Purpose**: Store user preferences with validation-on-read to reject invalid values

All persisted values are stored as plaintext and validated when loaded. This replaced the previous encryption approach (v3.2.0-v3.3.0), which used ephemeral Web Crypto API keys that were lost on every page reload — making encrypted data unreadable.

| Key | Value Type | Validation |
|-----|------------|------------|
| `signature-accent-color` | String (hex color) | Whitelist: 4 valid hex values via `VALID_ACCENT_COLORS` Set |
| `socialChannelOrder` | JSON array | Schema: array of max 5 valid channel name strings |
| `format-lock-name` | Boolean string | Strict match: `"true"` or `"false"` only |
| `format-lock-title` | Boolean string | Strict match: `"true"` or `"false"` only |
| `format-lock-department` | Boolean string | Strict match: `"true"` or `"false"` only |

**Legacy data handling**: On first load after upgrade, `cleanupLegacyEncryptedData()` detects and removes old encrypted values (pipe-separated or base64 blobs) so defaults are used instead.

### Other Plaintext Keys

| Key | Value Type | Purpose |
|-----|------------|---------|
| `zoho-signature-preview-theme` | String | Theme preference (not sensitive) |
| `app-schema-version` | Number | Migration tracking |
| `thanks-count` | Number | Easter egg counter (not sensitive) |

### NOT Stored in localStorage

**Critical**: FormData (name, email, phone, LinkedIn) is **transient** and **never persisted**.

**Why?**
- **Privacy**: No PII in localStorage (GDPR/privacy-friendly)
- **Security**: No sensitive data to protect
- **User control**: Users must enter data each session

**Export/Import**:
- Users can export state as JSON (includes FormData)
- Export is unencrypted (user responsibility to protect file)
- Import validates schema version, structure, and sanitizes keys against allowlists (prototype pollution protection)

---

## Privacy-First Design

### Core Principles

1. **No PII Persistence**
   - FormData (name, email, phone) is session-only
   - Only preferences are persisted
   - User data ownership: users can export/clear anytime

2. **No Tracking**
   - Zero analytics
   - No cookies (except functional localStorage)
   - No third-party scripts

3. **100% Client-Side**
   - All processing happens in browser
   - No backend/API calls
   - Data never leaves user's device

4. **Works Offline**
   - After initial load, app works without internet
   - No external dependencies at runtime

### GDPR/Privacy Compliance

- **No consent needed**: No cookies, no tracking, no PII storage
- **Right to erasure**: Users can clear all data (localStorage.clear())
- **Data portability**: Users can export state as JSON
- **Privacy by design**: No PII collected or stored

---

## Threat Model

### What This Security Model Protects Against

| Threat | Protection | Status |
|--------|------------|--------|
| **XSS (Cross-Site Scripting)** | CSP blocks inline scripts | Protected |
| **Prototype Pollution** | Key allowlists on setSocialOptions() and importData() | Protected |
| **localStorage Tampering** | Validation-on-read (whitelist, schema, strict boolean) | Protected |
| **MITM (Man-in-the-Middle)** | HTTPS-only, CSP upgrade | Protected |
| **Data Exfiltration** | CSP `connect-src 'self'` | Protected |
| **Clickjacking** | Requires HTTP header (see CSP section) | Needs Cloudflare |
| **Phishing** | User education (README) | Partial |

### Attack Scenarios

**Scenario 1: localStorage Tampering**
- **Attack**: Extension or user modifies `signature-accent-color` to inject malicious value
- **Defense**: `isValidAccentColor()` checks against whitelist of 4 hex values; invalid values are removed
- **Result**: Attack mitigated — falls back to default

**Scenario 2: XSS via Input Field**
- **Attack**: User enters `<script>alert(1)</script>` in name field
- **Defense**: HTML escaping in signature generation (escapeHtml utility)
- **Result**: Output is `&lt;script&gt;...`, safe to paste in email

**Scenario 3: Prototype Pollution via importData()**
- **Attack**: Crafted JSON with `__proto__` keys attempts to pollute Object.prototype
- **Defense**: `sanitizeKeys()` only copies explicitly allowlisted keys using `hasOwnProperty`
- **Result**: `__proto__`, `constructor`, and other dangerous keys are silently dropped

**Scenario 4: Data Exfiltration**
- **Attack**: Injected script tries to send localStorage data to attacker's server
- **Defense**: CSP `connect-src 'self'` blocks external fetch/XHR
- **Result**: Network request blocked

---

## What's NOT Protected

### Limitations & Out-of-Scope Threats

**1. Compromised Browser**
- If browser itself is compromised (malware), all bets are off
- **Mitigation**: Use trusted browsers, keep them updated

**2. Physical Access**
- If attacker has physical access to unlocked device, they can access app
- **Mitigation**: Lock device, don't leave unattended

**3. Phishing**
- If user is tricked into entering data on fake site, client-side protections can't help
- **Mitigation**: User education, verify URL (github.io)

**4. Supply Chain Attacks**
- If GitHub Pages or dependencies are compromised, app could be malicious
- **Mitigation**: Subresource Integrity (SRI) for CDN resources (future)

**5. Social Engineering**
- If user is tricked into exporting data and sharing JSON file, data is unencrypted
- **Mitigation**: User education (don't share exports)

**6. Clickjacking (meta tag limitation)**
- `frame-ancestors` in CSP meta tags is ignored by browsers
- **Mitigation**: Add `X-Frame-Options: DENY` via Cloudflare Transform Rules

---

## Future Considerations

### Potential Enhancements

**1. Clickjacking via HTTP Headers**
- Add `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'` via Cloudflare Transform Rules
- Priority: Medium (static site with no auth — low clickjacking risk)

**2. CSP Report-Only Mode**
- Add `Content-Security-Policy-Report-Only` header
- Monitor violations without blocking
- Helps identify false positives before enforcement

**3. Encrypted Exports**
- Password-protected JSON exports
- Use PBKDF2 key derivation from user password
- Trade-off: Users must remember password

**4. Subresource Integrity (SRI)**
- Add SRI hashes to external resources (if any added in future)
- Ensures resources haven't been tampered with

**5. Security Headers (via Cloudflare)**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

---

## Security Testing

### Automated Tests

- **Unit Tests**: State validation, key sanitization, prototype pollution protection (Vitest)
- **Integration Tests**: State persistence, migration logic
- **Security Tests**: XSS payload sanitization, URL validation

### Manual Testing Checklist

- [ ] **CSP Test**: Try `eval('alert(1)')` in console — should be blocked
- [ ] **XSS Test**: Enter `<script>alert(1)</script>` in fields — should escape in output
- [ ] **HTTPS Test**: Try HTTP — should upgrade to HTTPS
- [ ] **Validation Test**: Edit `signature-accent-color` in localStorage to `#000000` — should reset to default on reload
- [ ] **Validation Test**: Edit `socialChannelOrder` to `["__proto__"]` — should reset to default
- [ ] **Validation Test**: Edit `format-lock-name` to `maybe` — should reset to default

---

## Reporting Security Issues

**GitHub Issues**: https://github.com/tejasgadhia/zoho-signature-generator/issues

**Please include**:
- Description of vulnerability
- Steps to reproduce
- Impact assessment
- Suggested mitigation (if any)

**Response time**: Within 48 hours

---

## Changelog

**Version 3.4.0 (2026-02-05)**:
- Removed deprecated encryption files (`crypto.ts`, `tamper-detection.ts`, `encrypted-storage.ts`)
- Replaced encryption with validation-on-read (whitelist, schema, strict boolean)
- Added prototype pollution protection to `setSocialOptions()` and `importData()`
- Updated CSP: added `img-src` GitHub Pages, `ws:` for dev, `media-src`; removed unsupported `frame-ancestors`
- Documented `frame-ancestors` meta tag limitation and Cloudflare workaround

**Version 3.2.0 (2026-02-02)**:
- Added HMAC-SHA256 tamper detection
- Implemented encryption migration for 5 localStorage keys
- Enhanced CSP documentation
- Created comprehensive security docs

**Version 3.0.0 (2026-01-27)**:
- TypeScript migration (type safety)
- CSP implementation (XSS protection)
- AES-GCM-256 encryption utilities (ready, not yet used)

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Meta Tag Restrictions](https://w3c.github.io/webappsec-csp/#meta-element)
