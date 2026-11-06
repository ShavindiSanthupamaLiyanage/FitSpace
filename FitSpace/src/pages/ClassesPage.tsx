import { useRef } from 'react';
import { MdInfoOutline, MdSearchOff } from 'react-icons/md';
import ClassCard from '../components/classes/ClassCard';
import ClassSearchBar from '../components/classes/ClassSearchBar';
import Button from '../components/common/Button';
import ChipGroup from '../components/common/ChipGroup';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import FormSelect from '../components/common/FormSelect';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { CLASSES_PER_PAGE, LEVEL_CHIP_OPTIONS, SORT_OPTIONS } from '../constants/classOptions';
import { useAsyncData } from '../hooks/useAsyncData';
import { useClassFilters } from '../hooks/useClassFilters';
import { getClasses } from '../services/classService';
import {
  filterClasses,
  paginateClasses,
  parseSortOption,
  sortClasses,
} from '../utils/classHelpers';
import '../styles/classes.css';

function ClassesPage() {
  const { filters, updateFilters, goToPage, clearFilters } = useClassFilters();
  const { state, reload } = useAsyncData(getClasses);
  const resultsRef = useRef<HTMLElement>(null);

  const hasActiveFilters =
    filters.search !== '' || filters.category !== 'All' || filters.level !== 'All';

  const handlePageChange = (page: number) => {
    goToPage(page);
    resultsRef.current?.scrollIntoView({ block: 'start' });
  };

  const renderResults = () => {
    if (state.status === 'loading') {
      return <LoadingSpinner label="Loading classes..." />;
    }
    if (state.status === 'error') {
      return <ErrorMessage message={state.message} onRetry={reload} />;
    }

    const matchingClasses = sortClasses(filterClasses(state.data, filters), filters.sort);

    if (matchingClasses.length === 0) {
      return (
        <EmptyState
          Icon={MdSearchOff}
          title="No classes found"
          message="Try a different search, or remove some of the filters."
        >
          {hasActiveFilters && <Button onClick={clearFilters}>Clear filters</Button>}
        </EmptyState>
      );
    }

    const { items, currentPage, totalPages } = paginateClasses(
      matchingClasses,
      filters.page,
      CLASSES_PER_PAGE,
    );

    return (
      <>
        <p className="classes-count" aria-live="polite">
          {matchingClasses.length} {matchingClasses.length === 1 ? 'class' : 'classes'} found
        </p>
        <ul className="class-grid">
          {items.map((fitnessClass) => (
            <li key={fitnessClass.id}>
              <ClassCard fitnessClass={fitnessClass} />
            </li>
          ))}
        </ul>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  };

  return (
    <>
      <section className="classes-hero" aria-labelledby="classes-title">
        <div className="container classes-hero-inner">
          <h1 id="classes-title" className="classes-hero-title">
            Find your <span className="classes-hero-title-accent">perfect class.</span>
          </h1>
          <p className="classes-hero-text">
            Search by style, level or instructor to find the workout that fits your week.
          </p>
          <ClassSearchBar
            searchText={filters.search}
            category={filters.category}
            onSearchSubmit={(text) => updateFilters({ search: text })}
            onCategoryChange={(category) => updateFilters({ category })}
          />
        </div>
      </section>

      <div className="container">
        <div className="classes-toolbar">
          <ChipGroup
            label="Filter by level"
            options={LEVEL_CHIP_OPTIONS}
            selected={filters.level}
            onSelect={(level) => updateFilters({ level })}
          />
          <div className="class-sort">
            <FormSelect
              id="class-sort"
              label="Sort by"
              options={SORT_OPTIONS}
              value={filters.sort}
              onChange={(event) => updateFilters({ sort: parseSortOption(event.target.value) })}
            />
          </div>
        </div>

        <p className="classes-demo-note">
          <MdInfoOutline aria-hidden="true" />
          Demo data: bookings and changes reset when you refresh the page.
        </p>

        <section ref={resultsRef} className="classes-results" aria-labelledby="class-results-title">
          <h2 id="class-results-title" className="visually-hidden">
            Class results
          </h2>
          {renderResults()}
        </section>
      </div>
    </>
  );
}

export default ClassesPage;