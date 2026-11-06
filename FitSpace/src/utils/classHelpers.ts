import { ALMOST_FULL_LIMIT } from '../constants/bookingSettings';
import { CLASS_CATEGORIES } from '../constants/classCategories';
import { DEFAULT_SORT, LEVEL_CHIP_OPTIONS, SORT_OPTIONS } from '../constants/classOptions';
import type {
  CategoryFilter,
  ClassFilters,
  FitnessClass,
  LevelFilter,
  SortOption,
} from '../types';

export type AvailabilityStatus = 'available' | 'almost-full' | 'full';

export interface PageOfClasses {
  items: FitnessClass[];
  currentPage: number;
  totalPages: number;
}

// ----- turning text from the address bar or a dropdown into a safe value -----
export const parseCategoryFilter = (value: string): CategoryFilter =>
  CLASS_CATEGORIES.find((category) => category.name === value)?.name ?? 'All';

export const parseLevelFilter = (value: string): LevelFilter =>
  LEVEL_CHIP_OPTIONS.find((option) => option.value === value)?.value ?? 'All';

export const parseSortOption = (value: string): SortOption =>
  SORT_OPTIONS.find((option) => option.value === value)?.value ?? DEFAULT_SORT;

export const parsePageNumber = (value: string | null): number => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
};

// ----- searching, filtering, sorting, paging -----
export const filterClasses = (
  classes: FitnessClass[],
  filters: Pick<ClassFilters, 'search' | 'category' | 'level'>,
): FitnessClass[] => {
  const searchText = filters.search.trim().toLowerCase();

  return classes.filter((fitnessClass) => {
    const matchesSearch =
      searchText === '' ||
      [fitnessClass.title, fitnessClass.instructor, fitnessClass.category].some((field) =>
        field.toLowerCase().includes(searchText),
      );
    const matchesCategory = filters.category === 'All' || fitnessClass.category === filters.category;
    const matchesLevel = filters.level === 'All' || fitnessClass.level === filters.level;
    return matchesSearch && matchesCategory && matchesLevel;
  });
};

export const sortClasses = (classes: FitnessClass[], sort: SortOption): FitnessClass[] => {
  const sortedClasses = [...classes]; // never change the original list

  switch (sort) {
    case 'duration':
      return sortedClasses.sort((first, second) => first.durationMins - second.durationMins);
    case 'spots':
      return sortedClasses.sort((first, second) => second.spotsLeft - first.spotsLeft);
    case 'price':
      return sortedClasses.sort((first, second) => first.price - second.price);
    default:
      return sortedClasses.sort((first, second) =>
        `${first.date} ${first.startTime}`.localeCompare(`${second.date} ${second.startTime}`),
      );
  }
};

export const paginateClasses = (
  classes: FitnessClass[],
  page: number,
  pageSize: number,
): PageOfClasses => {
  const totalPages = Math.max(1, Math.ceil(classes.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  return { items: classes.slice(startIndex, startIndex + pageSize), currentPage, totalPages };
};

// ----- availability -----
export const getAvailabilityStatus = (spotsLeft: number): AvailabilityStatus => {
  if (spotsLeft <= 0) return 'full';
  if (spotsLeft <= ALMOST_FULL_LIMIT) return 'almost-full';
  return 'available';
};

export const countAttendees = (fitnessClass: FitnessClass): number =>
  fitnessClass.capacity - fitnessClass.spotsLeft;

// ----- upcoming or past -----
export const getClassStart = (fitnessClass: Pick<FitnessClass, 'date' | 'startTime'>): Date =>
  new Date(`${fitnessClass.date}T${fitnessClass.startTime}:00`);

export const isClassUpcoming = (
  fitnessClass: Pick<FitnessClass, 'date' | 'startTime'>,
  now: Date = new Date(),
): boolean => getClassStart(fitnessClass).getTime() > now.getTime();