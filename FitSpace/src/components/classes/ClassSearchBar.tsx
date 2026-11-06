import { useState } from 'react';
import type { FormEvent } from 'react';
import { MdFitnessCenter, MdSearch } from 'react-icons/md';
import Button from '../common/Button';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import { CLASS_CATEGORIES } from '../../constants/classCategories';
import { parseCategoryFilter } from '../../utils/classHelpers';
import type { CategoryFilter, SelectOption } from '../../types';

interface ClassSearchBarProps {
  searchText: string; // the search that is currently applied
  category: CategoryFilter;
  onSearchSubmit: (text: string) => void;
  onCategoryChange: (category: CategoryFilter) => void;
}

const categoryOptions: SelectOption[] = [
  { value: 'All', label: 'All Styles' },
  ...CLASS_CATEGORIES.map((category) => ({ value: category.name, label: category.name })),
];

function ClassSearchBar({
  searchText,
  category,
  onSearchSubmit,
  onCategoryChange,
}: ClassSearchBarProps) {
  const [draftText, setDraftText] = useState(searchText);
  const [appliedText, setAppliedText] = useState(searchText);

  // When the applied search changes from outside (for example "Clear filters"),
  // update the box to match
  if (searchText !== appliedText) {
    setAppliedText(searchText);
    setDraftText(searchText);
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearchSubmit(draftText.trim());
  };

  return (
    <form className="class-search" role="search" onSubmit={handleSubmit}>
      <div className="class-search-field">
        <MdSearch className="class-search-icon" aria-hidden="true" />
        <FormInput
          id="class-search-text"
          label="Search classes"
          hideLabel
          type="search"
          placeholder="Search classes, styles or trainers..."
          autoComplete="off"
          value={draftText}
          onChange={(event) => setDraftText(event.target.value)}
        />
      </div>

      <div className="class-search-category">
        <MdFitnessCenter className="class-search-icon" aria-hidden="true" />
        <FormSelect
          id="class-search-category"
          label="Class style"
          hideLabel
          options={categoryOptions}
          value={category}
          onChange={(event) => onCategoryChange(parseCategoryFilter(event.target.value))}
        />
      </div>

      <Button type="submit">Explore</Button>
    </form>
  );
}

export default ClassSearchBar;