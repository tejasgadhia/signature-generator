/**
 * Form Handler
 * Manages all form input events, validation, and preview updates
 */

import type { AppStateManager } from './state';
import type { PreviewRenderer } from './preview-renderer';
import type { FormData } from '../types';
import {
  isValidEmail,
  isValidPhone,
  cleanLinkedInUrl,
  generateEmailPrefix,
  toSmartTitleCase,
  getTrackedWebsiteURL
} from '../utils';

export class FormHandler {
  private stateManager: AppStateManager;
  private previewRenderer: PreviewRenderer;

  constructor(stateManager: AppStateManager, previewRenderer: PreviewRenderer) {
    this.stateManager = stateManager;
    this.previewRenderer = previewRenderer;
  }

  /**
   * Initialize all form listeners
   */
  initialize(): void {
    this.setupInputListeners();
    this.setupToggleListeners();
    this.setupStyleSelector();
    this.setupAccentColorSelector();
    this.setupFormatLockIcons();
    this.setupSmartTitleCase();
    this.setupWebsiteTracking();
    this.setupClearButtons();
  }

  /**
   * Setup input field listeners
   */
  private setupInputListeners(): void {
    // Name input
    const nameInput = document.getElementById('name') as HTMLInputElement;
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.handleFieldChange('name', value);

        // Auto-generate email prefix from name
        const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;
        if (emailPrefixInput && !emailPrefixInput.value) {
          const prefix = generateEmailPrefix(value);
          emailPrefixInput.value = prefix;
          this.handleEmailPrefixChange(prefix);
        }
      });
    }

    // Email prefix input (with validation)
    const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;
    if (emailPrefixInput) {
      emailPrefixInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value.toLowerCase();
        (e.target as HTMLInputElement).value = value;  // Force lowercase
        this.handleEmailPrefixChange(value);
      });

      emailPrefixInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.validateField('email', `${value}@zohocorp.com`);
      });
    }

    // LinkedIn username input
    const linkedinUsernameInput = document.getElementById('linkedin-username') as HTMLInputElement;
    if (linkedinUsernameInput) {
      linkedinUsernameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        const fullUrl = cleanLinkedInUrl(value);
        this.handleFieldChange('linkedin', fullUrl);
      });

      linkedinUsernameInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        if (value) {
          const cleaned = value.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '');
          (e.target as HTMLInputElement).value = cleaned;
        }
      });
    }

    // Twitter/X username input
    const twitterUsernameInput = document.getElementById('x-username') as HTMLInputElement;
    if (twitterUsernameInput) {
      twitterUsernameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        // Construct full URL from username
        const cleaned = value.replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '');
        const fullUrl = cleaned ? `https://x.com/${cleaned}` : '';
        this.handleFieldChange('twitter', fullUrl);
      });

      twitterUsernameInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        if (value) {
          const cleaned = value.replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '');
          (e.target as HTMLInputElement).value = cleaned;
        }
      });
    }

    // Bookings ID input
    const bookingsIdInput = document.getElementById('bookings-id') as HTMLInputElement;
    if (bookingsIdInput) {
      bookingsIdInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        const fullUrl = value ? `https://bookings.zohocorp.com/#/${value}` : '';
        this.handleFieldChange('bookings', fullUrl);
      });
    }

    // Standard text inputs (title, department, phone)
    ['title', 'department', 'phone'].forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      input.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.handleFieldChange(fieldId as keyof FormData, value);
      });

      input.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.validateField(fieldId as keyof FormData, value);
      });
    });
  }

  /**
   * Handle email prefix change
   */
  private handleEmailPrefixChange(prefix: string): void {
    const fullEmail = prefix ? `${prefix}@zohocorp.com` : '';
    this.handleFieldChange('email', fullEmail);
  }

  /**
   * Handle field value change
   */
  private handleFieldChange(field: keyof FormData, value: string): void {
    this.stateManager.updateFormData(field, value);
    this.previewRenderer.render();
  }

  /**
   * Validate a field and show/hide error messages
   */
  private validateField(field: keyof FormData, value: string): boolean {
    const inputGroup = document.querySelector(`#${field}`)?.closest('.input-group');
    const errorMessage = inputGroup?.querySelector('.error-message') as HTMLElement;

    if (!errorMessage) return true;

    let isValid = true;
    let message = '';

    switch (field) {
      case 'email':
        if (value && !isValidEmail(value)) {
          isValid = false;
          message = '✗ Must use @zohocorp.com domain. Example: john.doe@zohocorp.com';
        }
        break;

      case 'phone':
        if (value && !isValidPhone(value)) {
          isValid = false;
          message = '✗ Must contain at least 10 digits. Example: +1 (281) 330-8004';
        }
        break;
    }

    // Show/hide error message
    if (!isValid) {
      errorMessage.textContent = message;
      errorMessage.classList.add('visible');
      errorMessage.setAttribute('aria-hidden', 'false');
    } else {
      errorMessage.classList.remove('visible');
      errorMessage.setAttribute('aria-hidden', 'true');
    }

    return isValid;
  }

  /**
   * Setup toggle switches for optional fields
   */
  private setupToggleListeners(): void {
    const toggles = document.querySelectorAll('.toggle-switch input[data-field]');

    toggles.forEach((toggle) => {
      const checkbox = toggle as HTMLInputElement;
      const field = checkbox.dataset.field;
      if (!field) return;

      checkbox.addEventListener('change', () => {
        const enabled = checkbox.checked;
        const fieldToggles = this.stateManager.getState().fieldToggles;

        // Only update toggle if it's a valid toggle field
        if (field in fieldToggles) {
          this.stateManager.updateFieldToggle(field as any, enabled);

          // Disable/enable the corresponding input
          const input = document.getElementById(field) as HTMLInputElement;
          if (input) {
            input.disabled = !enabled;
            if (!enabled) {
              input.value = '';
              this.handleFieldChange(field as keyof FormData, '');
            }
          }

          this.previewRenderer.render();
        }
      });
    });
  }

  /**
   * Setup signature style selector
   */
  private setupStyleSelector(): void {
    const styleRadios = document.querySelectorAll<HTMLInputElement>('input[name="signature-style"]');

    styleRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          const style = target.value as any;
          this.stateManager.setSignatureStyle(style);
          this.previewRenderer.render();
        }
      });
    });
  }

  /**
   * Setup accent color selector
   */
  private setupAccentColorSelector(): void {
    const colorButtons = document.querySelectorAll<HTMLButtonElement>('.accent-color-btn');

    colorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const color = button.dataset.color;
        if (!color) return;

        // Update active state
        colorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update state and preview
        this.stateManager.setAccentColor(color);
        this.previewRenderer.render();
      });
    });
  }

  /**
   * Setup format lock icons (title case auto-formatting)
   */
  private setupFormatLockIcons(): void {
    document.querySelectorAll('.format-lock-icon').forEach(icon => {
      const fieldId = (icon as HTMLElement).dataset.field as 'name' | 'title' | 'department';

      // Set initial state
      const isLocked = this.stateManager.getFormatLock(fieldId);
      if (!isLocked) {
        icon.classList.remove('locked');
        icon.setAttribute('title', 'Title Case OFF - click to enable auto-capitalization');
      } else {
        icon.setAttribute('title', 'Title Case ON - formats as you type');
      }

      // Toggle on click
      icon.addEventListener('click', () => {
        this.stateManager.toggleFormatLock(fieldId);
        const newState = this.stateManager.getFormatLock(fieldId);

        icon.classList.toggle('locked');
        icon.setAttribute('title', newState
          ? 'Title Case ON - formats as you type'
          : 'Title Case OFF - click to enable auto-capitalization'
        );
      });
    });
  }

  /**
   * Setup smart title case formatting
   */
  private setupSmartTitleCase(): void {
    ['name', 'title', 'department'].forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      const applyFormatting = (preserveCursor = false) => {
        const isLocked = this.stateManager.getFormatLock(fieldId as 'name' | 'title' | 'department');

        if (isLocked && input.value.trim()) {
          // Store cursor position
          const cursorPos = preserveCursor ? input.selectionStart : null;

          input.value = toSmartTitleCase(input.value);
          this.handleFieldChange(fieldId as keyof FormData, input.value);

          // Restore cursor position
          if (preserveCursor && cursorPos !== null) {
            input.setSelectionRange(cursorPos, cursorPos);
          }
        }
      };

      // Apply on input for instant feedback
      input.addEventListener('input', () => applyFormatting(true));

      // Apply on blur for final cleanup
      input.addEventListener('blur', () => applyFormatting(false));

      // Apply on paste
      input.addEventListener('paste', () => {
        setTimeout(() => applyFormatting(false), 10);
      });
    });
  }

  /**
   * Setup website URL tracking (UTM parameters)
   */
  private setupWebsiteTracking(): void {
    const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;

    if (emailPrefixInput) {
      emailPrefixInput.addEventListener('input', () => {
        const prefix = emailPrefixInput.value.trim();
        const trackedUrl = getTrackedWebsiteURL(prefix);
        this.stateManager.updateFormData('website', trackedUrl);
        this.previewRenderer.render();
      });
    }

    // Set initial tracked URL
    const initialPrefix = emailPrefixInput?.value.trim() || 'zoho-employee';
    const initialTrackedUrl = getTrackedWebsiteURL(initialPrefix);
    this.stateManager.updateFormData('website', initialTrackedUrl);
  }

  /**
   * Setup clear buttons for inputs
   */
  private setupClearButtons(): void {
    const clearButtons = document.querySelectorAll<HTMLButtonElement>('.clear-btn');

    clearButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const fieldId = button.dataset.field as keyof FormData;
        if (!fieldId) return;

        const input = document.getElementById(fieldId) as HTMLInputElement;
        if (input) {
          input.value = '';
          this.handleFieldChange(fieldId, '');
        }
      });
    });
  }
}
