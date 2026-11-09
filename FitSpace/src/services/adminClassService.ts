import type { ClassInput, FitnessClass } from '../types';
import { getClassStart } from '../utils/classHelpers';
import { removeBookingsForClass } from './bookingService';
import { loadClasses } from './classService';
import { getInstructorYears } from './instructorService';

const MS_PER_MINUTE = 60 * 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requireInstructorYears = async (instructorName: string): Promise<number> => {
  const years = await getInstructorYears(instructorName);
  if (years === undefined) {
    throw new Error('Choose an instructor from the list.');
  }
  return years;
};

// A class clashes when it overlaps another one in the same room, or with the same instructor
const findScheduleClash = (
  classes: FitnessClass[],
  candidate: ClassInput,
  ignoredClassId?: number,
): string | null => {
  const candidateStart = getClassStart(candidate).getTime();
  const candidateEnd = candidateStart + candidate.durationMins * MS_PER_MINUTE;

  const clashingClass = classes.find((existing) => {
    if (existing.id === ignoredClassId) return false;
    const existingStart = getClassStart(existing).getTime();
    const existingEnd = existingStart + existing.durationMins * MS_PER_MINUTE;
    const overlaps = candidateStart < existingEnd && existingStart < candidateEnd;
    return overlaps && (existing.room === candidate.room || existing.instructor === candidate.instructor);
  });

  if (!clashingClass) return null;
  return clashingClass.room === candidate.room
    ? `${candidate.room} is already used by "${clashingClass.title}" at that time.`
    : `${candidate.instructor} is already teaching "${clashingClass.title}" at that time.`;
};

// CREATE
export const createClass = async (input: ClassInput): Promise<FitnessClass> => {
  await delay(700);
  const classes = await loadClasses();

  const clash = findScheduleClash(classes, input);
  if (clash) throw new Error(clash);

  const newClass: FitnessClass = {
    ...input,
    id: Math.max(0, ...classes.map((fitnessClass) => fitnessClass.id)) + 1,
    instructorYears: await requireInstructorYears(input.instructor),
    spotsLeft: input.capacity,
    rating: 0,
    reviews: 0,
  };
  classes.push(newClass);
  return { ...newClass };
};

// UPDATE
export const updateClass = async (classId: number, input: ClassInput): Promise<FitnessClass> => {
  await delay(700);
  const classes = await loadClasses();

  const existing = classes.find((fitnessClass) => fitnessClass.id === classId);
  if (!existing) {
    throw new Error('This class no longer exists.');
  }

  const bookedSpots = existing.capacity - existing.spotsLeft;
  if (input.capacity < bookedSpots) {
    throw new Error(`${bookedSpots} spots are already booked, so the capacity cannot be lower than that.`);
  }

  const clash = findScheduleClash(classes, input, classId);
  if (clash) throw new Error(clash);

  Object.assign(existing, {
    ...input,
    instructorYears: await requireInstructorYears(input.instructor),
    spotsLeft: input.capacity - bookedSpots, // members who already booked keep their spots
  });
  return { ...existing };
};

// DELETE (the class and every booking made for it)
export const deleteClass = async (classId: number): Promise<void> => {
  await delay(600);
  const classes = await loadClasses();

  const index = classes.findIndex((fitnessClass) => fitnessClass.id === classId);
  if (index === -1) {
    throw new Error('This class no longer exists.');
  }

  // Bookings first: if that fails, the class is still there and nothing is left half-deleted
  await removeBookingsForClass(classId);
  classes.splice(index, 1);
};