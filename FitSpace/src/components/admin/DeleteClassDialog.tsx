import { useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import FormInput from '../common/FormInput';
import { formatClassCode, formatDate, formatTimeRange } from '../../utils/formatters';
import type { FitnessClass } from '../../types';

const CONFIRMATION_WORD = 'DELETE';

interface DeleteClassDialogProps {
  fitnessClass: FitnessClass | null; // null keeps the dialog closed
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Render this with key={class id} so the typed text starts empty for every class
function DeleteClassDialog({ fitnessClass, loading, onConfirm, onCancel }: DeleteClassDialogProps) {
  const [typedText, setTypedText] = useState('');

  const bookedSpots = fitnessClass ? fitnessClass.capacity - fitnessClass.spotsLeft : 0;
  const needsTypedConfirmation = bookedSpots > 0; // extra care only when members are affected

  return (
    <ConfirmDialog
      open={fitnessClass !== null}
      tone="danger"
      title="Delete this class?"
      message="The class will be removed from the schedule. This cannot be undone."
      confirmText="Delete class"
      cancelText="Keep class"
      loading={loading}
      loadingText="Deleting..."
      confirmDisabled={needsTypedConfirmation && typedText !== CONFIRMATION_WORD}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {fitnessClass && (
        <>
          <div className="dialog-detail">
            <div>
              <p className="dialog-detail-title">{fitnessClass.title}</p>
              <p className="dialog-detail-text">
                {formatClassCode(fitnessClass.id)} · {formatDate(fitnessClass.date, 'short')} ·{' '}
                {formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins)}
              </p>
            </div>
          </div>

          {needsTypedConfirmation && (
            <>
              <p className="dialog-notice dialog-notice-danger">
                {bookedSpots} {bookedSpots === 1 ? 'spot is' : 'spots are'} already booked. Those
                bookings will be cancelled and removed.
              </p>
              <FormInput
                id="delete-class-confirm"
                label={`Type ${CONFIRMATION_WORD} to confirm`}
                autoComplete="off"
                value={typedText}
                onChange={(event) => setTypedText(event.target.value)}
                data-autofocus
              />
            </>
          )}
        </>
      )}
    </ConfirmDialog>
  );
}

export default DeleteClassDialog;