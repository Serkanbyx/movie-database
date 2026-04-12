import { useEffect, useRef, useCallback } from 'react';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  children,
}) => {
  const confirmRef = useRef(null);
  const cancelRef = useRef(null);
  const modalRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled])'
        );
        if (!focusable?.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (!isOpen) return;

    cancelRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-danger text-white hover:bg-danger-hover'
      : 'bg-primary text-white hover:bg-primary-hover';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-xl border border-border-dark bg-surface-dark p-6 shadow-2xl"
      >
        <h3
          id="confirm-modal-title"
          className="mb-2 text-lg font-semibold text-text-dark"
        >
          {title}
        </h3>

        <p className="mb-4 text-sm text-text-muted-dark">{message}</p>

        {children && <div className="mb-6">{children}</div>}

        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="rounded-lg border border-border-dark px-4 py-2 text-sm font-medium text-text-dark transition-colors hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${confirmBtnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
