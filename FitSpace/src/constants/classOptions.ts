import type { ClassLevel, LevelFilter, SortOption } from '../types';

export const CLASSES_PER_PAGE = 6;
export const DEFAULT_SORT: SortOption = 'soonest';

export const LEVEL_CHIP_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'All', label: 'All Levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'soonest', label: 'Soonest first' },
  { value: 'duration', label: 'Shortest first' },
  { value: 'spots', label: 'Most spots left' },
  { value: 'price', label: 'Price: low to high' },
];

export const ADMIN_CLASSES_PER_PAGE = 10;
export const CLASS_LEVELS: ClassLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const CLASS_ROOMS: string[] = [
  'Studio A',
  'Studio B',
  'Studio C',
  'Main Hall',
  'Cycle Room',
  'Boxing Ring',
];