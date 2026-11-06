import type { Booking, BookingRequest } from '../types';
import { reserveSpots } from './classService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bookings: Booking[] = [];
let nextBookingId = 1;

export const createBooking = async (request: BookingRequest): Promise<Booking> => {
  await delay(700);

  const email = request.email.trim().toLowerCase();
  const alreadyBooked = bookings.some(
    (booking) =>
      booking.classId === request.classId &&
      booking.email.toLowerCase() === email &&
      booking.status === 'Confirmed',
  );
  if (alreadyBooked) {
    throw new Error('You have already booked this class.');
  }

  // Throws if the class is full or does not have enough spots
  await reserveSpots(request.classId, request.spots);

  const booking: Booking = {
    id: nextBookingId++,
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