import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { IconType } from 'react-icons';
import { MdCheck, MdClose, MdErrorOutline, MdInfoOutline, MdWarningAmber } from 'react-icons/md';
import { TOAST_DURATION_MS } from '../../constants/toastSettings';
import type { ToastMessage, ToastType } from '../../types';
import '../../styles/toast.css';

const toastIcons: Record<ToastType, IconType> = {
  success: MdCheck,
  info: MdInfoOutline,
  warning: MdWarningAmber,
  error: MdErrorOutline,
};

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

// One notification card. It dismisses itself after its duration, and the timer
// pauses while the user hovers over it or has keyboard focus inside it.
function Toast({ toast, onDismiss }: ToastProps) {
  const { id, type, message, description, action, duration, surface } = toast;
  const durationMs = TOAST_DURATION_MS[duration];
  const Icon = toastIcons[type];

  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const isPaused = isHovered || hasFocus;
  const remainingMsRef = useRef(durationMs);

  useEffect(() => {
    if (durationMs === 0 || isPaused) return undefined;

    const startedAt = Date.now();
    const timerId = window.setTimeout(() => onDismiss(id), remainingMsRef.current);

    // When paused (or removed) remember how much time was left
    return () => {
      window.clearTimeout(timerId);
      remainingMsRef.current -= Date.now() - startedAt;
    };
  }, [isPaused, durationMs, id, onDismiss]);

  // Touch screens fire fake "hover" events that would leave the toast paused for good
  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') setIsHovered(true);
  };

  const handleActionClick = () => {
    action?.onClick();
    onDismiss(id);
  };

  const cardClasses = ['toast', `toast-${type}`, `toast-surface-${surface}`, isPaused ? 'toast-paused' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      // Problems are announced straight away, confirmations wait for a pause in speech
      role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <span className="toast-icon" aria-hidden="true">
        <Icon />
      </span>

      <div className="toast-body">
        <p className="toast-title">{message}</p>
        {description && <p className="toast-description">{description}</p>}
        {action && (
          <div className="toast-actions">
            <button type="button" className="toast-action" onClick={handleActionClick}>
              {action.label}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <MdClose aria-hidden="true" />
      </button>

      {durationMs > 0 && (
        <span className={`toast-progress toast-progress-${duration}`} aria-hidden="true" />
      )}
    </div>
  );
}

export default Toast;