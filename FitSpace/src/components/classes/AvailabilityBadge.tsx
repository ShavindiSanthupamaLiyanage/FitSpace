import { getAvailabilityStatus } from '../../utils/classHelpers';
import type { AvailabilityStatus } from '../../utils/classHelpers';
import '../../styles/class-card.css';

interface AvailabilityBadgeProps {
  spotsLeft: number;
}

const getBadgeLabel = (status: AvailabilityStatus, spotsLeft: number): string => {
  if (status === 'full') return 'Fully booked';
  if (status === 'almost-full') return `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`;
  return 'Available';
};

function AvailabilityBadge({ spotsLeft }: AvailabilityBadgeProps) {
  const status = getAvailabilityStatus(spotsLeft);

  return (
    <span className={`availability-badge availability-${status}`}>
      <span className="availability-dot" aria-hidden="true" />
      {getBadgeLabel(status, spotsLeft)}
    </span>
  );
}

export default AvailabilityBadge;