import type { Booking, BookingRecord, BookingRequest, BookingWithClass } from '../types';
import { getClassesByIds, releaseSpots, reserveSpots } from './classService';

const BOOKINGS_URL = `${import.meta.env.BASE_URL}data/bookings.json`;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Bookings are read from the JSON file once and kept in memory (lost on refresh)
let bookingsCache: Booking[] | null = null;
let nextBookingId = 1;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toBooking = ({ bookedDaysAgo, ...details }: BookingRecord): Booking => ({
  ...details,
  bookingDate: new Date(Date.now() - bookedDaysAgo * MS_PER_DAY).toISOString(),
});

const loadBookings = async (): Promise<Booking[]> => {
  if (bookingsCache === null) {
    let response: Response;
    try {
      response = await fetch(BOOKINGS_URL);
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }
    if (!response.ok) {
      throw new Error('Could not load your bookings. Please try again.');
    }
    const records = (await response.json()) as BookingRecord[];
    bookingsCache = records.map(toBooking);
    nextBookingId = Math.max(0, ...bookingsCache.map((booking) => booking.id)) + 1;
  }
  return bookingsCache;
};

// READ: every booking of one member, joined with the class it belongs to
export const getMyBookings = async (userId: number): Promise<BookingWithClass[]> => {
  await delay(500);
  const myBookings = (await loadBookings()).filter((booking) => booking.userId === userId);
  const classes = await getClassesByIds(myBookings.map((booking) => booking.classId));

  return myBookings.flatMap((booking) => {
    const fitnessClass = classes.find((candidate) => candidate.id === booking.classId);
    return fitnessClass ? [{ ...booking, fitnessClass }] : [];
  });
};

// CREATE
export const createBooking = async (request: BookingRequest): Promise<Booking> => {
  await delay(700);
  const bookings = await loadBookings();

  const alreadyBooked = bookings.some(
    (booking) =>
      booking.userId === request.userId &&
      booking.classId === request.classId &&
      booking.status === 'Confirmed',
  );
  if (alreadyBooked) {
    throw new Error('You have already booked this class.');
  }

  // Throws if the class is full, finished or does not have enough spots
  await reserveSpots(request.classId, request.spots);

  const booking: Booking = {
    id: nextBookingId++,
    userId: request.userId,
    classId: request.classId,
    memberName: request.memberName,
    email: request.email,
    spots: request.spots,
    bookingDate: new Date().toISOString(),
    status: 'Confirmed',
  };
  bookings.push(booking);
  return booking;
};

// DELETE (a cancelled booking is kept in the history with the status "Cancelled")
export const cancelBooking = async (bookingId: number, userId: number): Promise<void> => {
  await delay(600);
  const bookings = await loadBookings();
  const booking = bookings.find((candidate) => candidate.id === bookingId);

  if (!booking) {
    throw new Error('We could not find this booking.');
  }
  if (booking.userId !== userId) {
    throw new Error('You can only cancel your own bookings.');
  }
  if (booking.status === 'Cancelled') {
    throw new Error('This booking is already cancelled.');
  }

  await releaseSpots(booking.classId, booking.spots);
  booking.status = 'Cancelled';
};