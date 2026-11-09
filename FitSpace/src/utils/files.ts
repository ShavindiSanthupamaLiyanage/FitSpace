import { AVATAR_ACCEPTED_TYPES, AVATAR_MAX_BYTES } from '../constants/profileOptions';

export const validateAvatarFile = (file: File): string => {
  if (!AVATAR_ACCEPTED_TYPES.includes(file.type)) {
    return 'Choose a JPG, PNG or WebP image.';
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return `The photo must be ${AVATAR_MAX_BYTES / (1024 * 1024)} MB or smaller.`;
  }
  return '';
};

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Could not read the image.'));
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(file);
  });