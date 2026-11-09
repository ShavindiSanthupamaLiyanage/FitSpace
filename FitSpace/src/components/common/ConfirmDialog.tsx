import { useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { IconType } from 'react-icons';
import {
  MdClose,
  MdOutlineDeleteOutline,
  MdOutlineHelpOutline,
  MdWarningAmber,
} from 'react-icons/md';
import Button from './Button';
import { useDialogBehavior } from '../../hooks/useDialogBehavior';
import type { ButtonVariant, DialogTone } from '../../types';
import '../../styles/dialog.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  tone?: DialogTone;
  Icon?: IconType; // replaces the default icon of the chosen tone
  confirmText?: string;
  cancelText?: string;
  loading?: boolean; // the confirmed action is running
  loadingText?: string; // e.g. "Cancelling..."
  confirmDisabled?: boolean; // e.g. until the user types the confirmation word
  children?: ReactNode; // extra content between the message and the buttons
  onConfirm: () => void;
  onCancel: () => void;
}

const toneIcons: Record<DialogTone, IconType> = {
  primary: MdOutlineHelpOutline,
  warning: MdWarningAmber,
  danger: MdOutlineDeleteOutline,
};

const confirmButtonVariants: Record<DialogTone, ButtonVariant> = {
  primary: 'primary',
  warning: 'warning',
  danger: 'danger',
};

// Reusable popup for "Are you sure?" moments: logging out, booking, cancelling, deleting...
function ConfirmDialog({
  open,
  title,
  message,
  tone = 'primary',
  Icon,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  loadingText,
  confirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const messageId = useId();

  useDialogBehavior({ open, dialogRef, onClose: onCancel, canClose: !loading });

  if (!open) return null;

  const DialogIcon = Icon ?? toneIcons[tone];

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !loading) onCancel();
  };

  // Rendered on <body> so the navbar's blur effect cannot trap the fixed overlay
  return createPortal(
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={`dialog dialog-${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <div className="dialog-body">
          <span className="dialog-icon" aria-hidden="true">
            <DialogIcon />
          </span>

          <div className="dialog-content">
            <h2 id={titleId} className="dialog-title">
              {title}
            </h2>
            <p id={messageId} className="dialog-message">
              {message}
            </p>
            {children}
          </div>

          <button
            type="button"
            className="dialog-close"
            aria-label="Close dialog"
            disabled={loading}
            onClick={onCancel}
          >
            <MdClose aria-hidden="true" />
          </button>
        </div>

        <div className="dialog-footer">
          {/* Risky actions start on the safe choice, everything else on the main action */}
          <Button
            variant="light"
            disabled={loading}
            onClick={onCancel}
            data-autofocus={tone === 'danger' ? '' : undefined}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariants[tone]}
            loading={loading}
            loadingText={loadingText}
            disabled={confirmDisabled}
            onClick={onConfirm}
            data-autofocus={tone === 'danger' ? undefined : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ConfirmDialog;