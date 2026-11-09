import type { ProfileFormValues, UserProfile } from '../types';
import { getIsoDateFromToday } from '../utils/formatters';
import { parseGender } from '../utils/profileHelpers';
import { updateUserName } from './authService';

const PROFILES_URL = `${import.meta.env.BASE_URL}data/profiles.json`;

// Read once from the JSON file and kept in memory (lost on refresh, like the rest of the demo data)
let profilesCache: UserProfile[] | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const loadProfiles = async (): Promise<UserProfile[]> => {
  if (profilesCache === null) {
    let response: Response;
    try {
      response = await fetch(PROFILES_URL);
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }
    if (!response.ok) {
      throw new Error('Could not load your profile. Please try again.');
    }
    profilesCache = (await response.json()) as UserProfile[];
  }
  return profilesCache;
};

const copyProfile = (profile: UserProfile): UserProfile => ({
  ...profile,
  interests: [...profile.interests],
});

// READ. A member who just registered has no record yet, so an empty one is created.
export const getProfile = async (userId: number): Promise<UserProfile> => {
  await delay(400);
  const profiles = await loadProfiles();

  const existing = profiles.find((profile) => profile.userId === userId);
  if (existing) return copyProfile(existing);

  const newProfile: UserProfile = {
    userId,
    phone: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    interests: [],
    avatarUrl: '',
    joinedAt: getIsoDateFromToday(0),
  };
  profiles.push(newProfile);
  return copyProfile(newProfile);
};

// UPDATE
export const saveProfile = async (userId: number, values: ProfileFormValues): Promise<UserProfile> => {
  await delay(700);
  const profiles = await loadProfiles();

  const profile = profiles.find((candidate) => candidate.userId === userId);
  if (!profile) {
    throw new Error('We could not find your profile. Please refresh the page and try again.');
  }

  await updateUserName(userId, values.name);
  Object.assign(profile, {
    phone: values.phone,
    gender: parseGender(values.gender),
    dateOfBirth: values.dateOfBirth,
    location: values.location,
    interests: [...values.interests],
    avatarUrl: values.avatarUrl,
  });
  return copyProfile(profile);
};