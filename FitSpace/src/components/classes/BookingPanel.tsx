import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons';
import {
  MdOutlineAccessTime,
  MdOutlineCalendarToday,
  MdOutlineGroups,
  MdOutlineLocationOn,
} from 'react-icons/md';
import AvailabilityBadge from './AvailabilityBadge';
import BookingForm from './BookingForm';
import PriceBreakdown from './PriceBreakdown';
import ButtonLink from '../common/ButtonLink';
import { isSessionValid, useAuthStore } from '../../store/authStore';
import { countAttendees, isClassUpcoming } from '../../utils/classHelpers';
import { formatDate, formatTimeRange } from '../../utils/formatters';
import type { FitnessClass } from '../../types';
import '../../styles/class-details.css';

interface BookingPanelProps {
  fitnessClass: FitnessClass;
  onBooked: () => void;
}

interface SummaryRow {
  label: string;
  value: string;
  Icon: IconType;
}

function BookingPanel({ fitnessClass, onBooked }: BookingPanelProps) {
  const user = useAuthStore((state) => state.user);
  const isSignedIn = useAuthStore(isSessionValid);
  const isFull = fitnessClass.spotsLeft <= 0;

  const summaryRows: SummaryRow[] = [
    { label: 'Date', value: formatDate(fitnessClass.date, 'short'), Icon: MdOutlineCalendarToday },
    {
      label: 'Time',
      value: formatTimeRange(fitnessClass.startTime, fitnessClass.durationMins),
      Icon: MdOutlineAccessTime,
    },
    {
      label: 'Attendees',
      value: `${countAttendees(fitnessClass)} / ${fitnessClass.capacity} attending`,
      Icon: MdOutlineGroups,
    },
    { label: 'Location', value: fitnessClass.room, Icon: MdOutlineLocationOn },
  ];

  const renderBookingActions = () => {
    if (!isClassUpcoming(fitnessClass)) {
      return (
        <>
          <p className="form-info" role="status">
            This class has already taken place.
          </p>
          <ButtonLink to="/classes" variant="outline" className="btn-block">
            Browse upcoming classes
          </ButtonLink>
        </>
      );
    }
    if (isFull) {
      return (
        <>
          <p className="form-alert" role="status">
            This class is fully booked. Please choose another time.
          </p>
          <ButtonLink to="/classes" variant="outline" className="btn-block">
            Browse other classes
          </ButtonLink>
        </>
      );
    }

    // Guests cannot book: send them to sign in, then bring them back to this class
    if (!isSignedIn || !user) {
      return (
        <>
          <PriceBreakdown pricePerSpot={fitnessClass.price} spots={1} />
          <p className="form-info">Sign in or create an account to reserve your spot.</p>
          <ButtonLink
            to="/login"
            state={{ from: `/classes/${fitnessClass.id}` }}
            variant="accent"
            size="lg"
            className="btn-block"
          >
            Sign in to book
          </ButtonLink>
        </>
      );
    }

    return (
      <BookingForm
        fitnessClass={fitnessClass}
        userId={user.id}
        initialName={user.name}
        initialEmail={user.email}
        onBooked={onBooked}
      />
    );
  };

  return (
    <section className="booking-panel" aria-labelledby="booking-panel-title">
      <div className="booking-panel-header">
        <h2 id="booking-panel-title" className="booking-panel-title">
          Booking Details
        </h2>
        <AvailabilityBadge spotsLeft={fitnessClass.spotsLeft} />
      </div>

      <dl className="booking-summary">
        {summaryRows.map(({ label, value, Icon }) => (
          <div key={label} className="booking-summary-row">
            <dt className="booking-summary-label">
              <Icon className="booking-summary-icon" aria-hidden="true" />
              {label}
            </dt>
            <dd className="booking-summary-value">{value}</dd>
          </div>
        ))}
      </dl>

      {renderBookingActions()}

      <p className="booking-terms">
        By booking, you agree to our <Link to="/terms-of-service">Terms of Service</Link>.
      </p>
    </section>
  );
}

export default BookingPanel;