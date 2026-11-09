import { GENDERS } from '../constants/profileOptions';
import type { Gender, ProfileFormValues, UserProfile } from '../types';

export const parseGender = (value: string): Gender | '' =>
  GENDERS.find((gender) => gender === value) ?? '';

export const profileToFormValues = (name: string, profile: UserProfile): ProfileFormValues => ({
  name,
  phone: profile.phone,
  gender: profile.gender,
  dateOfBirth: profile.dateOfBirth,
  location: profile.location,
  interests: [...profile.interests],
  avatarUrl: profile.avatarUrl,
});

// Removes stray spaces before comparing or saving
export const normaliseProfileValues = (values: ProfileFormValues): ProfileFormValues => ({
  ...values,
  name: values.name.trim(),
  phone: values.phone.trim(),
  location: values.location.trim(),
});

export const areProfileValuesEqual = (first: ProfileFormValues, second: ProfileFormValues): boolean =>
  first.name === second.name &&
  first.phone === second.phone &&
  first.gender === second.gender &&
  first.dateOfBirth === second.dateOfBirth &&
  first.location === second.location &&
  first.avatarUrl === second.avatarUrl &&
  first.interests.length === second.interests.length &&
  first.interests.every((interest) => second.interests.includes(interest));

// Eight things count: name, email, phone, gender, date of birth, location, interests, photo.
// A brand-new account has the first two, which is 25%.
export const calculateProfileCompletion = (values: ProfileFormValues, email: string): number => {
  const filledChecks = [
    values.name.trim() !== '',
    email.trim() !== '',
    values.phone.trim() !== '',
    values.gender !== '',
    values.dateOfBirth !== '',
    values.location.trim() !== '',
    values.interests.length > 0,
    values.avatarUrl !== '',
  ];
  return Math.round((filledChecks.filter(Boolean).length / filledChecks.length) * 100);
};