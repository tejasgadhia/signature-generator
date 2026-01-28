# Phase 5 Starter Prompt - TypeScript Utility Functions

## Context
Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript (simplified approach). Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status
- **Branch**: refactor/vite-typescript
- **Location**: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- **Completed**: Phase 1 (8636aaf), Phase 2 (6608d68), Phase 3 (9d6b4a7), Phase 4 (9a105a9)
- **Plan**: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 4 Complete ✓
Created comprehensive TypeScript type definitions and constants:
- ✅ `src/types.ts` (11 interfaces, 3 type aliases)
- ✅ `src/constants.ts` (370+ lines of constants)
- ✅ TypeScript compiles without errors
- ✅ All types match original JavaScript structures exactly

## Next Task: Phase 5 - Utility Functions Module (~1.5 hours)

### Goal
Extract pure utility functions from signature.js into TypeScript modules with full type safety.

### Files to Create

#### 1. `src/utils/validation.ts` - Input validation functions
Extract from original `~/Claude/zoho-signature-generator/js/app.js` and `signature.js`:
- `isValidEmail(email: string): boolean`
- `isValidPhone(phone: string): boolean`
- `isValidUrl(url: string): boolean`
- `validateEmailPrefix(prefix: string): string | null` (returns error message or null)

#### 2. `src/utils/formatting.ts` - Text formatting utilities
Extract from original `~/Claude/zoho-signature-generator/js/app.js`:
- `toSmartTitleCase(str: string): string` (uses PRESERVED_ACRONYMS, LOWERCASE_WORDS)
- `escapeHtml(text: string): string`
- `sanitizePhone(phone: string): string` (for tel: links)
- `generateEmailPrefix(fullName: string): string` (auto-generate from name)

#### 3. `src/utils/url.ts` - URL manipulation utilities
Extract from original `~/Claude/zoho-signature-generator/js/signature.js`:
- `normalizeUrl(url: string): string` (add https:// if missing)
- `sanitizeSocialUrl(input: string, domain: string): string` (extract username/path)
- `cleanLinkedInUrl(url: string): string` (remove tracking params)
- `getTrackedWebsiteURL(emailPrefix: string): string` (add UTM params)

#### 4. `src/utils/storage.ts` - localStorage wrappers
Extract localStorage operations from `app.js`:
- `getThemePreference(): 'dark' | 'light'`
- `saveThemePreference(theme: 'dark' | 'light'): void`
- `getAccentColor(): string` (returns saved color or default)
- `saveAccentColor(color: string): void`
- `getFormatLockState(field: string): boolean`
- `saveFormatLockState(field: string, enabled: boolean): void`

### Steps
1. Read original code sections for each utility category
2. Create each utility file with proper TypeScript types
3. Import constants and types where needed
4. Add JSDoc comments for documentation
5. Verify TypeScript compiles: `npx tsc --noEmit`
6. Commit Phase 5 with descriptive message
7. Create Phase 6 starter prompt

### Success Criteria
- ✅ 4 utility files created with type-safe functions
- ✅ All functions extracted from original code
- ✅ TypeScript compiles without errors
- ✅ Proper imports from types.ts and constants.ts
- ✅ JSDoc comments on all exported functions
- ✅ Committed to git with clear commit message

### Autonomy
Work through utility extraction autonomously. Only stop for questions or completion. Commit when done. Create Phase 6 starter prompt.

---

**Start Phase 5 now.**
