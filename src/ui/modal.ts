/**
 * Modal Controller
 * Manages modal dialog functionality (import instructions)
 */

export type EmailClientType = 'zoho-mail' | 'zoho-desk' | 'gmail' | 'apple-mail' | 'outlook';

interface ModalInstructions {
  title: string;
  header: string;
  body: string;
}

export class ModalController {
  private static modal: HTMLElement | null = null;
  private static closeButton: HTMLElement | null = null;
  private static backdrop: HTMLElement | null = null;
  private static handleTabKey: ((e: KeyboardEvent) => void) | null = null;

  /**
   * Initialize modal controller
   */
  static init(): void {
    this.modal = document.getElementById('import-modal');

    if (!this.modal) {
      console.warn('Modal element not found. Modal functionality disabled.');
      return;
    }

    this.closeButton = this.modal.querySelector('.modal-close');
    this.backdrop = this.modal.querySelector('.modal-backdrop');

    if (!this.closeButton || !this.backdrop) {
      console.warn('Modal child elements missing. Modal may not function correctly.');
    }

    this.setupEventListeners();
  }

  /**
   * Setup event listeners for modal
   */
  private static setupEventListeners(): void {
    if (!this.modal) return;

    // Close button click
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    // Backdrop click to close
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        this.close();
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Prevent modal content clicks from closing
    const modalContent = this.modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  /**
   * Open the modal with client-specific content
   */
  static open(clientType: EmailClientType = 'zoho-mail'): void {
    if (!this.modal) {
      console.warn('Cannot open modal: modal element not initialized');
      return;
    }

    // Update modal content based on client type
    this.updateContent(clientType);

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');

    // Trap focus inside modal
    this.trapFocus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /**
   * Update modal content for specific email client
   */
  private static updateContent(clientType: EmailClientType): void {
    if (!this.modal) return;

    const modalHeader = this.modal.querySelector('#modal-header-content');
    const modalBody = this.modal.querySelector('#modal-body-content');

    if (!modalHeader || !modalBody) {
      console.warn('Modal header or body not found');
      return;
    }

    const content = this.getClientInstructions(clientType);

    // Inject header + close button
    modalHeader.innerHTML = content.header + `
      <button type="button" class="modal-close" aria-label="Close modal">×</button>
    `;

    // Re-attach close button event listener
    const closeButton = modalHeader.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    // Inject body
    modalBody.innerHTML = content.body;
  }

  /**
   * Get instructions for specific email client
   * NOTE: This is a simplified version. The full implementation would include
   * all the HTML templates from modal.js lines 124-503
   */
  private static getClientInstructions(clientType: EmailClientType): ModalInstructions {
    const instructions: Record<EmailClientType, ModalInstructions> = {
      'zoho-mail': {
        title: 'Zoho Mail',
        header: `
          <div class="modal-header-with-logo">
            <img src="assets/mail-full.svg" alt="Zoho Mail logo" class="modal-logo-badge">
            <div class="modal-header-title-group">
              <h2 id="modalTitle">Zoho Mail</h2>
              <div class="modal-time-estimate" aria-label="Estimated time 1 minute, 5 steps total">
                ~1 minute • 5 steps
              </div>
            </div>
          </div>
        `,
        body: `
          <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #E42527;">
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">1</div>
              <div class="step-content">
                <div class="step-title">
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-8z"/>
                    </svg>
                    Copy Signature
                  </button>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">2</div>
              <div class="step-content">
                <div class="step-title">
                  Open <a href="https://mail.zoho.com" target="_blank" rel="noopener noreferrer" class="external-link">Zoho Mail</a> → <strong>Settings</strong> → <strong>Signature</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">3</div>
              <div class="step-content">
                <div class="step-title">
                  Select your signature, then click the <strong>Insert HTML</strong> button
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">4</div>
              <div class="step-content">
                <div class="step-title">
                  Paste using <kbd data-key="⌘V"></kbd> or <kbd data-key="Ctrl+V"></kbd>, then click <strong>Insert</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">5</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>Update</strong> to save your signature
                </div>
              </div>
            </li>
          </ol>
          <div class="tip-box-new pro-tip" role="note">
            <span class="tip-icon" aria-label="Tip">💡</span>
            <div class="tip-content">
              <strong>Tip:</strong> Test your signature by composing a new email.
            </div>
          </div>
        `
      },
      // NOTE: In the actual implementation, add all other client types
      // (zoho-desk, gmail, apple-mail, outlook) with their full HTML
      'zoho-desk': {
        title: 'Zoho Desk',
        header: `<h2>Zoho Desk</h2>`,
        body: `<p>Zoho Desk instructions...</p>`
      },
      'gmail': {
        title: 'Gmail',
        header: `<h2>Gmail</h2>`,
        body: `<p>Gmail instructions...</p>`
      },
      'apple-mail': {
        title: 'Apple Mail',
        header: `<h2>Apple Mail</h2>`,
        body: `<p>Apple Mail instructions...</p>`
      },
      'outlook': {
        title: 'Outlook',
        header: `<h2>Outlook</h2>`,
        body: `<p>Outlook instructions...</p>`
      }
    };

    return instructions[clientType] || instructions['zoho-mail'];
  }

  /**
   * Close the modal
   */
  static close(): void {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Clean up focus trap event listener
    if (this.handleTabKey) {
      document.removeEventListener('keydown', this.handleTabKey);
      this.handleTabKey = null;
    }
  }

  /**
   * Check if modal is open
   */
  static isOpen(): boolean {
    return this.modal?.classList.contains('active') || false;
  }

  /**
   * Trap focus inside modal for accessibility
   */
  private static trapFocus(): void {
    if (!this.modal) return;

    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element when modal opens
    setTimeout(() => {
      if (firstElement) {
        firstElement.focus();
      }
    }, 100);

    // Remove any existing handler
    if (this.handleTabKey) {
      document.removeEventListener('keydown', this.handleTabKey);
    }

    // Trap focus within modal
    this.handleTabKey = (e: KeyboardEvent) => {
      if (!this.isOpen()) return;

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', this.handleTabKey);
  }
}
