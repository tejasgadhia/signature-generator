# Security Documentation

**Version**: 3.2.0 | **Last Updated**: 2026-02-02

This document explains the security measures implemented in the Zoho Email Signature Generator to protect user data and prevent common web vulnerabilities.

---

## Table of Contents

- [Content Security Policy](#content-security-policy)
- [Encryption Architecture](#encryption-architecture)
- [Tamper Detection](#tamper-detection)
- [Data Classification](#data-classification)
- [Privacy-First Design](#privacy-first-design)
- [Threat Model](#threat-model)
- [What's NOT Protected](#whats-not-protected)
- [Future Considerations](#future-considerations)

---

## Content Security Policy

### Overview

The application implements a comprehensive Content Security Policy (CSP) via meta tag in `index.html:10`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;">
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src 'self'` | Only allow resources from same origin | Blocks all external resources by default |
| `script-src 'self'` | Only allow scripts from same origin | **Prevents XSS via inline scripts** |
| `style-src 'self' 'unsafe-inline'` | Allow same-origin + inline styles | Inline styles needed for signature HTML |
| `img-src 'self' data:` | Allow same-origin + data URIs | Supports logo images + data URIs |
| `font-src 'self'` | Only allow fonts from same origin | Prevents font-based tracking |
| `connect-src 'self'` | Only allow API calls to same origin | Prevents data exfiltration via XHR/fetch |
| `base-uri 'self'` | Restrict `<base>` tag | Prevents base tag injection attacks |
| `form-action 'self'` | Only submit forms to same origin | Prevents form hijacking |
| `frame-ancestors 'none'` | Prevent embedding in iframes | **Prevents clickjacking attacks** |
| `upgrade-insecure-requests` | Upgrade HTTP → HTTPS | Forces secure connections |

### What CSP Protects Against

- ✅ **XSS (Cross-Site Scripting)**: Blocks inline scripts, only allows scripts from same origin
- ✅ **Clickjacking**: Prevents embedding in malicious iframes
- ✅ **Data Exfiltration**: Blocks unauthorized API calls to external domains
- ✅ **Mixed Content**: Automatically upgrades HTTP resources to HTTPS
- ✅ **Malicious Extensions**: Limits what injected scripts can do

### Testing CSP

**Manual test**:
1. Open browser DevTools → Console
2. Try to execute inline script:
   ```javascript
   eval('alert("xss")')
   ```
3. **Expected**: CSP violation error, script blocked

---

## Encryption Architecture

### Overview

The application uses **AES-GCM 256-bit encryption** via the Web Crypto API to protect localStorage data from unauthorized access.

### Key Components

**Files**:
- `src/utils/crypto.ts` - Low-level AES-GCM encryption/decryption
- `src/utils/tamper-detection.ts` - HMAC-SHA256 signature generation
- `src/utils/encrypted-storage.ts` - High-level encrypted storage API
- `src/app/state.ts` - State management with encrypted persistence

### Encryption Process

```
┌─────────────┐
│ Plaintext   │
│ "mydata"    │
└─────────────┘
       │
       ▼
┌─────────────────────┐
│ 1. Sign (HMAC)      │  Generate HMAC-SHA256 signature
│    signature = HMAC │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 2. Pack             │  Combine: "data|signature"
│    packed           │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 3. Encrypt (AES)    │  Encrypt with AES-GCM-256
│    ciphertext       │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 4. Store            │  Save to localStorage
│    localStorage     │
└─────────────────────┘
```

### Decryption Process

```
┌─────────────────────┐
│ localStorage        │
│ ciphertext          │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 1. Decrypt (AES)    │  Decrypt with AES-GCM-256
│    packed           │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 2. Unpack           │  Extract: "data" + "signature"
│    data, signature  │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ 3. Verify (HMAC)    │  Verify signature matches data
│    isValid?         │
└─────────────────────┘
       │
       ├─ ✅ Valid → Return data
       └─ ❌ Invalid → Return null (tampered)
```

### Encryption Key Management

**Ephemeral Session Keys**:
- Encryption key: Generated once per session, stored in memory cache
- HMAC key: Generated once per session, stored in memory cache
- **Not exportable**: Keys use `extractable: false` flag (Web Crypto API)
- **Not persisted**: Keys are lost when browser tab closes (intentional)

**Why ephemeral keys?**
- ✅ **Enhanced security**: Keys can't be extracted or stolen
- ✅ **Simplicity**: No need to manage key storage/rotation
- ❌ **Tradeoff**: Encrypted data is session-specific (not portable between devices)

### Algorithm Details

**AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)**:
- Key length: 256 bits (strongest AES variant)
- IV (Initialization Vector): 96 bits, randomly generated per encryption
- Authenticated encryption: Provides both confidentiality and integrity
- Standard: NIST SP 800-38D

**HMAC-SHA256 (Hash-based Message Authentication Code)**:
- Hash function: SHA-256
- Purpose: Data integrity verification, tamper detection
- Standard: FIPS 198-1

---

## Tamper Detection

### Overview

HMAC-SHA256 signatures are generated for all encrypted data to detect unauthorized modifications.

### How It Works

1. **On Write**:
   - Generate HMAC signature from plaintext
   - Pack data with signature: `data|signature`
   - Encrypt the signed data

2. **On Read**:
   - Decrypt the data
   - Unpack to extract data + signature
   - Verify signature matches data
   - If mismatch → **tamper detected**, clear data, return null

### What Tamper Detection Protects Against

- ✅ **Malicious Browser Extensions**: Extensions that modify localStorage
- ✅ **Manual Tampering**: User/attacker editing localStorage via DevTools
- ✅ **Integrity Attacks**: Data corruption or bit flipping
- ✅ **Replay Attacks**: Using old encrypted values

### Example Attack Scenario

**Attack**: Malicious extension tries to change accent color from red to green

```javascript
// Attacker's action (DevTools Console):
localStorage.setItem('signature-accent-color', '<encrypted green value>');

// App's response:
// 1. Decrypt value
// 2. Verify signature
// 3. Signature mismatch detected ❌
// 4. Clear corrupted key
// 5. Log warning: "Tampered data detected for key: signature-accent-color"
// 6. Fall back to default value
```

---

## Data Classification

### Encrypted Keys (5 keys)

**Purpose**: Prevent malicious modification of user preferences

| Key | Value Type | Rationale |
|-----|------------|-----------|
| `signature-accent-color` | String (hex color) | Prevent color injection attacks |
| `socialChannelOrder` | JSON array | Prevent order manipulation |
| `format-lock-name` | Boolean | Preserve user formatting preferences |
| `format-lock-title` | Boolean | Preserve user formatting preferences |
| `format-lock-department` | Boolean | Preserve user formatting preferences |

### Plaintext Keys (intentional)

**Purpose**: Non-sensitive data or needed before encryption loads

| Key | Value Type | Rationale |
|-----|------------|-----------|
| `zoho-signature-preview-theme` | String | Theme preference (not sensitive) |
| `app-schema-version` | Number | Migration tracking (needed before decryption) |
| `thanks-count` | Number | Easter egg counter (not sensitive) |
| `encryption-migration-v1` | String | Migration flag (not sensitive) |

### NOT Stored in localStorage

**Critical**: FormData (name, email, phone, LinkedIn) is **transient** and **never persisted**.

**Why?**
- ✅ **Privacy**: No PII in localStorage (GDPR/privacy-friendly)
- ✅ **Security**: No sensitive data to protect
- ✅ **User control**: Users must enter data each session

**Export/Import**:
- Users can export state as JSON (includes FormData)
- Export is unencrypted (user responsibility to protect file)
- Import validates schema version and structure

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

- ✅ **No consent needed**: No cookies, no tracking, no PII storage
- ✅ **Right to erasure**: Users can clear all data (localStorage.clear())
- ✅ **Data portability**: Users can export state as JSON
- ✅ **Privacy by design**: No PII collected or stored

---

## Threat Model

### What This Security Model Protects Against

| Threat | Protection | Status |
|--------|------------|--------|
| **XSS (Cross-Site Scripting)** | CSP blocks inline scripts | ✅ Protected |
| **Clickjacking** | CSP `frame-ancestors 'none'` | ✅ Protected |
| **Malicious Extensions** | Encryption + tamper detection | ✅ Protected |
| **localStorage Tampering** | HMAC signatures | ✅ Protected |
| **MITM (Man-in-the-Middle)** | HTTPS-only, CSP upgrade | ✅ Protected |
| **Data Exfiltration** | CSP `connect-src 'self'` | ✅ Protected |
| **Phishing (user enters data)** | User education (README) | ⚠️ Partial |

### Attack Scenarios

**Scenario 1: Malicious Browser Extension**
- **Attack**: Extension tries to modify `signature-accent-color` to inject malicious HTML
- **Defense**: Tampering detected, corrupted data cleared, fallback to default
- **Result**: ✅ Attack mitigated

**Scenario 2: XSS via Input Field**
- **Attack**: User enters `<script>alert(1)</script>` in name field
- **Defense**: HTML escaping in signature generation (escapeHtml utility)
- **Result**: ✅ Output is `&lt;script&gt;...`, safe to paste in email

**Scenario 3: Clickjacking**
- **Attack**: Attacker embeds app in malicious iframe, tricks user into clicking
- **Defense**: CSP `frame-ancestors 'none'` blocks iframe embedding
- **Result**: ✅ App refuses to load in iframe

**Scenario 4: Data Exfiltration**
- **Attack**: Injected script tries to send localStorage data to attacker's server
- **Defense**: CSP `connect-src 'self'` blocks external fetch/XHR
- **Result**: ✅ Network request blocked

---

## What's NOT Protected

### Limitations & Out-of-Scope Threats

**1. Compromised Browser**
- If browser itself is compromised (malware), encryption keys in memory can be stolen
- **Mitigation**: Use trusted browsers, keep them updated

**2. Physical Access**
- If attacker has physical access to unlocked device, they can access app
- **Mitigation**: Lock device, don't leave unattended

**3. Phishing**
- If user is tricked into entering data on fake site, encryption can't help
- **Mitigation**: User education, verify URL (github.io)

**4. Session Hijacking**
- If attacker gains access to browser session, they can use the app
- **Mitigation**: Session-only keys (lost on tab close)

**5. Supply Chain Attacks**
- If GitHub Pages or dependencies are compromised, app could be malicious
- **Mitigation**: Subresource Integrity (SRI) for CDN resources (future)

**6. Social Engineering**
- If user is tricked into exporting data and sharing JSON file, data is unencrypted
- **Mitigation**: User education (don't share exports)

---

## Future Considerations

### Potential Enhancements

**1. IndexedDB Key Storage**
- Store encryption keys in IndexedDB (more secure than memory-only)
- Allow key persistence across sessions (if user opts in)
- Trade-off: More complex key management

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

**5. Security Headers (if backend added)**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

---

## Security Testing

### Automated Tests

- **Unit Tests**: Encryption/decryption, signature verification (Vitest)
- **Integration Tests**: State persistence, migration logic
- **Security Tests**: XSS payload sanitization, URL validation

### Manual Testing Checklist

- [ ] **CSP Test**: Try `eval('alert(1)')` in console → Should be blocked
- [ ] **Tamper Test**: Edit encrypted localStorage value → Should detect tampering
- [ ] **XSS Test**: Enter `<script>alert(1)</script>` in fields → Should escape in output
- [ ] **Clickjacking Test**: Try embedding in iframe → Should refuse to load
- [ ] **HTTPS Test**: Try HTTP → Should upgrade to HTTPS
- [ ] **Migration Test**: Clear localStorage, reload → Should migrate plaintext to encrypted

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

**Version 3.2.0 (2026-02-02)**:
- ✅ Added HMAC-SHA256 tamper detection
- ✅ Implemented encryption migration for 5 localStorage keys
- ✅ Enhanced CSP documentation
- ✅ Created comprehensive security docs

**Version 3.0.0 (2026-01-27)**:
- ✅ TypeScript migration (type safety)
- ✅ CSP implementation (XSS protection)
- ✅ AES-GCM-256 encryption utilities (ready, not yet used)

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Crypto API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [AES-GCM (NIST)](https://csrc.nist.gov/publications/detail/sp/800-38d/final)
- [HMAC (FIPS 198-1)](https://csrc.nist.gov/publications/detail/fips/198/1/final)
