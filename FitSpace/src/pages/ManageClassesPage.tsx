import { useState } from 'react';
import {
  MdAdd,
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdOutlineFitnessCenter,
  MdOutlineGroups,
  MdSearch,
  MdSearchOff,
} from 'react-icons/md';
import ClassFormModal from '../components/admin/ClassFormModal';
import ClassTable from '../components/admin/ClassTable';
import DeleteClassDialog from '../components/admin/DeleteClassDialog';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import StatCard from '../components/common/StatCard';
import { CLASS_CATEGORIES } from '../constants/classCategories';
import { ADMIN_CLASSES_PER_PAGE, LEVEL_CHIP_OPTIONS } from '../constants/classOptions';
import { useAsyncData } from '../hooks/useAsyncData';
import { deleteClass } from '../services/adminClassService';
import { getClasses } from '../services/classService';
import { getInstructors } from '../services/instructorService';
import { useToastStore } from '../store/toastStore';
import {
  calculateClassStats,
  filterClasses,
  paginateClasses,
  parseCategoryFilter,
  parseLevelFilter,
  sortClasses,
} from '../utils/classHelpers';
import { formatPrice } from '../utils/formatters';
import type { CategoryFilter, FitnessClass, LevelFilter, SelectOption } from '../types';
import '../styles/manage-classes.css';

const categoryFilterOptions: SelectOption[] = [
  { value: 'All', label: 'All Categories' },
  ...CLASS_CATEGORIES.map((category) => ({ value: category.name, label: category.name })),
];

function ManageClassesPage() {
  const showToast = useToastStore((state) => state.showToast);
  const { state, reload, refresh } = useAsyncData(getClasses);
  const { state: instructorsState, reload: reloadInstructors } = useAsyncData(getInstructors);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [level, setLevel] = useState<LevelFilter>('All');
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<FitnessClass | null>(null);
  const [classToDelete, setClassToDelete] = useState<FitnessClass | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Changing a filter sends the admin back to the first page
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleCategoryChange = (value: CategoryFilter) => {
    setCategory(value);
    setPage(1);
  };
  const handleLevelChange = (value: LevelFilter) => {
    setLevel(value);
    setPage(1);
  };
  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setPage(1);
  };

  // The form needs the instructor list, so it only opens once that has loaded
  const openForm = (fitnessClass: FitnessClass | null) => {
    if (instructorsState.status !== 'success') {
      if (instructorsState.status === 'error') {
        showToast('error', 'Could not load the instructors', { description: instructorsState.message });
        reloadInstructors();
      } else {
        showToast('info', 'Still loading instructors', { description: 'Please try again in a moment.' });
      }
      return;
    }
    setClassToEdit(fitnessClass);
    setIsFormOpen(true);
  };
  const openCreateForm = () => openForm(null);
  const openEditForm = (fitnessClass: FitnessClass) => openForm(fitnessClass);

  const handleConfirmDelete = async () => {
    if (!classToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClass(classToDelete.id);
      showToast('success', 'Class deleted', { description: classToDelete.title });
      setClassToDelete(null);
      refresh();
    } catch (error) {
      showToast('error', 'Could not delete the class', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (state.status === 'loading') {
      return <LoadingSpinner label="Loading classes..." />;
    }
    if (state.status === 'error') {
      return <ErrorMessage message={state.message} onRetry={reload} />;
    }

    const classes = state.data;
    const stats = calculateClassStats(classes);
    const fillPercent =
      stats.totalSeats > 0 ? Math.round((stats.bookedSeats / stats.totalSeats) * 100) : 0;

    const matchingClasses = sortClasses(filterClasses(classes, { search, category, level }), 'soonest');
    const { items, currentPage, totalPages } = paginateClasses(
      matchingClasses,
      page,
      ADMIN_CLASSES_PER_PAGE,
    );
    const firstShown = matchingClasses.length === 0 ? 0 : (currentPage - 1) * ADMIN_CLASSES_PER_PAGE + 1;
    const lastShown = Math.min(currentPage * ADMIN_CLASSES_PER_PAGE, matchingClasses.length);

    return (
      <>
        <section className="stat-grid stat-grid-four" aria-label="Schedule summary">
          <StatCard Icon={MdOutlineFitnessCenter} label="Total classes" value={stats.totalClasses} note="upcoming" />
          <StatCard
            Icon={MdOutlineCalendarToday}
            label="This week"
            value={stats.classesThisWeek}
            note="next 7 days"
            noteColor="coral"
          />
          <StatCard
            Icon={MdOutlineGroups}
            label="Avg. capacity"
            value={`${fillPercent}%`}
            progress={{
              value: stats.bookedSeats,
              max: stats.totalSeats,
              label: `${stats.bookedSeats} of ${stats.totalSeats} spots booked`,
            }}
          />
          <StatCard
            Icon={MdOutlineAttachMoney}
            label="Booked revenue"
            value={formatPrice(stats.bookedRevenue)}
            note="upcoming classes"
            noteColor="coral"
          />
        </section>

        <section className="manage-panel" aria-labelledby="class-schedule-title">
          <h2 id="class-schedule-title" className="visually-hidden">
            Class schedule
          </h2>

          <div className="manage-toolbar">
            <div className="manage-search">
              <MdSearch className="manage-search-icon" aria-hidden="true" />
              <FormInput
                id="manage-search"
                label="Search classes"
                hideLabel
                type="search"
                placeholder="Search class name, instructor..."
                autoComplete="off"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
              />
            </div>
            <div className="manage-filters">
              <FormSelect
                id="manage-category"
                label="Category"
                hideLabel
                options={categoryFilterOptions}
                value={category}
                onChange={(event) => handleCategoryChange(parseCategoryFilter(event.target.value))}
              />
              <FormSelect
                id="manage-level"
                label="Level"
                hideLabel
                options={LEVEL_CHIP_OPTIONS}
                value={level}
                onChange={(event) => handleLevelChange(parseLevelFilter(event.target.value))}
              />
            </div>
          </div>

          {classes.length === 0 && (
            <EmptyState title="No classes yet" message="Add your first class to start building the schedule.">
              <Button onClick={openCreateForm}>Add New Class</Button>
            </EmptyState>
          )}

          {classes.length > 0 && matchingClasses.length === 0 && (
            <EmptyState
              Icon={MdSearchOff}
              title="No classes match your filters"
              message="Try a different search, or remove some of the filters."
            >
              <Button onClick={clearFilters}>Clear filters</Button>
            </EmptyState>
          )}

          {matchingClasses.length > 0 && (
            <>
              <ClassTable classes={items} onEdit={openEditForm} onDelete={setClassToDelete} />
              <div className="manage-footer">
                <p className="manage-footer-text">
                  Showing <strong>{firstShown}</strong> to <strong>{lastShown}</strong> of{' '}
                  <strong>{matchingClasses.length}</strong> classes
                </p>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </section>
      </>
    );
  };

  return (
    <div className="container manage-classes">
      <div className="manage-header">
        <div>
          <h1 className="manage-title">Manage Classes</h1>
          <p className="manage-subtitle">Create, update and organise your fitness schedule</p>
        </div>
        <Button onClick={openCreateForm}>
          <MdAdd aria-hidden="true" />
          Add New Class
        </Button>
      </div>

      {renderContent()}

      {isFormOpen && instructorsState.status === 'success' && (
        <ClassFormModal
          key={classToEdit?.id ?? 'new'}
          classToEdit={classToEdit}
          instructors={instructorsState.data}
          onClose={() => setIsFormOpen(false)}
          onSaved={refresh}
        />
      )}

      <DeleteClassDialog
        key={classToDelete?.id ?? 'closed'}
        fitnessClass={classToDelete}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setClassToDelete(null)}
      />
    </div>
  );
}

export default ManageClassesPage;