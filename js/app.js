/**
 * Main Application Logic
 * Handles form interactions, preview updates, and copy functionality
 */

// Application state
const AppState = {
    formData: {
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        website: 'https://www.zoho.com'
    },
    fieldToggles: {
        title: true,
        department: true,
        email: true,
        phone: true,
        linkedin: true,
        twitter: true,
        website: true
    },
    signatureStyle: 'classic',
    socialOptions: {
        enabled: true,
        channels: ['twitter', 'linkedin', 'facebook', 'instagram'],
        displayType: 'text'
    },
    isDarkMode: false
};

// Expose AppState globally for debugging and testing
window.AppState = AppState;

// DOM elements
const elements = {
    form: document.getElementById('signatureForm'),
    preview: document.getElementById('signaturePreview'),
    previewContainer: document.getElementById('previewContainer'),
    copyButton: document.getElementById('copyButton'),
    howToButton: document.getElementById('howToButton'),
    themeToggle: document.getElementById('themeToggle'),
    toast: document.getElementById('toast')
};

/**
 * Defensive null check for critical elements
 */
function validateDOMElements() {
    const requiredElements = ['form', 'preview', 'previewContainer', 'copyButton'];
    const missing = requiredElements.filter(key => !elements[key]);

    if (missing.length > 0) {
        console.warn('Warning: Missing required DOM elements:', missing);
        console.warn('Application may not function correctly.');
    }

    return missing.length === 0;
}

/**
 * Initialize the application
 */
function init() {
    // Validate DOM elements exist
    if (!validateDOMElements()) {
        console.error('Critical DOM elements missing. Halting initialization.');
        return;
    }

    // Load saved theme preference
    loadThemePreference();

    // Load initial form data from values
    loadInitialFormData();

    // Setup event listeners
    setupFormListeners();
    setupFieldToggles();
    setupClearButtons();
    setupStyleSelector();
    setupZohoSocialControls();
    setupCopyButton();
    setupThemeToggle();
    setupHowToButton();

    // Initial preview update
    updatePreview();
}

/**
 * Load initial form data from input values
 */
function loadInitialFormData() {
    const textInputs = elements.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');

    textInputs.forEach(input => {
        const fieldName = input.name;
        const value = input.value.trim();

        if (value) {
            AppState.formData[fieldName] = value;
        }
    });
}

/**
 * Setup form input listeners for live preview
 */
function setupFormListeners() {
    const textInputs = elements.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');

    textInputs.forEach(input => {
        // Update on input (real-time)
        input.addEventListener('input', (e) => {
            const fieldName = e.target.name;
            const value = e.target.value.trim();

            AppState.formData[fieldName] = value;
            updatePreview();
        });

        // Validate on blur
        input.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    });
}

/**
 * Setup field toggle switches
 */
function setupFieldToggles() {
    // Exclude social toggles (they have their own handler)
    const toggles = document.querySelectorAll('.toggle-switch:not(.social-toggle)');

    toggles.forEach(toggle => {
        const fieldName = toggle.dataset.field;
        const input = document.getElementById(fieldName);

        // Set initial state based on active class
        const isActive = toggle.classList.contains('active');
        AppState.fieldToggles[fieldName] = isActive;
        if (input) {
            input.disabled = !isActive;
        }

        // Handle toggle action (shared between click and keyboard)
        const handleToggle = () => {
            const isNowActive = !toggle.classList.contains('active');

            // Toggle active class
            if (isNowActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }

            // Update ARIA state for accessibility
            toggle.setAttribute('aria-checked', isNowActive);

            // Update state
            AppState.fieldToggles[fieldName] = isNowActive;

            if (input) {
                input.disabled = !isNowActive;

                // Clear the field data if turned off
                if (!isNowActive) {
                    AppState.formData[fieldName] = '';
                } else {
                    // Restore the value if re-enabled
                    AppState.formData[fieldName] = input.value.trim();
                }
            }

            updatePreview();
        };

        // Listen for clicks
        toggle.addEventListener('click', handleToggle);

        // Listen for keyboard events (Enter and Space)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
            }
        });
    });
}

/**
 * Setup clear button functionality
 */
function setupClearButtons() {
    const clearButtons = document.querySelectorAll('.clear-btn');

    clearButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const inputName = e.target.dataset.input;
            const input = document.getElementById(inputName);

            if (input) {
                input.value = '';
                AppState.formData[inputName] = '';
                updatePreview();
                input.focus();
            }
        });
    });
}

/**
 * Setup signature style selector
 */
function setupStyleSelector() {
    const styleRadios = document.querySelectorAll('input[name="signatureStyle"]');

    styleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.signatureStyle = e.target.value;
            updatePreview();
        });
    });
}

/**
 * Setup Zoho social media controls
 */
function setupZohoSocialControls() {
    // Get all social toggle switches
    const socialToggles = document.querySelectorAll('[data-field^="social-"]');
    const socialDisplayRadios = document.querySelectorAll('input[name="socialDisplay"]');

    // Define canonical order for social channels (this determines display order)
    const canonicalOrder = ['twitter', 'linkedin', 'facebook', 'instagram'];

    // Helper function to sort channels by canonical order
    const sortChannels = (channels) => {
        return channels.sort((a, b) => {
            return canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b);
        });
    };

    // Initialize all channels as enabled by default
    AppState.socialOptions.enabled = true;
    AppState.socialOptions.channels = [...canonicalOrder]; // Use spread to create a copy

    // Setup individual toggle handlers
    socialToggles.forEach(toggle => {
        const channel = toggle.dataset.field.replace('social-', ''); // Extract channel name

        // Handle toggle action (shared between click and keyboard)
        const handleToggle = () => {
            // Toggle the active state
            const isNowActive = !toggle.classList.contains('active');

            // Update visual state
            if (isNowActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }

            // Update ARIA state for accessibility
            toggle.setAttribute('aria-checked', isNowActive);

            // Update AppState channels array
            if (isNowActive) {
                // Add channel to enabled list
                if (!AppState.socialOptions.channels.includes(channel)) {
                    AppState.socialOptions.channels.push(channel);
                    // Sort to maintain canonical order
                    AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
                }
            } else {
                // Remove channel from enabled list
                AppState.socialOptions.channels = AppState.socialOptions.channels.filter(c => c !== channel);
            }

            // Enable social section if any channels are active
            AppState.socialOptions.enabled = AppState.socialOptions.channels.length > 0;

            updatePreview();
        };

        // Listen for clicks
        toggle.addEventListener('click', handleToggle);

        // Listen for keyboard events (Enter and Space)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
            }
        });
    });

    // Text/Icon display toggle (unchanged)
    socialDisplayRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.socialOptions.displayType = e.target.value;
            updatePreview();
        });
    });

    // Setup drag-and-drop for reordering
    setupSocialDragAndDrop(canonicalOrder, sortChannels);
}

/**
 * Setup drag-and-drop functionality for social media list
 * Implements modern UX best practices:
 * - Mouse drag with visual feedback
 * - Keyboard navigation (Space to grab, Arrow keys to move, Space to drop)
 * - Screen reader announcements
 * - Touch support
 * - Smooth animations
 */
function setupSocialDragAndDrop(canonicalOrder, sortChannels) {
    const socialList = document.querySelector('.social-list');
    const listItems = document.querySelectorAll('.social-list-item');

    // Create ARIA live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // State management
    let draggedItem = null;
    let keyboardGrabbedItem = null;

    // Helper: Announce to screen readers
    const announce = (message) => {
        liveRegion.textContent = message;
    };

    // Helper: Get current position
    const getItemPosition = (item) => {
        return Array.from(socialList.children).indexOf(item) + 1;
    };

    // Helper: Get item label
    const getItemLabel = (item) => {
        return item.querySelector('.social-list-name').textContent;
    };

    // Helper: Save order to state and localStorage
    const saveOrder = () => {
        const newOrder = Array.from(socialList.querySelectorAll('.social-list-item'))
            .map(item => item.dataset.channel);

        canonicalOrder.length = 0;
        canonicalOrder.push(...newOrder);

        AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
        localStorage.setItem('socialChannelOrder', JSON.stringify(newOrder));
        updatePreview();
    };

    // Helper: Animate drop with smooth transition
    const animateDrop = (item) => {
        item.style.transition = 'all 100ms ease-out';
        setTimeout(() => {
            item.style.transition = '';
        }, 100);
    };

    // Setup mouse/touch drag for each item
    listItems.forEach((item) => {
        const dragHandle = item.querySelector('.drag-handle');
        const toggle = item.querySelector('.toggle-switch');

        // Make drag handle focusable
        dragHandle.setAttribute('tabindex', '0');
        dragHandle.setAttribute('role', 'button');
        dragHandle.setAttribute('aria-label', `Reorder ${getItemLabel(item)}. Press space to grab, arrow keys to move, space to drop.`);

        // Prevent drag from triggering on toggle switch
        toggle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });

        // Mouse drag events
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
            socialList.classList.add('drag-active');

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', item.innerHTML);

            // Custom drag image with offset
            const rect = item.getBoundingClientRect();
            e.dataTransfer.setDragImage(item, e.clientX - rect.left, e.clientY - rect.top);

            announce(`Grabbed ${getItemLabel(item)}`);

            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            socialList.classList.remove('drag-active');

            // Remove all drag-over classes
            listItems.forEach(i => {
                i.classList.remove('drag-over-top', 'drag-over-bottom');
            });

            animateDrop(item);
            saveOrder();

            announce(`Dropped ${getItemLabel(item)} at position ${getItemPosition(item)}`);

            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }

            draggedItem = null;
        });

        // Drag over - live reordering with visual feedback
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedItem && draggedItem !== item) {
                const rect = item.getBoundingClientRect();

                // Live reorder: move items in real-time as user drags
                const afterElement = (e.clientY - rect.top) > (rect.height / 2);

                if (afterElement) {
                    // Insert after this item
                    const nextSibling = item.nextSibling;
                    if (nextSibling !== draggedItem) {
                        socialList.insertBefore(draggedItem, nextSibling);
                    }
                } else {
                    // Insert before this item
                    if (item !== draggedItem) {
                        socialList.insertBefore(draggedItem, item);
                    }
                }
            }
        });

        // Drop - just finalize the position and save
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Position is already set from live reordering in dragover
        });

        // Keyboard navigation
        dragHandle.addEventListener('keydown', (e) => {
            // Space to grab/drop
            if (e.key === ' ') {
                e.preventDefault();

                if (keyboardGrabbedItem === item) {
                    // Drop
                    item.classList.remove('keyboard-grabbed');
                    keyboardGrabbedItem = null;
                    
                    animateDrop(item);
                    saveOrder();

                    announce(`Dropped ${getItemLabel(item)} at position ${getItemPosition(item)}`);

                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(20);
                    }
                } else {
                    // Grab
                    keyboardGrabbedItem = item;
                    item.classList.add('keyboard-grabbed');

                    announce(`Grabbed ${getItemLabel(item)} at position ${getItemPosition(item)}. Use arrow keys to move, space to drop.`);

                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(10);
                    }
                }
            }

            // Arrow keys to move when grabbed
            if (keyboardGrabbedItem === item && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                e.preventDefault();

                const allItems = Array.from(socialList.children);
                const currentIndex = allItems.indexOf(item);

                if (e.key === 'ArrowUp' && currentIndex > 0) {
                    // Move up
                    socialList.insertBefore(item, allItems[currentIndex - 1]);
                    announce(`Moved ${getItemLabel(item)} to position ${getItemPosition(item)}`);
                } else if (e.key === 'ArrowDown' && currentIndex < allItems.length - 1) {
                    // Move down
                    socialList.insertBefore(item, allItems[currentIndex + 2]);
                    announce(`Moved ${getItemLabel(item)} to position ${getItemPosition(item)}`);
                }

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(5);
                }
            }

            // Escape to cancel
            if (e.key === 'Escape' && keyboardGrabbedItem === item) {
                item.classList.remove('keyboard-grabbed');
                keyboardGrabbedItem = null;
                                announce(`Cancelled reordering ${getItemLabel(item)}`);
            }
        });
    });

    // Load custom order from localStorage if it exists
    const savedOrder = localStorage.getItem('socialChannelOrder');
    if (savedOrder) {
        try {
            const customOrder = JSON.parse(savedOrder);

            canonicalOrder.length = 0;
            canonicalOrder.push(...customOrder);

            customOrder.forEach(channel => {
                const item = socialList.querySelector(`[data-channel="${channel}"]`);
                if (item) {
                    socialList.appendChild(item);
                }
            });

            AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
            updatePreview();
        } catch (e) {
            console.error('Failed to load custom social channel order:', e);
        }
    }
}

/**
 * Setup copy to clipboard functionality
 */
function setupCopyButton() {
    elements.copyButton.addEventListener('click', async () => {
        // Check if we have required field (name)
        if (!AppState.formData.name) {
            showToast('Please fill in your name', 'error');
            return;
        }

        // Set loading state
        const originalText = elements.copyButton.querySelector('.btn-text').textContent;
        elements.copyButton.disabled = true;
        elements.copyButton.querySelector('.btn-text').textContent = 'Copying...';

        try {
            // Build filtered form data based on toggles
            const filteredData = getFilteredFormData();

            // Generate the signature HTML
            const signatureHtml = SignatureGenerator.generate(
                filteredData,
                AppState.signatureStyle,
                AppState.socialOptions
            );

            // Modern clipboard API
            if (navigator.clipboard && navigator.clipboard.write) {
                const blob = new Blob([signatureHtml], { type: 'text/html' });
                const plainTextBlob = new Blob([signatureHtml], { type: 'text/plain' });

                const clipboardItem = new ClipboardItem({
                    'text/html': blob,
                    'text/plain': plainTextBlob
                });

                await navigator.clipboard.write([clipboardItem]);
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(signatureHtml);
            } else {
                copyToClipboardFallback(signatureHtml);
            }

            // Show success feedback
            showCopySuccess();
            showToast('Signature copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            try {
                const filteredData = getFilteredFormData();
                const signatureHtml = SignatureGenerator.generate(
                    filteredData,
                    AppState.signatureStyle,
                    AppState.socialOptions
                );
                copyToClipboardFallback(signatureHtml);
                showCopySuccess();
                showToast('Signature copied to clipboard!', 'success');
            } catch (fallbackError) {
                showToast('Failed to copy. Please try again.', 'error');
            }
        } finally {
            // Restore button state
            elements.copyButton.disabled = false;
            elements.copyButton.querySelector('.btn-text').textContent = originalText;
        }
    });
}

/**
 * Get filtered form data based on toggle states
 */
function getFilteredFormData() {
    const filtered = { name: AppState.formData.name };

    Object.keys(AppState.fieldToggles).forEach(field => {
        if (AppState.fieldToggles[field] && AppState.formData[field]) {
            filtered[field] = AppState.formData[field];
        }
    });

    return filtered;
}

/**
 * Fallback method to copy to clipboard
 */
function copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

/**
 * Show copy success animation
 */
function showCopySuccess() {
    elements.copyButton.classList.add('success');
    const originalText = elements.copyButton.querySelector('.btn-text').textContent;
    elements.copyButton.querySelector('.btn-text').textContent = 'Copied!';

    setTimeout(() => {
        elements.copyButton.classList.remove('success');
        elements.copyButton.querySelector('.btn-text').textContent = originalText;
    }, 2000);
}

/**
 * Setup theme toggle
 */
function setupThemeToggle() {
    elements.themeToggle.addEventListener('change', (e) => {
        AppState.isDarkMode = e.target.checked;
        applyTheme();
        saveThemePreference();
    });
}

/**
 * Apply theme to preview container
 */
function applyTheme() {
    if (AppState.isDarkMode) {
        elements.previewContainer.classList.add('dark-mode');
    } else {
        elements.previewContainer.classList.remove('dark-mode');
    }
}

/**
 * Load theme preference from localStorage
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('zoho-signature-theme');
    if (savedTheme === 'dark') {
        AppState.isDarkMode = true;
        elements.themeToggle.checked = true;
        applyTheme();
    }
}

/**
 * Save theme preference to localStorage
 */
function saveThemePreference() {
    localStorage.setItem('zoho-signature-theme', AppState.isDarkMode ? 'dark' : 'light');
}

/**
 * Setup how-to button to open modal
 */
function setupHowToButton() {
    elements.howToButton.addEventListener('click', () => {
        ModalController.open();
    });
}

/**
 * Update preview with current form data
 */
function updatePreview() {
    const filteredData = getFilteredFormData();
    const previewHtml = SignatureGenerator.generatePreview(
        filteredData,
        AppState.signatureStyle,
        AppState.socialOptions
    );
    elements.preview.innerHTML = previewHtml;
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();

    // Skip validation if empty (except for required fields)
    if (!value) {
        input.setCustomValidity('');
        displayValidationError(input, '');
        return;
    }

    // Validate email - must end with @zohocorp.com
    if (input.type === 'email' && value) {
        if (!SignatureGenerator.isValidEmail(value)) {
            const message = 'Please enter a valid email address';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else if (!value.endsWith('@zohocorp.com')) {
            const message = 'Email must be a @zohocorp.com address';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');
        }
    }

    // Validate phone - accept common formats
    if (input.type === 'tel' && value) {
        if (!SignatureGenerator.isValidPhone(value)) {
            const message = 'Please enter a valid phone number (e.g., +1 (512) 555-1234)';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');
        }
    }

    // Validate URLs and clean up LinkedIn URLs
    if (input.type === 'url' && value) {
        if (!SignatureGenerator.isValidUrl(value)) {
            const message = 'Please enter a valid URL';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');

            // Clean up LinkedIn URLs
            if (input.name === 'linkedin' && value.includes('linkedin.com')) {
                const cleanedUrl = SignatureGenerator.cleanLinkedInUrl(value);
                if (cleanedUrl !== value) {
                    input.value = cleanedUrl;
                    AppState.formData.linkedin = cleanedUrl;
                }
            }
        }
    }
}

/**
 * Display or hide error message for an input
 */
function displayValidationError(input, message) {
    const inputGroup = input.closest('.input-group');
    if (!inputGroup) return;

    // Find or create error message element
    let errorElement = inputGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');

        // Insert after input-wrapper
        const inputWrapper = inputGroup.querySelector('.input-wrapper');
        if (inputWrapper) {
            inputWrapper.parentNode.insertBefore(errorElement, inputWrapper.nextSibling);
        }
    }

    // Set error ID for aria-describedby
    const errorId = `${input.id}-error`;
    errorElement.id = errorId;

    if (message) {
        // Show error
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    } else {
        // Hide error
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        input.removeAttribute('aria-describedby');
        input.removeAttribute('aria-invalid');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to focus on first input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('name').focus();
    }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
