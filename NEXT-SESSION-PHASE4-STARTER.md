# Phase 4 Starter Prompt - TypeScript Type Definitions

## Context

Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript (simplified approach). Working in isolated worktree - work autonomously, only check in for questions or phase completions.

**Current Status**:
- Branch: `refactor/vite-typescript`
- Location: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- Completed: Phase 1 (8636aaf), Phase 2 (6608d68), Phase 3 (9d6b4a7)
- Plan: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 3 Complete ✓

Split 2231-line `css/styles.css` into 5 focused files:
- ✅ `src/styles/main.css` (509B) - Import orchestrator
- ✅ `src/styles/base.css` (3.7K) - Reset, layout, sidebar
- ✅ `src/styles/form.css` (16K) - Input groups, validation, help system
- ✅ `src/styles/preview.css` (2.2K) - Preview section, theme toggle
- ✅ `src/styles/components.css` (12K) - Modal, import instructions, toast
- ✅ `src/styles/colors.css` (13K) - Style/color selectors, social options
- ✅ Dev server runs clean (no errors/warnings)

## Next Task: Phase 4 - TypeScript Type Definitions (~1 hour)

### Goal

Create comprehensive type definitions for all data structures and constants.

### Files to Create

**1. `src/types.ts`** - All TypeScript interfaces and types:
- `FormData` interface (name, title, department, email, phone, linkedin, twitter, bookings, website)
- `FieldToggles` interface (boolean flags for optional fields)
- `SignatureStyle` type (union of 6 style names: classic, professional, compact, modern, creative, minimal)
- `SocialOptions` interface (enabled, channels, displayType)
- `AppState` interface (formData, fieldToggles, signatureStyle, socialOptions, isDarkModePreview, accentColor)
- `SignatureConfig` interface (data, style, socialOptions, accentColor, isPreview)

**2. `src/constants.ts`** - All constant values:
- `PRESERVED_ACRONYMS` (18 acronyms: VP, CEO, iOS, API, etc.)
- `LOWERCASE_WORDS` (16 words: a, an, the, and, etc.)
- `EXAMPLE_DATA` (FormData with Jasmine Frank example)
- Color constants: `ZOHO_RED`, `ZOHO_GREEN`, `ZOHO_BLUE`, `ZOHO_YELLOW`

### Steps

1. Read original code to extract type information:
   - `~/Claude/zoho-signature-generator/js/app.js` (AppState structure)
   - `~/Claude/zoho-signature-generator/js/signature.js` (constants, acronyms)

2. Create `src/types.ts` with all interfaces:
   - Follow plan lines 337-391 for exact structure
   - Use TypeScript best practices (readonly where applicable, strict types)

3. Create `src/constants.ts` with all constants:
   - Follow plan lines 394-432 for exact structure
   - Import types from `./types`

4. Verify TypeScript compiles:
   ```bash
   npx tsc --noEmit
   ```

5. Commit Phase 4:
   ```bash
   git add src/types.ts src/constants.ts
   git commit -m "feat: Phase 4 - TypeScript type definitions and constants"
   ```

### Success Criteria

- ✅ `src/types.ts` created with all 6 interfaces/types
- ✅ `src/constants.ts` created with all constants
- ✅ TypeScript compiles without errors (`npx tsc --noEmit`)
- ✅ Types match original JavaScript data structures exactly
- ✅ Committed to git with clear commit message

### Autonomy

Work through type extraction autonomously. Only stop for questions or completion. Commit when done. Create Phase 5 starter prompt.

**Start Phase 4 now.**
