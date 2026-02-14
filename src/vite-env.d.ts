/// <reference types="vite/client" />

import { AppStateManager } from './app/state';
import { PreviewRenderer } from './app/preview-renderer';
import { ClipboardManager } from './app/clipboard';

declare global {
    interface Window {
        AppState: AppStateManager;
        PreviewRenderer: PreviewRenderer;
        ClipboardManager: ClipboardManager;
        copySignatureFromModal: (event: Event) => Promise<void>;
    }
}
