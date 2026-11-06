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