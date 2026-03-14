/**
 * Global toast: call showToast(message, type) from anywhere.
 * Types: 'success' | 'error' | 'info'
 */
let toastListener = null;

export function setToastListener(fn) {
  toastListener = fn;
}

export function showToast(message, type = "info") {
  if (toastListener && message) {
    toastListener({ id: Date.now() + Math.random(), message: String(message), type });
  }
}

export default showToast;
