import React from "react";

/**
 * Toast UI is intentionally minimal; state is managed by the parent.
 */
// PUBLIC_INTERFACE
export function Toast({ toasts, onDismiss }) {
  /** Renders toast notifications. */
  return (
    <div className="toastWrap" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          <div>
            <strong>{t.title}</strong>
            {t.message ? <span>{t.message}</span> : null}
          </div>
          <button
            type="button"
            className="toastClose"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
