/**
 * Clipboard Manager
 * Handles copying signature HTML to clipboard with modern and fallback APIs
 */

import type { AppStateManager } from './state';
import { SignatureGenerator } from '../signature-generator/index';
import { ANIMATION_DURATIONS } from '../constants';

export class ClipboardManager {
  private stateManager: AppStateManager;
  private toastContainer: HTMLElement | null;

  constructor(stateManager: AppStateManager) {
    this.stateManager = stateManager;
    this.toastContainer = document.getElementById('toast');
  }

  /**
   * Copy signature HTML to clipboard
   * Returns true on success, false on failure
   */
  async copySignature(): Promise<boolean> {
    const state = this.stateManager.getState();

    try {
      // Generate the actual signature HTML (not preview)
      const html = SignatureGenerator.generate(
        state.formData,
        state.signatureStyle,
        state.socialOptions,
        state.accentColor,
        false  // isPreview = false for actual clipboard copy
      );

      // Try modern clipboard API first
      if (navigator.clipboard && typeof navigator.clipboard.write === 'function') {
        await this.modernClipboard(html);
        this.showToast('✓ Signature copied! Ready to paste into your email client.');
        return true;
      } else {
        // Fallback to execCommand
        await this.fallbackClipboard(html);
        this.showToast('✓ Signature copied! Ready to paste into your email client.');
        return true;
      }
    } catch (error) {
      console.error('Failed to copy signature:', error);
      this.showToast('✗ Failed to copy signature. Please try again.', 'error');
      return false;
    }
  }

  /**
   * Modern clipboard API (supports HTML + plain text)
   */
  private async modernClipboard(html: string): Promise<void> {
    try {
      // Create blob with HTML content
      const htmlBlob = new Blob([html], { type: 'text/html' });

      // Create plain text version (strip HTML tags)
      const plainText = this.htmlToPlainText(html);
      const textBlob = new Blob([plainText], { type: 'text/plain' });

      // Write both formats to clipboard
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });

      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      console.error('Modern clipboard failed:', error);
      throw error;
    }
  }

  /**
   * Fallback clipboard using execCommand
   */
  private async fallbackClipboard(html: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.contentEditable = 'true';
        tempContainer.innerHTML = html;

        document.body.appendChild(tempContainer);

        // Select the content
        const range = document.createRange();
        range.selectNodeContents(tempContainer);

        const selection = window.getSelection();
        if (!selection) {
          throw new Error('Could not get window selection');
        }

        selection.removeAllRanges();
        selection.addRange(range);

        // Copy to clipboard
        const success = document.execCommand('copy');

        // Clean up
        selection.removeAllRanges();
        document.body.removeChild(tempContainer);

        if (success) {
          resolve();
        } else {
          reject(new Error('execCommand copy failed'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert HTML to plain text (simple implementation)
   */
  private htmlToPlainText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  /**
   * Show toast notification
   */
  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    if (!this.toastContainer) {
      console.warn('Toast container not found');
      return;
    }

    // Set message and type
    this.toastContainer.textContent = message;
    this.toastContainer.className = `toast ${type}`;
    this.toastContainer.classList.add('show');

    // Hide after duration
    setTimeout(() => {
      this.toastContainer?.classList.remove('show');
    }, ANIMATION_DURATIONS.TOAST);
  }
}
