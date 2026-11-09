import { useEffect, useId } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement | null): HTMLElement[] =>
  container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];

// Dialogs can open on top of each other (a confirmation inside a form),
// so remember the order and let only the top one react to the keyboard
const openDialogIds: string[] = [];

interface DialogBehaviorOptions {
  open: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  canClose?: boolean; // false while something is saving
}

export function useDialogBehavior({
  open,
  dialogRef,
  onClose,
  canClose = true,
}: DialogBehaviorOptions): void {
  const dialogId = useId();

  // Runs when the dialog opens or closes: move focus in, lock page scroll,
  // and give focus back to whatever opened it
  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openDialogIds.push(dialogId);
    document.body.classList.add('dialog-open');

    const preferredElement = dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]');
    (preferredElement ?? getFocusableElements(dialogRef.current)[0])?.focus();

    return () => {
      const index = openDialogIds.indexOf(dialogId);
      if (index !== -1) openDialogIds.splice(index, 1);
      if (openDialogIds.length === 0) document.body.classList.remove('dialog-open');
      previouslyFocused?.focus();
    };
  }, [open, dialogId, dialogRef]);

  // Keyboard: Esc closes the dialog, Tab stays inside it
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (openDialogIds[openDialogIds.length - 1] !== dialogId) return;

      if (event.key === 'Escape') {
        if (canClose) onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault(); // everything is disabled while saving
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutside = !dialogRef.current?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, canClose, onClose, dialogId, dialogRef]);
}