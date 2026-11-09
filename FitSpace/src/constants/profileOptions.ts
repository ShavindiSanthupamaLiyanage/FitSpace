import type { Gender, SelectOption } from '../types';

export const GENDERS: Gender[] = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

export const GENDER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select gender' },
  ...GENDERS.map((gender) => ({ value: gender, label: gender })),
];

// SVG is left out on purpose: a user-supplied SVG file can carry scripts
export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const AVATAR_MAX_BYTES = 1024 * 1024; // 1 MB