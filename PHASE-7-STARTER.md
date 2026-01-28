# Phase 7 Starter Prompt - App State & UI Controllers

## Context
Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript. Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status
- **Branch**: refactor/vite-typescript
- **Location**: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- **Completed**: Phase 1-6 (Constants, Types, Styles, Utils, SignatureGenerator modules)
- **Phase 6**: SignatureGenerator module extraction complete (98e5e68)
- **Plan**: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 6 Complete ✓
Created modular SignatureGenerator with full type safety:
- ✅ 4 component modules (logos, dark-mode, social-links, contact-tiers)
- ✅ 8 style generators (classic, professional, compact, modern, creative, minimal, executive, bold)
- ✅ Main SignatureGenerator class with generate/generateLegacy/generatePreview methods
- ✅ TypeScript compiles without errors
- ✅ All signature styles ported to TypeScript with proper types

## Next Task: Phase 7 - App State & UI Controllers (~2-3 hours)

### Goal
Port the application state management and UI controller logic from app.js and modal.js to TypeScript modules.

### Files to Create

#### 1. `src/app/state.ts` - Application State Management
Centralized state management with type safety:
```typescript
export class AppStateManager {
  private state: AppState;

  constructor();
  getState(): AppState;
  updateFormData(field: keyof FormData, value: string): void;
  updateFieldToggle(field: keyof FieldToggles, enabled: boolean): void;
  setSignatureStyle(style: SignatureStyle): void;
  setSocialOptions(options: SocialOptions): void;
  setAccentColor(color: string): void;
  setDarkModePreview(enabled: boolean): void;

  // Storage operations
  loadFromStorage(): void;
  saveToStorage(): void;
}
```

#### 2. `src/app/form-handler.ts` - Form Event Handling
Handles all form input events and validation:
```typescript
export class FormHandler {
  constructor(state: AppStateManager, previewRenderer: PreviewRenderer);

  initialize(): void;
  setupInputListeners(): void;
  setupToggleListeners(): void;
  setupStyleSelector(): void;
  setupAccentColorSelector(): void;
  handleFieldChange(field: keyof FormData, value: string): void;
  validateField(field: keyof FormData, value: string): boolean;
}
```

#### 3. `src/app/preview-renderer.ts` - Preview Rendering
Manages the live signature preview:
```typescript
export class PreviewRenderer {
  constructor(state: AppStateManager);

  render(): void;
  updatePreview(): void;
  toggleDarkMode(enabled: boolean): void;
}
```

#### 4. `src/app/clipboard.ts` - Clipboard Operations
Handles copying signature HTML to clipboard:
```typescript
export class ClipboardManager {
  constructor(state: AppStateManager);

  copySignature(): Promise<boolean>;
  private modernClipboard(html: string): Promise<void>;
  private fallbackClipboard(html: string): Promise<void>;
  showToast(message: string): void;
}
```

#### 5. `src/ui/modal.ts` - Modal Controller
Manages modal dialogs (social media settings, help):
```typescript
export class ModalController {
  static open(modalId: string): void;
  static close(modalId: string): void;
  static setupModalListeners(): void;
  static trapFocus(modalElement: HTMLElement): void;
}
```

#### 6. `src/ui/theme.ts` - Theme Management
Handles light/dark mode theme switching:
```typescript
export class ThemeManager {
  constructor();

  initialize(): void;
  getTheme(): 'light' | 'dark';
  setTheme(theme: 'light' | 'dark'): void;
  toggleTheme(): void;
  setupThemeToggle(): void;
}
```

#### 7. `src/ui/drag-drop.ts` - Drag & Drop Reordering
Manages drag-and-drop reordering for social media channels:
```typescript
export class DragDropHandler {
  constructor(state: AppStateManager);

  initialize(): void;
  setupDragListeners(): void;
  handleDragStart(event: DragEvent): void;
  handleDragOver(event: DragEvent): void;
  handleDrop(event: DragEvent): void;
  saveOrder(): void;
}
```

#### 8. `src/main.ts` - Main Entry Point (update)
Wire everything together:
```typescript
import { AppStateManager } from './app/state';
import { FormHandler } from './app/form-handler';
import { PreviewRenderer } from './app/preview-renderer';
import { ClipboardManager } from './app/clipboard';
import { ModalController } from './ui/modal';
import { ThemeManager } from './ui/theme';
import { DragDropHandler } from './ui/drag-drop';

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const state = new AppStateManager();
  const previewRenderer = new PreviewRenderer(state);
  const formHandler = new FormHandler(state, previewRenderer);
  const clipboardManager = new ClipboardManager(state);
  const themeManager = new ThemeManager();
  const dragDropHandler = new DragDropHandler(state);

  // Initialize all modules
  state.loadFromStorage();
  formHandler.initialize();
  themeManager.initialize();
  dragDropHandler.initialize();
  ModalController.setupModalListeners();

  // Render initial preview
  previewRenderer.render();
});
```

### Implementation Steps

1. **Read original app.js** to understand state management and event handling patterns
2. **Read original modal.js** to understand modal controller patterns
3. **Create state manager** (src/app/state.ts) - central AppState with type safety
4. **Create form handler** (src/app/form-handler.ts) - input events, validation
5. **Create preview renderer** (src/app/preview-renderer.ts) - live preview updates
6. **Create clipboard manager** (src/app/clipboard.ts) - copy functionality
7. **Create modal controller** (src/ui/modal.ts) - modal open/close/focus trap
8. **Create theme manager** (src/ui/theme.ts) - dark mode toggle
9. **Create drag-drop handler** (src/ui/drag-drop.ts) - social channel reordering
10. **Update main.ts** - wire all modules together
11. **Verify TypeScript compiles**: `npx tsc --noEmit`
12. **Commit Phase 7** with descriptive message
13. **Create Phase 8 starter prompt**

### Key Design Patterns

**State Management**:
- Single AppStateManager instance (single source of truth)
- All state changes go through AppStateManager methods
- State changes trigger preview updates automatically
- localStorage persistence handled by AppStateManager

**Event Handling**:
- FormHandler manages all form input events
- Delegates validation to utils (isValidEmail, isValidPhone, etc.)
- Updates AppStateManager on valid inputs
- Triggers PreviewRenderer.render() on changes

**Preview Rendering**:
- PreviewRenderer uses SignatureGenerator.generatePreview()
- Updates DOM preview container
- Handles dark mode toggle for preview only

**Clipboard Operations**:
- Modern API (navigator.clipboard.write) with HTML+text blobs
- Fallback (document.execCommand('copy')) for older browsers
- Toast notification on success/failure

**Modal Management**:
- ModalController provides static methods (open, close)
- Focus trapping within modal (Tab cycles through modal elements)
- Escape key closes modal
- Backdrop click closes modal
- Scroll prevention when modal open

**Theme Management**:
- ThemeManager handles body class toggle (light/dark)
- Persists theme preference to localStorage
- Updates theme toggle checkbox state
- System preference detection on first load

### Success Criteria
- ✅ All app.js logic ported to TypeScript modules
- ✅ All modal.js logic ported to TypeScript modules
- ✅ State management centralized in AppStateManager
- ✅ Event handling separated into dedicated handlers
- ✅ Preview rendering works with SignatureGenerator
- ✅ Clipboard copy works (modern + fallback)
- ✅ Modal controller manages focus and keyboard navigation
- ✅ Theme manager toggles light/dark mode
- ✅ TypeScript compiles without errors
- ✅ main.ts initializes all modules correctly
- ✅ Committed to git with clear commit message

### Autonomy
Work through app state and UI controller extraction autonomously. Only stop for questions or completion. Commit when done. Create Phase 8 starter prompt.

---

**Start Phase 7 now.**
