import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineGroups,
  MdOutlineLocationOn,
} from 'react-icons/md';
import Button from '../common/Button';
import ButtonLink from '../common/ButtonLink';
import { getCategoryInfo } from '../../constants/classCategories';
import { formatDate, formatTimeRange } from '../../utils/formatters';
import type { BookingDisplayStatus, BookingWithClass } from '../../types';
import '../../styles/my-bookings.css';

interface BookingCardProps {
  booking: BookingWithClass;
  status: BookingDisplayStatus;
  onCancel?: () => void; // only upcoming bookings pass this, so only they show a Cancel button
}

const statusLabels: Record<BookingDisplayStatus, string> = {
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function BookingCard({ booking, status, onCancel }: BookingCardProps) {
  const { fitnessClass } = booking;
  const category = getCategoryInfo(fitnessClass.category);
  const spotsText = `${booking.spots} ${booking.spots === 1 ? 'spot' : 'spots'}`;

  return (
    <article className="booking-card">
      <div className="booking-card-media">
        {category && (
          <img
            src={category.image}
            alt={category.imageAlt}
            className="booking-card-image"
            loading="lazy"
          />
        )}
      </div>

      <div className="booking-card-main">
        <div className="booking-card-tags">
          <span className="booking-card-category">{fitnessClass.category}</span>
          <span className={`booking-status booking-status-${status}`}>{statusLabels[status]}</span>
        </div>

        <h2 className="booking-card-title">{fitnessClass.title}</h2>

        <ul className="booking-card-meta">
          <li>
            <MdOutlineCalendarToday className="booking-card-meta-icon" aria-hidden="true" />
            {formatDate(fitnessClass.date, 'short')}
          </li>
          <li>
            <MdOutlineAccessTime className="booking-card-meta-icon" aria-hidden="true" />
            {formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins)}
          </li>
          <li>
            <MdOutlineLocationOn className="booking-card-meta-icon" aria-hidden="true" />
            {fitnessClass.room}
          </li>
          <li>
            <MdOutlineGroups className="booking-card-meta-icon" aria-hidden="true" />
            {spotsText}
          </li>
        </ul>
      </div>

      <div className="booking-card-actions">
        <ButtonLink
          to={`/classes/${booking.classId}`}
          variant="light"
          size="sm"
          aria-label={`View Class: ${fitnessClass.title}`}
        >
          View Class
        </ButtonLink>
        {onCancel && (
          <Button
            variant="light"
            size="sm"
            className="booking-cancel"
            aria-label={`Cancel booking: ${fitnessClass.title}`}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </div>
    </article>
  );
}

export default BookingCard;