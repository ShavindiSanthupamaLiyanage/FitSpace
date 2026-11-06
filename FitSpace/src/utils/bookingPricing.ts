import { SERVICE_FEE_RATE } from '../constants/bookingSettings';

export interface BookingTotals {
  classFee: number;
  serviceFee: number;
  total: number;
}

const roundToCents = (amount: number): number => Math.round(amount * 100) / 100;

export const calculateBookingTotals = (pricePerSpot: number, spots: number): BookingTotals => {
  const classFee = pricePerSpot * spots;
  const serviceFee = roundToCents(classFee * SERVICE_FEE_RATE);
  return { classFee, serviceFee, total: roundToCents(classFee + serviceFee) };
};