import type { Instructor } from '../types';

const INSTRUCTORS_URL = `${import.meta.env.BASE_URL}data/instructors.json`;

// Read once from the JSON file and kept in memory, like the classes
let instructorsCache: Instructor[] | null = null;

export const getInstructors = async (): Promise<Instructor[]> => {
  if (instructorsCache === null) {
    let response: Response;
    try {
      response = await fetch(INSTRUCTORS_URL);
    } catch {
      throw new Error('Could not reach the server. Check your connection and try again.');
    }
    if (!response.ok) {
      throw new Error('Could not load the instructors. Please try again.');
    }
    instructorsCache = (await response.json()) as Instructor[];
  }
  return instructorsCache.map((instructor) => ({ ...instructor }));
};

export const getInstructorYears = async (name: string): Promise<number | undefined> => {
  const instructors = await getInstructors();
  return instructors.find((instructor) => instructor.name === name)?.years;
};
