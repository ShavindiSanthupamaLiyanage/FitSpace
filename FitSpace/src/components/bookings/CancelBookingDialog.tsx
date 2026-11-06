import { MdOutlineEventBusy } from 'react-icons/md';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDate, formatTimeRange } from '../../utils/formatters';
import type { BookingWithClass } from '../../types';

interface CancelBookingDialogProps {
  booking: BookingWithClass | null; // null keeps the dialog closed
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function CancelBookingDialog({ booking, loading, onConfirm, onCancel }: CancelBookingDialogProps) {
  return (
    <ConfirmDialog
      open={booking !== null}
      tone="danger"
      Icon={MdOutlineEventBusy}
      title="Cancel this booking?"
      message="Your spot will be released so other members can book it."
      confirmText="Cancel booking"
      cancelText="Keep booking"
      loading={loading}
      loadingText="Cancelling..."
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {booking && (
        <div className="dialog-detail">
          <div>
            <p className="dialog-detail-title">{booking.fitnessClass.title}</p>
            <p className="dialog-detail-text">
              {formatDate(booking.fitnessClass.date, 'short')} ·{' '}
              {formatTimeRange(booking.fitnessClass.startTime, booking.fitnessClass.durationMins)}
            </p>
          </div>
          <span className="dialog-detail-badge">
            {booking.spots} {booking.spots === 1 ? 'spot' : 'spots'}
          </span>
        </div>
      )}
    </ConfirmDialog>
  );
}

export default CancelBookingDialog;