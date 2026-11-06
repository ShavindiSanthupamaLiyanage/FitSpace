import { getClassStart, isClassUpcoming } from './classHelpers';
import type { BookingDisplayStatus, BookingStats, BookingWithClass } from '../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_PER_WEEK = 7;
const RECENT_DAYS = 30;

export const getBookingDisplayStatus = (
  booking: BookingWithClass,
  now: Date,
): BookingDisplayStatus => {
  if (booking.status === 'Cancelled') return 'cancelled';
  return isClassUpcoming(booking.fitnessClass, now) ? 'confirmed' : 'completed';
};

const byClassStart = (first: BookingWithClass, second: BookingWithClass): number =>
  getClassStart(first.fitnessClass).getTime() - getClassStart(second.fitnessClass).getTime();

// Upcoming: soonest first. Past: most recent first.
export const splitBookings = (bookings: BookingWithClass[], now: Date) => {
  const upcoming = bookings
    .filter((booking) => getBookingDisplayStatus(booking, now) === 'confirmed')
    .sort(byClassStart);
  const past = bookings
    .filter((booking) => getBookingDisplayStatus(booking, now) !== 'confirmed')
    .sort((first, second) => byClassStart(second, first));
  return { upcoming, past };
};

// Is there a completed class in the 7-day period that ended `weeksAgo` weeks ago?
const hasClassInWeek = (startTimes: number[], nowTime: number, weeksAgo: number): boolean =>
  startTimes.some((startTime) => {
    const age = nowTime - startTime;
    return age > weeksAgo * DAYS_PER_WEEK * MS_PER_DAY && age <= (weeksAgo + 1) * DAYS_PER_WEEK * MS_PER_DAY;
  });

export const calculateBookingStats = (bookings: BookingWithClass[], now: Date): BookingStats => {
  const nowTime = now.getTime();
  const upcoming = bookings.filter((booking) => getBookingDisplayStatus(booking, now) === 'confirmed');
  const completed = bookings.filter((booking) => getBookingDisplayStatus(booking, now) === 'completed');

  const upcomingThisWeek = upcoming.filter(
    (booking) => getClassStart(booking.fitnessClass).getTime() - nowTime <= DAYS_PER_WEEK * MS_PER_DAY,
  ).length;

  const completedStartTimes = completed.map((booking) => getClassStart(booking.fitnessClass).getTime());
  const completedLast30Days = completedStartTimes.filter(
    (startTime) => nowTime - startTime <= RECENT_DAYS * MS_PER_DAY,
  ).length;

  // Streak: 7-day periods in a row, counting back from today, that each contain a completed class
  let streakWeeks = 0;
  while (hasClassInWeek(completedStartTimes, nowTime, streakWeeks)) {
    streakWeeks += 1;
  }

  return {
    upcomingTotal: upcoming.length,
    upcomingThisWeek,
    completedTotal: completed.length,
    completedLast30Days,
    streakWeeks,
  };
};