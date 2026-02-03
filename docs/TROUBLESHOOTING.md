# Troubleshooting Guide

Common issues and solutions for **Zoho Email Signature Generator**.

---

## Error Recovery

### Error Modal Appears

If you see an error modal with the message **"Something went wrong"**:

**Option 1: Reload Page** (Recommended)
- Click "Reload Page" button
- This refreshes the app without losing your data

**Option 2: Clear Data & Restart**
- Click "Clear Data & Restart" button
- ⚠️ **Warning**: This clears all saved preferences (theme, format locks, social channel order)
- Use this if reloading doesn't fix the issue

**Option 3: Copy Error Details**
- Click "Copy Error Details" to copy technical info to clipboard
- Submit a [GitHub Issue](https://github.com/tejasgadhia/zoho-signature-generator/issues) with the error details
- Include steps to reproduce the issue

### Privacy Note
Error details DO NOT include your personal information (name, email, phone). Only technical data is logged:
- Error message and stack trace
- Browser info (user agent, screen size)
- App state (selected style, dark mode)
- Timestamp

---

## Common Issues

### Copy Button Not Working

**Symptom**: Click "Copy Signature" but nothing is copied

**Causes**:
1. **Browser doesn't support Clipboard API**
   - Solution: Use a modern browser (Chrome 90+, Firefox 88+, Safari 14+)

2. **Not using HTTPS or localhost**
   - Solution: Clipboard API requires secure context (https:// or localhost)
   - GitHub Pages always uses HTTPS

3. **Browser permissions denied**
   - Solution: Check browser address bar for clipboard permission prompt
   - Allow clipboard access when prompted

**Workaround**:
1. Click inside the signature preview
2. Press Cmd+A (Mac) or Ctrl+A (Windows) to select all
3. Press Cmd+C (Mac) or Ctrl+C (Windows) to copy
4. Paste into your email client

---

### Signature Not Rendering

**Symptom**: Preview area is blank or shows "Loading..."

**Causes**:
1. **JavaScript error**
   - Open browser console (F12 or Cmd+Opt+J)
   - Look for red error messages
   - Copy error details and report as GitHub issue

2. **Form validation error**
   - Check if any required fields (Name, Email) are empty
   - Check if email is missing `@zohocorp.com` domain

3. **Browser compatibility**
   - Solution: Use supported browser (see [README.md](../README.md#browser-support))

**Fix**:
1. Reload page (Cmd+R or Ctrl+R)
2. If issue persists, clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
3. If still broken, click "Clear Data & Restart" in error modal

---

### Dark Mode Not Persisting

**Symptom**: Dark mode toggle resets to light mode on page reload

**Causes**:
1. **Browser privacy mode**
   - Private/Incognito mode doesn't persist localStorage
   - Solution: Use normal browser mode

2. **Third-party cookies blocked**
   - Some browsers block localStorage with strict privacy settings
   - Solution: Allow localStorage for GitHub Pages domain

3. **Browser extension conflict**
   - Ad blockers or privacy extensions may clear storage
   - Solution: Disable extensions temporarily to test

**Fix**:
1. Check browser privacy settings
2. Ensure cookies are enabled for GitHub Pages
3. Try different browser to isolate issue

---

### Signature Looks Different in Email Client

**Symptom**: Signature looks good in preview but broken in Gmail/Outlook/Apple Mail

**Causes**:
1. **Email client HTML/CSS limitations**
   - Some clients strip CSS, modify HTML
   - Gmail removes `<style>` tags (we use inline styles to prevent this)

2. **Dark mode not detected**
   - Email client doesn't report dark mode preference
   - Our dual-logo system should handle this automatically

3. **Image blocking**
   - Email client blocks external images
   - Solution: Our logos are base64-encoded inline (no external URLs)

**Verified Email Clients**:
- ✅ Gmail (web, iOS, Android)
- ✅ Outlook (web, desktop, mobile)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ Proton Mail
- ✅ Thunderbird
- ✅ Spark
- ✅ Edison Mail
- ✅ BlueMail

**Fix**:
1. Try a different signature style (some are more email-compatible)
2. Use "Minimal" or "Classic" style for maximum compatibility
3. Report as GitHub issue with email client name and screenshot

---

### Format Lock Not Working

**Symptom**: Title/Name/Department reverts to title case despite lock icon

**Causes**:
1. **localStorage not persisting**
   - See "Dark Mode Not Persisting" above

2. **Lock state not saved**
   - Click lock icon to toggle (should turn gold when locked)
   - Verify localStorage is enabled in browser

**Fix**:
1. Click lock icon multiple times to ensure it saves
2. Reload page to verify lock persists
3. Check browser console for localStorage errors

---

### Drag-Drop Reorder Not Working

**Symptom**: Social media channels don't reorder when dragged

**Causes**:
1. **Touch device without mouse**
   - Drag-drop requires mouse on desktop
   - Solution: Use desktop browser

2. **JavaScript error**
   - Check browser console for errors
   - Report as GitHub issue

**Fix**:
1. Reload page (Cmd+R or Ctrl+R)
2. Try different browser
3. Use keyboard shortcuts if available (future feature)

---

### Validation Errors

**Email Validation**

**Error**: "Email must include @zohocorp.com. Example: name@zohocorp.com"

**Cause**: Email domain must be `@zohocorp.com` (case-insensitive)

**Valid Examples**:
- ✅ `john.doe@zohocorp.com`
- ✅ `jdoe@zohocorp.com`
- ✅ `John.Doe@ZohoCorp.com` (case-insensitive)

**Invalid Examples**:
- ❌ `john.doe@zoho.com` (wrong domain)
- ❌ `john.doe@gmail.com` (wrong domain)
- ❌ `john.doe` (missing domain)

**Phone Validation**

**Error**: "Phone must be at least 10 digits (excluding + and country code)"

**Cause**: Phone must have at least 10 numeric digits (not counting + or country code)

**Valid Examples**:
- ✅ `+1 (555) 123-4567` (11 digits, formatted)
- ✅ `5551234567` (10 digits, unformatted)
- ✅ `+91 98765 43210` (10 digits, India format)

**Invalid Examples**:
- ❌ `555-1234` (only 7 digits)
- ❌ `+1 555 1234` (only 7 digits after country code)

---

## Performance Issues

### Slow Loading

**Symptom**: App takes >3 seconds to load

**Causes**:
1. **Network connection**
   - Check internet speed
   - GitHub Pages CDN may be slow in your region

2. **Large browser cache**
   - Clear browser cache to free space

3. **Many browser extensions**
   - Disable extensions temporarily to test

**Fix**:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache: Settings → Privacy → Clear browsing data
3. Try different network (WiFi vs mobile data)

### High Memory Usage

**Symptom**: Browser tab uses >200MB RAM

**Causes**:
1. **Memory leak** (unlikely, but possible)
   - Report as GitHub issue with browser version

2. **Multiple signature previews**
   - Close other tabs with the app open

**Fix**:
1. Reload page to clear memory
2. Close unused browser tabs
3. Restart browser if issue persists

---

## Browser-Specific Issues

### Safari

**Issue**: Copy button doesn't work on first click

**Cause**: Safari requires user gesture for clipboard access

**Fix**: Click copy button twice (first click grants permission)

---

### Firefox

**Issue**: Focus outlines too thick

**Cause**: Firefox default focus styles

**Fix**: This is intentional for accessibility - do not disable

---

### Chrome

**Issue**: Drag-drop animations stuttering

**Cause**: GPU acceleration disabled

**Fix**: Enable hardware acceleration in Chrome settings

---

## Reporting Issues

### Before Reporting
1. ✅ Check this troubleshooting guide
2. ✅ Try in different browser (Chrome, Firefox, Safari)
3. ✅ Clear browser cache and reload
4. ✅ Disable browser extensions temporarily
5. ✅ Check browser console for errors (F12)

### When Reporting
Include the following information:

**Required**:
- Browser name and version (e.g., Chrome 120, Firefox 119)
- Operating system (e.g., macOS 14, Windows 11, iOS 17)
- Steps to reproduce the issue
- Expected vs actual behavior

**Optional but Helpful**:
- Screenshots or screen recording
- Browser console errors (copy error details from error modal)
- Network tab screenshot (F12 → Network)

**Submit Issue**:
https://github.com/tejasgadhia/zoho-signature-generator/issues

---

## Emergency Recovery

### Nuclear Option: Complete Reset

If nothing else works:

1. **Clear all browser data**:
   - Settings → Privacy → Clear browsing data
   - Select "All time" for time range
   - Check: Cookies, Cache, Site data
   - Click "Clear data"

2. **Reload app**:
   - Visit https://tejasgadhia.github.io/zoho-signature-generator/
   - Hard refresh: Cmd+Shift+R or Ctrl+Shift+R

3. **Re-enter data**:
   - Fill in form fields again
   - Select signature style
   - Toggle optional fields

4. **If still broken**:
   - Try different browser entirely
   - Report as critical bug on GitHub

---

**Last Updated**: 2026-02-02 | **Version**: 3.4.0
