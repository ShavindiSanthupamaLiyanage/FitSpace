import { useCallback, useState } from 'react';
import { MdHistory, MdOutlineCalendarToday } from 'react-icons/md';
import BookingCard from '../components/bookings/BookingCard';
import CancelBookingDialog from '../components/bookings/CancelBookingDialog';
import ButtonLink from '../components/common/ButtonLink';
import ChipGroup from '../components/common/ChipGroup';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/common/StatCard';
import { useAsyncData } from '../hooks/useAsyncData';
import { cancelBooking, getMyBookings } from '../services/bookingService';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import {
  calculateBookingStats,
  getBookingDisplayStatus,
  splitBookings,
} from '../utils/bookingHelpers';
import { formatDate } from '../utils/formatters';
import type { BookingTab, BookingWithClass } from '../types';
import '../styles/my-bookings.css';

const TAB_OPTIONS: { value: BookingTab; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Completed' },
];

interface MyBookingsContentProps {
  userId: number;
}

function MyBookingsContent({ userId }: MyBookingsContentProps) {
  const showToast = useToastStore((state) => state.showToast);

  const fetchBookings = useCallback(() => getMyBookings(userId), [userId]);
  const { state, reload, refresh } = useAsyncData(fetchBookings);

  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const [bookingToCancel, setBookingToCancel] = useState<BookingWithClass | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      await cancelBooking(bookingToCancel.id, userId);
      showToast('success', 'Booking cancelled', {
        description: `${bookingToCancel.fitnessClass.title} · ${formatDate(bookingToCancel.fitnessClass.date, 'short')}`,
      });
      setBookingToCancel(null);
      refresh(); // the cancelled booking moves to the Past tab
    } catch (error) {
      showToast('error', 'Could not cancel the booking', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const renderEmptyState = () => {
    if (activeTab === 'upcoming') {
      return (
        <EmptyState
          Icon={MdOutlineCalendarToday}
          title="No Upcoming Classes"
          message="You have nothing booked right now. Find your next class and reserve a spot."
        >
          <ButtonLink to="/classes">Browse Classes</ButtonLink>
        </EmptyState>
      );
    }
    return (
      <EmptyState
        Icon={MdHistory}
        title="No Completed Classes Yet"
        message="Once you complete your scheduled sessions, your fitness journey history will appear here."
      >
        <ButtonLink to="/classes">Book Your First Class</ButtonLink>
      </EmptyState>
    );
  };

  const renderContent = () => {
    if (state.status === 'loading') {
      return <LoadingSpinner label="Loading your bookings..." />;
    }
    if (state.status === 'error') {
      return <ErrorMessage message={state.message} onRetry={reload} />;
    }

    const now = new Date();
    const { upcoming, past } = splitBookings(state.data, now);
    const stats = calculateBookingStats(state.data, now);
    const visibleBookings = activeTab === 'upcoming' ? upcoming : past;

    return (
      <>
        <section className="stat-grid" aria-label="Booking summary">
          <StatCard
            tone="dark"
            label="Upcoming classes"
            value={stats.upcomingTotal}
            note={`${stats.upcomingThisWeek} this week`}
          />
          <StatCard
            label="Classes completed"
            value={stats.completedTotal}
            note={`+${stats.completedLast30Days} last 30 days`}
            noteColor="coral"
          />
          <StatCard
            label="Fitness streak"
            value={stats.streakWeeks}
            note={stats.streakWeeks === 1 ? 'week' : 'weeks'}
          />
        </section>

        {visibleBookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <ul className="booking-list">
            {visibleBookings.map((booking) => (
              <li key={booking.id}>
                <BookingCard
                  booking={booking}
                  status={getBookingDisplayStatus(booking, now)}
                  onCancel={activeTab === 'upcoming' ? () => setBookingToCancel(booking) : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  };

  return (
    <div className="container my-bookings">
      <div className="my-bookings-header">
        <div>
          <h1 className="my-bookings-title">My Bookings</h1>
          <p className="my-bookings-subtitle">Manage your upcoming and completed fitness classes</p>
        </div>
        <ChipGroup
          variant="segmented"
          label="Show bookings"
          options={TAB_OPTIONS}
          selected={activeTab}
          onSelect={setActiveTab}
        />
      </div>

      {renderContent()}

      <CancelBookingDialog
        booking={bookingToCancel}
        loading={isCancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => setBookingToCancel(null)}
      />
    </div>
  );
}

// Keying by user id gives every member a fresh start when someone else signs in
function MyBookingsPage() {
  const user = useAuthStore((state) => state.user);

  // ProtectedRoute already keeps signed-out visitors away from this page
  if (!user) return null;

  return <MyBookingsContent key={user.id} userId={user.id} />;
}

export default MyBookingsPage;