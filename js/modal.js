/**
 * Modal Controller
 * Handles modal open/close functionality for import instructions
 */

const ModalController = {
    modal: null,
    closeButton: null,
    backdrop: null,

    /**
     * Initialize modal controller
     */
    init() {
        this.modal = document.getElementById('modal');
        this.closeButton = this.modal.querySelector('.modal-close');
        this.backdrop = this.modal.querySelector('.modal-backdrop');

        this.setupEventListeners();
    },

    /**
     * Setup event listeners for modal
     */
    setupEventListeners() {
        // Close button click
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // Backdrop click to close
        this.backdrop.addEventListener('click', () => {
            this.close();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Prevent modal content clicks from closing
        const modalContent = this.modal.querySelector('.modal-content');
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    },

    /**
     * Open the modal
     */
    open() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');

        // Trap focus inside modal
        this.trapFocus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close the modal
     */
    close() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';
    },

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.modal.classList.contains('active');
    },

    /**
     * Trap focus inside modal for accessibility
     */
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element when modal opens
        setTimeout(() => {
            firstElement.focus();
        }, 100);

        // Trap focus within modal
        const handleTabKey = (e) => {
            if (!this.isOpen()) {
                document.removeEventListener('keydown', handleTabKey);
                return;
            }

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

        document.addEventListener('keydown', handleTabKey);
    }
};

// Initialize modal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ModalController.init();
    });
} else {
    ModalController.init();
}
