import { useSearchParams } from 'react-router-dom';
import { DEFAULT_SORT } from '../constants/classOptions';
import {
  parseCategoryFilter,
  parseLevelFilter,
  parsePageNumber,
  parseSortOption,
} from '../utils/classHelpers';
import type { ClassFilters } from '../types';

const DEFAULT_FILTERS: ClassFilters = {
  search: '',
  category: 'All',
  level: 'All',
  sort: DEFAULT_SORT,
  page: 1,
};

export function useClassFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ClassFilters = {
    search: searchParams.get('q') ?? '',
    category: parseCategoryFilter(searchParams.get('category') ?? ''),
    level: parseLevelFilter(searchParams.get('level') ?? ''),
    sort: parseSortOption(searchParams.get('sort') ?? ''),
    page: parsePageNumber(searchParams.get('page')),
  };

  // Only values that differ from the defaults are written, so the address stays short
  const applyFilters = (next: ClassFilters) => {
    const params = new URLSearchParams();
    if (next.search) params.set('q', next.search);
    if (next.category !== DEFAULT_FILTERS.category) params.set('category', next.category);
    if (next.level !== DEFAULT_FILTERS.level) params.set('level', next.level);
    if (next.sort !== DEFAULT_FILTERS.sort) params.set('sort', next.sort);
    if (next.page > 1) params.set('page', String(next.page));
    setSearchParams(params);
  };

  // Changing any filter sends the user back to page 1
  const updateFilters = (changes: Partial<Omit<ClassFilters, 'page'>>) =>
    applyFilters({ ...filters, ...changes, page: 1 });

  const goToPage = (page: number) => applyFilters({ ...filters, page });

  const clearFilters = () => applyFilters({ ...DEFAULT_FILTERS, sort: filters.sort });

  return { filters, updateFilters, goToPage, clearFilters };
}