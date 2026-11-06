import type { ClassRecord, FitnessClass } from '../types';
import { getIsoDateFromToday } from '../utils/formatters';

const CLASSES_URL = `${import.meta.env.BASE_URL}data/classes.json`;

// The JSON file is read once and kept in memory. Changes (like booked spots) live here
// and are lost on refresh, which is what the "demo data" note on the page explains.
let classesCache: FitnessClass[] | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toFitnessClass = ({ dayOffset, ...details }: ClassRecord): FitnessClass => ({
  ...details,
  date: getIsoDateFromToday(dayOffset),
});

const loadClasses = async (): Promise<FitnessClass[]> => {
  if (classesCache === null) {
    let response: Response;
    try {
      response = await fetch(CLASSES_URL);
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }
    if (!response.ok) {
      throw new Error('Could not load the classes. Please try again.');
    }
    const records = (await response.json()) as ClassRecord[];
    classesCache = records.map(toFitnessClass);
  }
  return classesCache;
};

export const getClasses = async (): Promise<FitnessClass[]> => {
  await delay(500); // simulate network time
  const classes = await loadClasses();
  return classes.map((fitnessClass) => ({ ...fitnessClass })); // copies, so the cache stays untouched
};

// Returns null (not an error) when the id does not exist, so the page can show "Class not found"
export const getClassById = async (classId: number): Promise<FitnessClass | null> => {
  await delay(400);
  const classes = await loadClasses();
  const match = classes.find((fitnessClass) => fitnessClass.id === classId);
  return match ? { ...match } : null;
};

export const reserveSpots = async (classId: number, spots: number): Promise<void> => {
  const classes = await loadClasses();
  const target = classes.find((fitnessClass) => fitnessClass.id === classId);

  if (!target) {
    throw new Error('This class no longer exists.');
  }
  if (target.spotsLeft <= 0) {
    throw new Error('Sorry, this class is now fully booked.');
  }
  if (spots > target.spotsLeft) {
    const verb = target.spotsLeft === 1 ? 'spot is' : 'spots are';
    throw new Error(`Only ${target.spotsLeft} ${verb} left in this class.`);
  }
  target.spotsLeft -= spots;
};