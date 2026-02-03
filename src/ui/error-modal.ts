/**
 * Error Modal UI Component
 *
 * Displays user-friendly error messages with recovery options:
 * - Reload Page
 * - Clear Data & Restart
 * - Copy Error Details (for manual reporting)
 * - Dismiss (if non-critical)
 */

import { formatErrorForClipboard, clearAndRestart } from '../utils/error-tracking';

interface ErrorModalOptions {
  title: string;
  message: string;
  errorContext: any;
  dismissible: boolean;
}

let isErrorModalOpen = false;

/**
 * Show error modal with recovery options
 */
export function showErrorModal(options: ErrorModalOptions): void {
  // Prevent duplicate modals
  if (isErrorModalOpen) {
    console.warn('Error modal already open, skipping duplicate');
    return;
  }

  isErrorModalOpen = true;

  // Create modal backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'error-modal-backdrop';
  backdrop.setAttribute('role', 'alertdialog');
  backdrop.setAttribute('aria-labelledby', 'error-modal-title');
  backdrop.setAttribute('aria-describedby', 'error-modal-message');

  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'error-modal-content';

  // Modal HTML
  modal.innerHTML = `
    <div class="error-modal-header">
      <div class="error-icon">⚠️</div>
      <h2 id="error-modal-title">${escapeHtml(options.title)}</h2>
    </div>
    <div class="error-modal-body">
      <p id="error-modal-message">${escapeHtml(options.message)}</p>
    </div>
    <div class="error-modal-actions">
      <button class="error-action-primary" data-action="reload">
        Reload Page
      </button>
      <button class="error-action-secondary" data-action="clear">
        Clear Data & Restart
      </button>
      <button class="error-action-secondary" data-action="copy">
        Copy Error Details
      </button>
      ${options.dismissible ? '<button class="error-action-tertiary" data-action="dismiss">Dismiss</button>' : ''}
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Add event listeners
  modal.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const action = target.getAttribute('data-action');

    if (!action) return;

    switch (action) {
      case 'reload':
        window.location.reload();
        break;

      case 'clear':
        if (confirm('This will clear all your saved data (theme, preferences). Continue?')) {
          clearAndRestart();
        }
        break;

      case 'copy':
        copyErrorToClipboard(options.errorContext);
        break;

      case 'dismiss':
        closeErrorModal(backdrop);
        break;
    }
  });

  // Focus first button
  const firstButton = modal.querySelector('button') as HTMLButtonElement;
  firstButton?.focus();

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

/**
 * Close error modal
 */
function closeErrorModal(backdrop: HTMLElement): void {
  backdrop.remove();
  document.body.style.overflow = '';
  isErrorModalOpen = false;
}

/**
 * Copy error details to clipboard
 */
async function copyErrorToClipboard(errorContext: any): Promise<void> {
  const errorText = formatErrorForClipboard(errorContext);

  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(errorText);
      showCopySuccess();
    } else {
      // Fallback to execCommand
      const textarea = document.createElement('textarea');
      textarea.value = errorText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopySuccess();
    }
  } catch (err) {
    console.error('Failed to copy error details:', err);
    alert('Failed to copy. Please check the browser console for error details.');
  }
}

/**
 * Show temporary success message
 */
function showCopySuccess(): void {
  const button = document.querySelector('[data-action="copy"]') as HTMLButtonElement;
  if (!button) return;

  const originalText = button.textContent;
  button.textContent = '✓ Copied!';
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 2000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
