# Phase 8 Starter Prompt - HTML Integration & Testing

## Context
Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript. Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status
- **Branch**: refactor/vite-typescript
- **Location**: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- **Completed**: Phase 1-7 (Setup, Assets, CSS, Types, Utils, SignatureGenerator, App State & UI Controllers)
- **Phase 7**: App State & UI Controllers complete (dea1417)
- **Plan**: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 7 Complete ✓
Created modular app state and UI controllers with full type safety:
- ✅ AppStateManager: Centralized state with localStorage persistence
- ✅ FormHandler: All form input events, validation, preview updates
- ✅ PreviewRenderer: Live signature preview rendering
- ✅ ClipboardManager: Modern + fallback clipboard APIs
- ✅ ModalController: Modal dialogs for import instructions
- ✅ ThemeManager: Light/dark mode theme switching
- ✅ DragDropHandler: Drag-and-drop reordering for social channels
- ✅ main.ts: Wired all modules together
- ✅ TypeScript compiles without errors

## Next Task: Phase 8 - HTML Integration & Testing (~2-3 hours)

### Goal
Integrate the TypeScript modules with the existing HTML structure, test functionality, and prepare for Phase 9 (final migration).

### Files to Update

#### 1. `index.html` - Update script tags and structure
```html
<!-- Remove old script tags -->
<!-- <script src="js/app.js"></script> -->
<!-- <script src="js/modal.js"></script> -->
<!-- <script src="js/signature.js"></script> -->

<!-- Add Vite dev server script (development) or built bundle (production) -->
<script type="module" src="/src/main.ts"></script>
```

**Key changes**:
- Remove old vanilla JS script references
- Add Vite module script
- Ensure all HTML IDs match TypeScript DOM queries
- Verify data attributes (data-field, data-client-type, data-color)
- Check form structure matches FormHandler expectations

#### 2. Test with Vite Dev Server
```bash
npx vite
# Visit http://localhost:5173
```

**Verification checklist**:
- [ ] App loads without console errors
- [ ] Form inputs update preview in real-time
- [ ] Field toggles enable/disable inputs correctly
- [ ] Signature style selector changes preview
- [ ] Accent color selector updates signature color
- [ ] Copy button copies signature to clipboard
- [ ] Dark mode toggle switches themes
- [ ] Format lock icons toggle title case formatting
- [ ] Modal opens with import instructions
- [ ] Drag-drop reordering works for social channels
- [ ] All validation messages display correctly
- [ ] localStorage persistence works (reload page, state restored)

#### 3. Fix any runtime issues

Common issues to watch for:
- **DOM element not found**: Check HTML IDs match TypeScript queries
- **Event listeners not firing**: Verify event setup in FormHandler
- **Preview not rendering**: Check SignatureGenerator.generatePreview call
- **Clipboard copy fails**: Test modern and fallback APIs
- **Modal not opening**: Check ModalController.init called
- **Theme not persisting**: Verify localStorage keys match constants

#### 4. Update `vite.config.ts` if needed

May need to configure:
- Public directory path
- Asset handling
- Base URL for GitHub Pages deployment
- Build output directory

#### 5. Create test build
```bash
npx vite build
npx vite preview
```

Verify production build works correctly.

### Implementation Steps

1. **Update index.html** to use Vite module script
2. **Start Vite dev server**: `npx vite`
3. **Test all functionality** against verification checklist
4. **Fix runtime issues** (DOM queries, event listeners, etc.)
5. **Test production build**: `npx vite build && npx vite preview`
6. **Update CLAUDE.md** with new development workflow
7. **Commit Phase 8** with descriptive message
8. **Create Phase 9 starter prompt** (final migration: remove old files, update deployment)

### Key Design Patterns

**HTML Structure Requirements**:
- All form inputs need proper `id` attributes matching FormHandler queries
- Toggle switches need `data-field` attributes
- Accent color buttons need `data-color` attributes
- Import instruction buttons need `data-client-type` attributes
- Social channel cards need `data-channel` attributes for drag-drop

**Event Binding**:
- All event listeners set up in FormHandler, ThemeManager, DragDropHandler
- Main copy button handled in main.ts
- Modal trigger buttons handled in main.ts
- Dark mode preview toggle handled in main.ts

**State Flow**:
1. User input → FormHandler → AppStateManager.updateFormData()
2. State change → PreviewRenderer.render()
3. Preview rendered with SignatureGenerator.generatePreview()
4. Copy button → ClipboardManager.copySignature() → SignatureGenerator.generate()

### Success Criteria
- ✅ HTML integrated with TypeScript modules
- ✅ Vite dev server runs without errors
- ✅ All form functionality works (input, validation, preview)
- ✅ All UI controls work (toggles, theme, modal, drag-drop)
- ✅ Clipboard copy works (modern + fallback)
- ✅ localStorage persistence works across reloads
- ✅ Production build works correctly
- ✅ No console errors in browser DevTools
- ✅ TypeScript compiles without errors
- ✅ Committed to git with clear commit message

### Autonomy
Work through HTML integration and testing autonomously. Only stop for questions or completion. Commit when done. Create Phase 9 starter prompt (final cleanup and deployment).

---

**Start Phase 8 now.**
