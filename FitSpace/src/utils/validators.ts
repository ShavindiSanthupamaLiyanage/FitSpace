import { getIsoDateFromToday } from './formatters';
// Each validator returns an error message, or '' when the value is valid.

export const validateName = (value: string): string => {
  if (!value.trim()) return 'Name is required';
  if (value.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateEmail = (value: string): string => {
  if (!value.trim()) return 'Email is required';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (value: string): string => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  return '';
};

export const validateConfirmPassword = (password: string, confirm: string): string => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const validateSubject = (value: string): string => {
  if (!value.trim()) return 'Subject is required';
  if (value.trim().length < 3) return 'Subject must be at least 3 characters';
  return '';
};

export const validateMessage = (value: string): string => {
  if (!value.trim()) return 'Message is required';
  if (value.trim().length < 10) return 'Message must be at least 10 characters';
  return '';
};

export const validateSpots = (spots: number, maxSpots: number): string => {
  if (!Number.isInteger(spots) || spots < 1) return 'Choose at least 1 spot';
  if (spots > maxSpots) {
    return `You can book up to ${maxSpots} ${maxSpots === 1 ? 'spot' : 'spots'} for this class`;
  }
  return '';
};

export const validateClassTitle = (value: string): string => {
  if (!value.trim()) return 'Class name is required';
  if (value.trim().length < 3) return 'Class name must be at least 3 characters';
  if (value.trim().length > 60) return 'Class name must be 60 characters or fewer';
  return '';
};

export const validateClassDate = (value: string): string => {
  if (!value) return 'Choose a date';
  if (value < getIsoDateFromToday(0)) return 'The date cannot be in the past';
  return '';
};

export const validateClassTime = (time: string, date: string): string => {
  if (!time) return 'Choose a start time';
  if (date && new Date(`${date}T${time}:00`).getTime() <= Date.now()) {
    return 'The start time must be in the future';
  }
  return '';
};

export const validateDuration = (value: string): string => {
  const minutes = Number(value);
  if (!value.trim()) return 'Duration is required';
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 180) {
    return 'Enter a duration between 15 and 180 minutes';
  }
  return '';
};

export const validateCapacity = (value: string, bookedSpots = 0): string => {
  const capacity = Number(value);
  if (!value.trim()) return 'Capacity is required';
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100) {
    return 'Enter a capacity between 1 and 100';
  }
  if (capacity < bookedSpots) {
    return `${bookedSpots} spots are already booked, so capacity cannot be lower`;
  }
  return '';
};

export const validatePrice = (value: string): string => {
  const price = Number(value);
  if (!value.trim()) return 'Price is required';
  if (Number.isNaN(price) || price < 1 || price > 500) return 'Enter a price between Rs. 1 and Rs. 10000';
  return '';
};

export const validateDescription = (value: string): string => {
  if (!value.trim()) return 'Description is required';
  if (value.trim().length < 20) return 'Description must be at least 20 characters';
  if (value.trim().length > 300) return 'Description must be 300 characters or fewer';
  return '';
};