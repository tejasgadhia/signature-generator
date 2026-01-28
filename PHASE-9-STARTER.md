# Phase 9 Starter Prompt - Final Migration & Deployment

## Context
Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript. Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status
- **Branch**: refactor/vite-typescript
- **Location**: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- **Completed**: Phase 1-8 (Setup through HTML Integration)
- **Phase 8**: HTML Integration & DOM alignment complete (0a61703)
- **Plan**: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 8 Complete ✓
Integrated TypeScript modules with HTML structure:
- ✅ Full HTML form structure integrated
- ✅ Fixed all DOM element ID mismatches
- ✅ Updated data attributes and CSS classes
- ✅ Vite module script configured
- ✅ TypeScript compiles without errors
- ✅ Preview dark mode toggle wired correctly
- ✅ ThemeManager disabled (not needed for MVP)

## Next Task: Phase 9 - Final Migration & Deployment (~2-3 hours)

### Goal
Complete the migration by testing functionality, cleaning up old files, configuring production build, and preparing for merge to main.

### Implementation Steps

#### 1. Runtime Testing with Vite Dev Server
```bash
npx vite
# Visit http://localhost:5173
```

**Verification checklist** (from Phase 8 starter):
- [ ] App loads without console errors
- [ ] Form inputs update preview in real-time
- [ ] Field toggles enable/disable inputs correctly
- [ ] Signature style selector changes preview
- [ ] Accent color selector updates signature color
- [ ] Copy button copies signature to clipboard
- [ ] Preview dark mode toggle works
- [ ] Format lock icons toggle title case formatting
- [ ] Modal opens with import instructions
- [ ] Drag-drop reordering works for social channels
- [ ] All validation messages display correctly
- [ ] localStorage persistence works (reload page, state restored)

**Fix any runtime issues discovered during testing**

#### 2. Remove Old Vanilla JS Files

```bash
# Backup first (optional - git tracks history)
mkdir -p old-vanilla-backup
cp -r js/ old-vanilla-backup/

# Remove old JS files (no longer needed)
rm -rf js/

# Verify git status
git status
```

Files to remove:
- `js/app.js`
- `js/modal.js`
- `js/signature.js`
- `js/help-content.js`
- `js/phone-formatter.js`
- Any other JS files in the `js/` directory

#### 3. Configure Production Build

**Update `vite.config.ts` for GitHub Pages**:
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/zoho-signature-generator/', // GitHub Pages base path
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Enable sourcemaps for debugging
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined // Keep all code in one bundle for simplicity
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
```

#### 4. Test Production Build

```bash
# Create production build
npx vite build

# Preview production build locally
npx vite preview

# Visit http://localhost:4173
# Test all functionality again in production mode
```

#### 5. Update Documentation

**Update `CLAUDE.md`** with new development workflow:

Add/update sections:
- **Tech Stack**: Update to mention Vite + TypeScript
- **Module Organization**: Document new TypeScript module structure
- **Development Workflow**: Update local development commands
- **Build & Deployment**: Add production build instructions

**Example updates**:
```markdown
## Tech Stack

- **Frontend**: TypeScript + Vite
- **Styling**: CSS3 with custom properties
- **Build Tool**: Vite (module bundler)
- **Browser APIs**: Clipboard API, localStorage, URL API
- **Deployment**: GitHub Pages (main branch)

## Module Organization

**TypeScript Modules**:
- `src/main.ts` - Application entry point
- `src/app/` - Application state and form handlers
  - `state.ts` - Centralized state management
  - `form-handler.ts` - Form input handling and validation
  - `preview-renderer.ts` - Live preview rendering
  - `clipboard.ts` - Clipboard operations
- `src/signature-generator/` - Signature HTML generation
- `src/ui/` - UI controllers (modal, theme, drag-drop)
- `src/utils/` - Utility functions
- `src/types.ts` - TypeScript type definitions
- `src/constants.ts` - Application constants

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev         # Start Vite dev server (localhost:5173)
```

### Production Build
```bash
npm run build       # Build for production (outputs to dist/)
npm run preview     # Preview production build locally
```

### Type Checking
```bash
npm run type-check  # Run TypeScript compiler (no emit)
```
```

**Update `package.json` scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

#### 6. Update README.md

Add development section for contributors:

```markdown
## Development

This project uses Vite + TypeScript for development.

### Setup
```bash
npm install
npm run dev
```

### Building
```bash
npm run build
```

The production build outputs to `dist/` directory.
```

#### 7. Configure GitHub Pages Deployment

**Update `.github/workflows/deploy.yml`** (or create if doesn't exist):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 8. Test End-to-End

**Full testing checklist**:
- [ ] Clone repo fresh (simulate new contributor)
- [ ] `npm install` works
- [ ] `npm run dev` starts dev server
- [ ] All functionality works in dev mode
- [ ] `npm run build` creates production build
- [ ] `npm run preview` serves production build
- [ ] All functionality works in production mode
- [ ] No console errors in either mode
- [ ] TypeScript type checking passes

#### 9. Create Merge Plan

**Before merging to main**:
1. Review all changes in refactor branch
2. Ensure no breaking changes for users
3. Update CHANGELOG.md with migration notes
4. Tag version (e.g., `v2.0.0-beta`)
5. Test deployed site thoroughly

**Merge strategy**:
```bash
# From main worktree
cd ~/Claude/zoho-signature-generator

# Fetch latest from refactor branch
git fetch origin refactor/vite-typescript

# Review changes before merge
git log main..refactor/vite-typescript --oneline
git diff main...refactor/vite-typescript

# Merge (or create PR)
git merge refactor/vite-typescript
# or
gh pr create --base main --head refactor/vite-typescript
```

#### 10. Cleanup Worktree (After Merge)

```bash
# Only after successful merge and deployment
cd ~/Claude/zoho-signature-generator
git worktree remove ../zoho-signature-generator-refactor
```

### Success Criteria
- ✅ Vite dev server runs without errors
- ✅ All functionality works in development mode
- ✅ Production build successful
- ✅ All functionality works in production mode
- ✅ Old vanilla JS files removed
- ✅ Documentation updated (CLAUDE.md, README.md)
- ✅ GitHub Actions workflow configured
- ✅ TypeScript compiles without errors
- ✅ No console errors in browser
- ✅ Ready to merge to main branch

### Autonomy
Work through final migration autonomously. Only stop for questions, completion, or before merging to main branch.

---

**Start Phase 9 now.**
