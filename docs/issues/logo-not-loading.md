# Logo Not Loading Issue

**Status:** To Fix
**Priority:** Medium
**Created:** 2026-01-22

## Problem

The Zoho Mail logo (`assets/mail-full.svg`) is not displaying in the modal, even when user is connected to the internet.

## Evidence

- User confirmed internet connection is active
- Logo path in modal: `assets/mail-full.svg`  
- Same logo loads successfully in Zoho Mail's own "Add New Signature" modal (see screenshot)

## Potential Causes

1. **Incorrect path**: Should it be `./assets/mail-full.svg` or `/assets/mail-full.svg`?
2. **SVG whitespace issue**: Logo has white text (`fill:#FFFFFF`) which is invisible on white modal background
3. **Cross-origin issues**: If served from different domain
4. **File permission issues**: SVG might not be readable

## Investigation Steps

1. Check if `assets/mail-full.svg` exists in repo
2. Test different path formats (relative vs absolute)
3. Inspect SVG content for white-on-white issue
4. Check browser console for 404 or CORS errors
5. Consider using PNG version if SVG has issues

## Proposed Solutions

**Option A: Fix SVG path**
```html
<img src="./assets/mail-full.svg" alt="Zoho Mail logo" class="modal-logo-badge">
```

**Option B: Use PNG instead**
- Convert SVG to PNG with transparent background
- Ensure logo colors work on white background

**Option C: Use icon-only version**
- Use mail envelope icon instead of full wordmark
- Simpler, smaller, more reliable

## Next Steps

- [ ] Verify file exists and path is correct
- [ ] Check SVG colors (white text issue?)
- [ ] Test in browser console
- [ ] Implement fix based on findings

## Related

- Modal redesign: feature/import-modal-redesign branch
- Design document: docs/designs/2026-01-22-import-modal-redesign.md
