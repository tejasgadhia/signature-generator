/**
 * Error Tracking & Recovery System
 *
 * Privacy-first error tracking:
 * - Console-only logging (no third-party services)
 * - PII stripped from error context (no formData)
 * - User manually copies error details (opt-in reporting)
 */

// Note: showErrorModal imported dynamically to avoid circular dependency
// import { showErrorModal } from '../ui/error-modal';

interface ErrorContext {
  message: string;
  stack?: string;
  userAgent: string;
  screenSize: string;
  timestamp: string;
  appState: {
    style: string;
    darkMode: boolean;
    // NO PII - formData intentionally excluded
  };
}

/**
 * Setup global error boundary to catch unhandled errors
 */
export function setupErrorBoundary(): void {
  // Catch unhandled JavaScript errors
  window.addEventListener('error', async (event) => {
    const errorContext = captureErrorContext(event.error || event.message);

    // Log to console (always, for debugging)
    console.error('Unhandled error:', errorContext);

    // Dynamically import showErrorModal to avoid circular dependency
    const { showErrorModal } = await import('../ui/error-modal');

    // Show user-friendly error modal with recovery options
    showErrorModal({
      title: 'Something went wrong',
      message: 'The app encountered an unexpected error. You can try reloading the page or clearing your data to recover.',
      errorContext,
      dismissible: false // Critical error - require action
    });

    // Prevent default error handling (avoid browser error UI)
    event.preventDefault();
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', async (event) => {
    const errorContext = captureErrorContext(event.reason);

    // Log to console
    console.error('Unhandled promise rejection:', errorContext);

    // Dynamically import showErrorModal
    const { showErrorModal } = await import('../ui/error-modal');

    // Show dismissible error (async errors often non-critical)
    showErrorModal({
      title: 'Operation failed',
      message: 'An async operation failed. You can continue using the app, but some features may not work correctly.',
      errorContext,
      dismissible: true // Non-critical - allow dismiss
    });

    // Prevent default handling
    event.preventDefault();
  });
}

/**
 * Capture error context with PII stripped
 */
function captureErrorContext(error: any): ErrorContext {
  // Get app state without PII
  const appState = getAppStateSafe();

  return {
    message: error?.message || String(error),
    stack: error?.stack,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    timestamp: new Date().toISOString(),
    appState
  };
}

/**
 * Get app state without PII (strips formData)
 */
function getAppStateSafe(): ErrorContext['appState'] {
  try {
    // Try to get AppState if available
    // @ts-ignore - AppState may not be available in some contexts
    const state = window.AppState || {};

    return {
      style: state.signatureStyle || 'unknown',
      darkMode: state.isDarkMode || false
      // NO formData - intentionally excluded to prevent PII leakage
    };
  } catch (err) {
    return {
      style: 'unknown',
      darkMode: false
    };
  }
}

/**
 * Format error context for copying to clipboard
 */
export function formatErrorForClipboard(context: ErrorContext): string {
  return JSON.stringify(context, null, 2);
}

/**
 * Clear app data and restart (recovery option)
 */
export function clearAndRestart(): void {
  try {
    // Clear all localStorage (including encrypted data)
    localStorage.clear();

    // Show confirmation
    console.log('App data cleared. Reloading...');

    // Reload page
    window.location.reload();
  } catch (err) {
    console.error('Failed to clear data:', err);
    alert('Failed to clear app data. Please clear your browser cache manually.');
  }
}
